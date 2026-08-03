import assert from "node:assert/strict";
import { setImmediate as waitForImmediate } from "node:timers/promises";
import { pets } from "@jojo-codex-pet/catalog";
import { bindInstallActions } from "./install-actions";
import { installCommandsFor, openInCodexUrlFor } from "./install-links";

class FakeActionElement extends EventTarget {
  dataset: Record<string, string>;
  textContent: string;

  constructor(dataset: Record<string, string>, textContent: string) {
    super();
    this.dataset = dataset;
    this.textContent = textContent;
  }
}

class FakeRoot {
  constructor(
    private readonly buttons: FakeActionElement[] = [],
    private readonly links: FakeActionElement[] = []
  ) {}

  querySelectorAll(selector: string) {
    return selector.startsWith("[data-copy-command]") ? this.buttons : this.links;
  }
}

const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
const originalFetch = globalThis.fetch;

const releasedPets = pets.filter((pet) => pet.status === "released" && pet.packagePath);
assert.equal(releasedPets.length, 24, "the install contract must cover every Released pet");
for (const pet of releasedPets) {
  const commands = installCommandsFor(pet.id);
  assert.equal(commands.bash, `curl -fsSL https://pixelstand.pet/install.sh | bash -s -- ${pet.id}`);
  assert.equal(commands.powershell, `& ([scriptblock]::Create((irm https://pixelstand.pet/install.ps1))) ${pet.id}`);
  assert.equal(commands.npx, `npx --yes --package=github:geoqiao/jojo-codex-pet jojo-codex-pet ${pet.id}`);

  const deepLink = new URL(openInCodexUrlFor({ nameEn: pet.name.en, packagePath: pet.packagePath! }));
  assert.equal(deepLink.protocol, "codex:");
  assert.equal(deepLink.hostname, "pets");
  assert.equal(deepLink.pathname, "/install");
  assert.equal(deepLink.searchParams.get("name"), pet.name.en);
  assert.equal(deepLink.searchParams.get("imageUrl"), `https://pixelstand.pet${pet.packagePath}/spritesheet.webp`);
  assert.equal(deepLink.searchParams.get("spriteVersionNumber"), "2");
}

const setBrowserGlobals = ({
  writeText,
  sendBeacon,
  fetch
}: {
  writeText: (command: string) => Promise<void>;
  sendBeacon?: (url: string, body: Blob) => boolean;
  fetch: typeof globalThis.fetch;
}) => {
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { clipboard: { writeText }, ...(sendBeacon ? { sendBeacon } : {}) }
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: { pathname: "/install/" },
      setTimeout: () => 0
    }
  });
  globalThis.fetch = fetch;
};

try {
  let resolveClipboard!: () => void;
  const clipboardPending = new Promise<void>((resolve) => { resolveClipboard = resolve; });
  const copiedCommands: string[] = [];
  const requests: RequestInit[] = [];
  setBrowserGlobals({
    writeText: (command) => {
      copiedCommands.push(command);
      return clipboardPending;
    },
    fetch: (async (_input: string | URL | Request, init?: RequestInit) => {
      requests.push(init ?? {});
      return new Response(null, { status: 200 });
    }) as typeof globalThis.fetch
  });

  const raceButton = new FakeActionElement({
    copyCommand: "command-for-pet-a",
    copyLabel: "Copy",
    copiedLabel: "Copied",
    actionPetId: "part-03-jotaro-kujo",
    actionMethod: "bash",
    actionLocale: "en"
  }, "Copy");
  bindInstallActions(new FakeRoot([raceButton]) as unknown as ParentNode);
  raceButton.dispatchEvent(new Event("click"));

  raceButton.dataset.copyCommand = "command-for-pet-b";
  raceButton.dataset.actionPetId = "part-03-star-platinum";
  resolveClipboard();
  await waitForImmediate();

  assert.deepEqual(copiedCommands, ["command-for-pet-a"], "Copy must use the command visible at click time");
  assert.equal(requests.length, 1);
  const racePayload = JSON.parse(String(requests[0].body));
  assert.equal(racePayload.pet_id, "part-03-jotaro-kujo", "Copy attribution must snapshot the pet before awaiting Clipboard");
  assert.equal(raceButton.textContent, "Copied");

  let failureRequests = 0;
  setBrowserGlobals({
    writeText: async () => { throw new Error("clipboard denied"); },
    fetch: (async () => {
      failureRequests += 1;
      return new Response(null, { status: 200 });
    }) as typeof globalThis.fetch
  });
  const failureButton = new FakeActionElement({
    copyCommand: "command",
    copyLabel: "Copy",
    copiedLabel: "Copied",
    copyFailedLabel: "Copy failed",
    actionPetId: "part-03-jotaro-kujo",
    actionMethod: "npx",
    actionLocale: "en"
  }, "Copy");
  bindInstallActions(new FakeRoot([failureButton]) as unknown as ParentNode);
  failureButton.dispatchEvent(new Event("click"));
  await waitForImmediate();
  assert.equal(failureRequests, 0, "Clipboard rejection must not count an action");
  assert.equal(failureButton.textContent, "Copy failed", "Clipboard rejection must show actionable failure feedback");

  setBrowserGlobals({
    writeText: async () => undefined,
    fetch: (() => Promise.reject(new Error("endpoint unavailable"))) as typeof globalThis.fetch
  });
  const degradedButton = new FakeActionElement({
    copyCommand: "command",
    copyLabel: "Copy",
    copiedLabel: "Copied",
    actionPetId: "part-03-jotaro-kujo",
    actionMethod: "powershell",
    actionLocale: "zh-CN"
  }, "复制");
  bindInstallActions(new FakeRoot([degradedButton]) as unknown as ParentNode);
  degradedButton.dispatchEvent(new Event("click"));
  await waitForImmediate();
  assert.equal(degradedButton.textContent, "Copied", "Endpoint failure must not undo a successful Clipboard action");

  const beacons: Array<{ url: string; body: Blob }> = [];
  setBrowserGlobals({
    writeText: async () => undefined,
    sendBeacon: (url, body) => {
      beacons.push({ url, body });
      return true;
    },
    fetch: (async () => new Response(null, { status: 200 })) as typeof globalThis.fetch
  });
  const deepLink = new FakeActionElement({
    actionPetId: "part-03-star-platinum",
    actionMethod: "codex",
    actionLocale: "en"
  }, "Open in Codex");
  bindInstallActions(new FakeRoot([], [deepLink]) as unknown as ParentNode);
  const click = new Event("click", { cancelable: true });
  deepLink.dispatchEvent(click);
  assert.equal(click.defaultPrevented, false, "Deep Link tracking must not prevent or wait for navigation");
  assert.equal(beacons.length, 1, "Deep Link click must queue one beacon synchronously");
  assert.equal(beacons[0].url, "/api/actions.php");
  const beaconPayload = JSON.parse(await beacons[0].body.text());
  assert.equal(beaconPayload.event_type, "install_deeplink_click");
  assert.equal(beaconPayload.pet_id, "part-03-star-platinum");

  let deepLinkFallbackRequests = 0;
  setBrowserGlobals({
    writeText: async () => undefined,
    sendBeacon: () => false,
    fetch: (() => {
      deepLinkFallbackRequests += 1;
      return Promise.reject(new Error("endpoint unavailable"));
    }) as typeof globalThis.fetch
  });
  const degradedDeepLink = new FakeActionElement({
    actionPetId: "part-03-jotaro-kujo",
    actionMethod: "codex",
    actionLocale: "en"
  }, "Open in Codex");
  bindInstallActions(new FakeRoot([], [degradedDeepLink]) as unknown as ParentNode);
  const degradedClick = new Event("click", { cancelable: true });
  degradedDeepLink.dispatchEvent(degradedClick);
  await waitForImmediate();
  assert.equal(degradedClick.defaultPrevented, false, "Rejected Deep Link fallback tracking must not prevent navigation");
  assert.equal(deepLinkFallbackRequests, 1, "A declined beacon must attempt one non-blocking fallback request");

  console.log("Install action client OK: all Released links agree, Copy snapshots attribution, Clipboard failures stay visible, and Deep Links stay unblocked.");
} finally {
  if (originalNavigator) Object.defineProperty(globalThis, "navigator", originalNavigator);
  else delete (globalThis as { navigator?: unknown }).navigator;
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else delete (globalThis as { window?: unknown }).window;
  globalThis.fetch = originalFetch;
}
