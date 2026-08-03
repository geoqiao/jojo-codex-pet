import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { chmod, copyFile, mkdir, mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const temporaryRoot = await mkdtemp(join(tmpdir(), "jojo-actions-test-"));
const documentRoot = join(temporaryRoot, "public");
const apiDirectory = join(documentRoot, "api");
const storageDirectory = join(temporaryRoot, "private");
const storePath = join(storageDirectory, ".jojo-codex-pet-actions.json");

await mkdir(apiDirectory, { recursive: true });
await mkdir(storageDirectory, { recursive: true });
await copyFile(join(here, "actions.php"), join(apiDirectory, "actions.php"));
const allowlistPath = join(apiDirectory, "released-pet-ids.json");
await writeFile(
  allowlistPath,
  `${JSON.stringify(["part-03-jotaro-kujo", "part-03-star-platinum"], null, 2)}\n`,
  "utf8"
);

const faultProbePath = join(temporaryRoot, "action-store-fault-probe.php");
await writeFile(faultProbePath, `<?php

declare(strict_types=1);

define('JOJO_ACTIONS_FUNCTIONS_ONLY', true);
require $argv[1];

$destination = $argv[2];
$original = "historical aggregate\\n";
file_put_contents($destination, $original);
$threw = false;

try {
    writeActionStore(
        $destination,
        ['replacement' => ['count' => 1]],
        static function (string $temporary, string $contents): int|false {
            $partial = substr($contents, 0, -1);
            return file_put_contents($temporary, $partial);
        }
    );
} catch (RuntimeException $error) {
    $threw = str_contains($error->getMessage(), 'complete action store');
}

$temporaryFiles = glob(dirname($destination) . '/.jojo-pet-actions-*');
if (!$threw || file_get_contents($destination) !== $original || $temporaryFiles === false || count($temporaryFiles) !== 0) {
    fwrite(STDERR, "Short-write guard failed.\\n");
    exit(1);
}
`, "utf8");

const reservePort = () => new Promise((resolve, reject) => {
  const server = createServer();
  server.on("error", reject);
  server.listen(0, "127.0.0.1", () => {
    const address = server.address();
    if (!address || typeof address === "string") {
      server.close();
      reject(new Error("Unable to reserve a local PHP test port."));
      return;
    }
    const { port } = address;
    server.close((error) => error ? reject(error) : resolve(port));
  });
});

const port = await reservePort();
const baseUrl = `http://127.0.0.1:${port}/api/actions.php`;
const php = spawn("php", ["-d", "display_errors=1", "-S", `127.0.0.1:${port}`, "-t", documentRoot], {
  env: { ...process.env, JOJO_ACTIONS_STORAGE_DIR: storageDirectory },
  stdio: ["ignore", "pipe", "pipe"]
});
let phpOutput = "";
php.stdout.on("data", (chunk) => { phpOutput += chunk.toString(); });
php.stderr.on("data", (chunk) => { phpOutput += chunk.toString(); });

const waitForServer = async () => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.status === 405) return;
    } catch {
      // PHP may still be binding the socket.
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`PHP test server did not start.\n${phpOutput}`);
};

const request = (body, method = "POST") => fetch(baseUrl, {
  method,
  headers: { "content-type": "application/json" },
  body: method === "POST" ? body : undefined
});

const postJson = (payload) => request(JSON.stringify(payload));
const expectJsonError = async (response, status, payload, label) => {
  assert.equal(response.status, status, `${label} must return ${status}`);
  const body = await response.text();
  assert.equal(body, JSON.stringify(payload), `${label} must preserve the JSON error contract`);
  assert.ok(!body.includes(temporaryRoot), `${label} must not expose a private path`);
};
const readStoreText = async () => {
  try {
    return await readFile(storePath, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return "";
    throw error;
  }
};

const basePayload = {
  event_type: "install_command_copy_success",
  pet_id: "part-03-jotaro-kujo",
  method: "bash",
  locale: "en",
  landing_path: "/install/"
};

try {
  await waitForServer();

  const shortWriteProbe = spawnSync(
    "php",
    [faultProbePath, join(here, "actions.php"), join(storageDirectory, "short-write-probe.json")],
    { encoding: "utf8" }
  );
  assert.equal(
    shortWriteProbe.status,
    0,
    `short writes must preserve the destination and remove the temporary file\n${shortWriteProbe.stdout}${shortWriteProbe.stderr}`
  );

  const getResponse = await request(undefined, "GET");
  assert.equal(getResponse.status, 405, "GET must be rejected");
  assert.equal(await readStoreText(), "", "rejected methods must not create storage");

  const accepted = await postJson({
    ...basePayload,
    visitor_id: "must-not-be-stored",
    raw_referrer: "https://example.test/private?q=secret"
  });
  assert.equal(accepted.status, 200, "valid Copy action must be accepted");
  assert.deepEqual(await accepted.json(), { accepted: true });

  let store = JSON.parse(await readStoreText());
  assert.equal(Object.keys(store).length, 1, "one aggregate key must be created");
  let [entry] = Object.values(store);
  assert.deepEqual(
    Object.keys(entry).sort(),
    ["count", "day", "event_type", "landing_path", "locale", "method", "pet_id", "updated_at"].sort(),
    "storage must contain only the approved aggregate fields"
  );
  assert.equal(entry.count, 1);
  assert.equal(entry.pet_id, basePayload.pet_id);
  assert.equal(entry.method, "bash");
  assert.equal(entry.landing_path, "/install/");
  assert.match(entry.day, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(!JSON.stringify(store).includes("must-not-be-stored"));
  assert.ok(!JSON.stringify(store).includes("example.test"));

  const duplicate = await postJson(basePayload);
  assert.equal(duplicate.status, 200);
  store = JSON.parse(await readStoreText());
  [entry] = Object.values(store);
  assert.equal(entry.count, 2, "identical actions must increment one aggregate key");

  const deepLink = await postJson({
    event_type: "install_deeplink_click",
    pet_id: "part-03-star-platinum",
    method: "codex",
    locale: "zh-CN",
    landing_path: "/zh-CN/pets/part-03-star-platinum/"
  });
  assert.equal(deepLink.status, 200, "valid Codex deep-link action must be accepted");
  store = JSON.parse(await readStoreText());
  assert.equal(Object.keys(store).length, 2, "different approved dimensions must create a second aggregate key");

  const beforeInvalidRequests = await readStoreText();
  const invalidCases = [
    [{ ...basePayload, pet_id: "part-99-unknown" }, 400, "unknown pet"],
    [{ ...basePayload, event_type: "install_success" }, 400, "unknown event"],
    [{ ...basePayload, method: "curl" }, 400, "unknown method"],
    [{ ...basePayload, method: "codex" }, 400, "event/method mismatch"],
    [{ ...basePayload, locale: "fr" }, 400, "unknown locale"],
    [{ ...basePayload, landing_path: "/not-canonical/" }, 400, "unknown path"],
    [{ ...basePayload, landing_path: "/zh-CN/install/" }, 400, "locale/path mismatch"],
    [{ ...basePayload, landing_path: "/pets/part-03-star-platinum/" }, 400, "pet/path mismatch"]
  ];

  for (const [payload, status, label] of invalidCases) {
    const response = await postJson(payload);
    assert.equal(response.status, status, `${label} must be rejected`);
    assert.equal(await readStoreText(), beforeInvalidRequests, `${label} must not mutate storage`);
  }

  const malformed = await request("{not-json");
  assert.equal(malformed.status, 400, "malformed JSON must be rejected");
  assert.equal(await readStoreText(), beforeInvalidRequests, "malformed JSON must not mutate storage");

  const oversized = await request(JSON.stringify({ ...basePayload, padding: "x".repeat(3000) }));
  assert.equal(oversized.status, 413, "oversized bodies must be rejected");
  assert.equal(await readStoreText(), beforeInvalidRequests, "oversized bodies must not mutate storage");

  await chmod(storePath, 0o000);
  try {
    const unreadable = await postJson(basePayload);
    await expectJsonError(unreadable, 503, { error: "actions_unavailable" }, "unreadable existing store");
  } finally {
    await chmod(storePath, 0o600);
  }
  assert.equal(await readStoreText(), beforeInvalidRequests, "a read failure must preserve historical aggregates");

  await writeFile(storePath, "", "utf8");
  try {
    const empty = await postJson(basePayload);
    await expectJsonError(empty, 503, { error: "actions_unavailable" }, "empty existing store");
    assert.equal(await readStoreText(), "", "an empty existing store must not be replaced");
  } finally {
    await writeFile(storePath, beforeInvalidRequests, "utf8");
  }

  await chmod(allowlistPath, 0o000);
  try {
    const unreadableAllowlist = await postJson(basePayload);
    await expectJsonError(unreadableAllowlist, 503, { error: "catalog_unavailable" }, "unreadable allowlist");
  } finally {
    await chmod(allowlistPath, 0o600);
  }
  assert.equal(await readStoreText(), beforeInvalidRequests, "an allowlist read failure must not mutate storage");

  const storeBackup = `${storePath}.backup`;
  await rename(storePath, storeBackup);
  await mkdir(storePath);
  try {
    const failedRename = await postJson(basePayload);
    await expectJsonError(failedRename, 503, { error: "actions_unavailable" }, "failed atomic replacement");
  } finally {
    await rm(storePath, { recursive: true, force: true });
    await rename(storeBackup, storePath);
  }
  assert.equal(await readStoreText(), beforeInvalidRequests, "a failed atomic replacement must preserve historical aggregates");

  console.log("Action endpoint integration OK: valid aggregates increment; invalid, unreadable, empty, oversized, short-write, and rename-failure paths preserve storage without leaking paths.");
} finally {
  php.kill("SIGTERM");
  await new Promise((resolve) => {
    if (php.exitCode !== null) resolve();
    else php.once("exit", resolve);
  });
  await rm(temporaryRoot, { recursive: true, force: true });
}
