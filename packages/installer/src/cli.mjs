#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { get as httpGet } from "node:http";
import { get as httpsGet } from "node:https";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const DEFAULT_BASE_URL = "https://jojo-preview.easytry.shop/packages";

const usage = () => {
  console.log(`JoJo Codex Pet installer

Usage:
  jojo-codex-pet <part-scoped-pet-id> [--base-url URL] [--codex-home PATH]

Example:
  jojo-codex-pet part-03-jotaro-kujo

Installs only the selected pet. No install analytics are collected.`);
};

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  usage();
  process.exit(0);
}

const option = (name) => {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  if (!args[index + 1]) throw new Error(`${name} requires a value`);
  return args[index + 1];
};

const petId = args.find((value, index) => !value.startsWith("-") && args[index - 1] !== "--base-url" && args[index - 1] !== "--codex-home");
if (!petId) {
  usage();
  process.exit(1);
}
if (!/^part-\d{2}-[a-z0-9-]+$/.test(petId)) {
  throw new Error(`Invalid Part-scoped pet ID: ${petId}`);
}

const baseUrl = (option("--base-url") ?? process.env.JOJO_CODEX_PET_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, "");
const codexHome = resolve(option("--codex-home") ?? process.env.CODEX_HOME ?? join(homedir(), ".codex"));
const packageUrl = `${baseUrl}/${petId}`;

const fetchBytes = (url, redirectCount = 0) => new Promise((resolveDownload, rejectDownload) => {
  const parsedUrl = new URL(url);
  const get = parsedUrl.protocol === "https:" ? httpsGet : parsedUrl.protocol === "http:" ? httpGet : undefined;
  if (!get) {
    rejectDownload(new Error(`Unsupported download protocol: ${parsedUrl.protocol}`));
    return;
  }

  const request = get(parsedUrl, { headers: { "user-agent": "jojo-codex-pet-installer" } }, (response) => {
    const status = response.statusCode ?? 0;
    if (status >= 300 && status < 400 && response.headers.location) {
      response.resume();
      if (redirectCount >= 5) {
        rejectDownload(new Error(`Too many redirects while downloading: ${url}`));
        return;
      }
      fetchBytes(new URL(response.headers.location, parsedUrl).href, redirectCount + 1).then(resolveDownload, rejectDownload);
      return;
    }
    if (status < 200 || status >= 300) {
      response.resume();
      rejectDownload(new Error(`Download failed (${status}): ${url}`));
      return;
    }

    const chunks = [];
    response.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    response.on("end", () => resolveDownload(Buffer.concat(chunks)));
    response.on("error", rejectDownload);
  });
  request.setTimeout(15_000, () => request.destroy(new Error(`Download timed out: ${url}`)));
  request.on("error", rejectDownload);
});

const sha256 = (data) => createHash("sha256").update(data).digest("hex");

const parseChecksums = (text) => {
  const entries = new Map();
  for (const line of text.trim().split(/\r?\n/)) {
    const match = /^([a-f0-9]{64})\s{2}([^/\\]+)$/.exec(line);
    if (!match) throw new Error("Package checksum file is malformed");
    entries.set(match[2], match[1]);
  }
  return entries;
};

const webpDimensions = (data) => {
  if (data.length < 30 || data.toString("ascii", 0, 4) !== "RIFF" || data.toString("ascii", 8, 12) !== "WEBP") {
    throw new Error("Spritesheet is not a valid WebP file");
  }
  const chunk = data.toString("ascii", 12, 16);
  if (chunk === "VP8L" && data[20] === 0x2f) {
    const bits = data.readUInt32LE(21);
    return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
  }
  if (chunk === "VP8X") return [data.readUIntLE(24, 3) + 1, data.readUIntLE(27, 3) + 1];
  throw new Error(`Unsupported WebP chunk: ${chunk || "unknown"}`);
};

console.log(`Downloading ${petId}...`);
const [checksumsData, manifestData, spritesheetData] = await Promise.all([
  fetchBytes(`${packageUrl}/checksums.sha256`),
  fetchBytes(`${packageUrl}/pet.json`),
  fetchBytes(`${packageUrl}/spritesheet.webp`)
]);

const checksums = parseChecksums(checksumsData.toString("utf8"));
for (const [filename, data] of [["pet.json", manifestData], ["spritesheet.webp", spritesheetData]]) {
  const expected = checksums.get(filename);
  if (!expected || sha256(data) !== expected) throw new Error(`${filename} failed SHA-256 verification`);
}

const manifest = JSON.parse(manifestData.toString("utf8"));
if (manifest.id !== petId) throw new Error(`Manifest ID mismatch: expected ${petId}`);
if (manifest.spriteVersionNumber !== 2) throw new Error("Only Codex pet v2 packages are accepted");
if (manifest.spritesheetPath !== "spritesheet.webp") throw new Error("Manifest spritesheetPath must be spritesheet.webp");
const [width, height] = webpDimensions(spritesheetData);
if (width !== 1536 || height !== 2288) throw new Error(`Expected a 1536x2288 v2 spritesheet, found ${width}x${height}`);

const petsDirectory = join(codexHome, "pets");
const targetDirectory = join(petsDirectory, petId);
const nonce = `${process.pid}-${Date.now()}`;
const temporaryDirectory = join(petsDirectory, `.install-${petId}-${nonce}`);
const backupDirectory = join(petsDirectory, `.backup-${petId}-${nonce}`);

await mkdir(temporaryDirectory, { recursive: true });
await writeFile(join(temporaryDirectory, "pet.json"), manifestData);
await writeFile(join(temporaryDirectory, "spritesheet.webp"), spritesheetData);

let backedUp = false;
try {
  try {
    await rename(targetDirectory, backupDirectory);
    backedUp = true;
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  await rename(temporaryDirectory, targetDirectory);
  if (backedUp) await rm(backupDirectory, { recursive: true, force: true });
} catch (error) {
  await rm(temporaryDirectory, { recursive: true, force: true });
  if (backedUp) await rename(backupDirectory, targetDirectory);
  throw error;
}

console.log(`Installed ${manifest.displayName} to ${targetDirectory}`);
console.log("Open Codex Settings > Pets, select Refresh, then choose the pet.");
