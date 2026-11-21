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
    private readonly links: FakeActionElement[] = [],
    private readonly pageLinkButtons: FakeActionElement[] = []
  ) {}

  querySelectorAll(selector: string) {
    if (selector.startsWith("[data-copy-command]")) return this.buttons;
    if (selector.startsWith("[data-copy-page-link]")) return this.pageLinkButtons;
    return this.links;
  }
}

const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
const originalFetch = globalThis.fetch;

const releasedPets = pets.filter((pet) => pet.status === "released" && pet.packagePath);
assert.equal(releasedPets.length, 36, "the install contract must cover every Released pet");
for (const pet of releasedPets) {
  const commands = installCommandsFor(pet.id);
  assert.equal(commands.bash, `curl -fsSL https://pixelstand.geoqiao.me/install.sh | bash -s -- ${pet.id}`);
  assert.equal(commands.powershell, `& ([scriptblock]::Create((irm https://pixelstand.geoqiao.me/install.ps1))) ${pet.id}`);
  assert.equal(commands.npx, `npx --yes --package=github:geoqiao/jojo-codex-pet jojo-codex-pet ${pet.id}`);

  const deepLink = new URL(openInCodexUrlFor({ nameEn: pet.name.en, packagePath: pet.packagePath! }));
  assert.equal(deepLink.protocol, "codex:");
  assert.equal(deepLink.hostname, "pets");
  assert.equal(deepLink.pathname, "/install");
  assert.equal(deepLink.searchParams.get("name"), pet.name.en);
  assert.equal(deepLink.searchParams.get("imageUrl"), `https://pixelstand.geoqiao.me${pet.packagePath}/spritesheet.webp`);
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
      location: { origin: "https://local.test", pathname: "/install/" },
      setTimeout: () => 0
    }
  });
  globalThis.fetch = fetch;
};

try {
  let resolveClipboard!: () => void;
  const clipboardPending = new Promise<void>((resolve) => { resolveClipboard = resolve; });
  const copiedCommands: string[] = [];
  let unexpectedRequests = 0;
  let unexpectedBeacons = 0;
  setBrowserGlobals({
    writeText: (command) => {
      copiedCommands.push(command);
      return clipboardPending;
    },
    sendBeacon: () => {
      unexpectedBeacons += 1;
      return true;
    },
    fetch: (async () => {
      unexpectedRequests += 1;
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
  resolveClipboard();
  await waitForImmediate();

  assert.deepEqual(copiedCommands, ["command-for-pet-a"], "Copy must use the command visible at click time");
  assert.equal(raceButton.textContent, "Copied");

  setBrowserGlobals({
    writeText: async () => { throw new Error("clipboard denied"); },
    fetch: (async () => {
      unexpectedRequests += 1;
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
  assert.equal(failureButton.textContent, "Copy failed", "Clipboard rejection must show actionable failure feedback");

  const deepLink = new FakeActionElement({
    actionPetId: "part-03-star-platinum",
    actionMethod: "codex",
    actionLocale: "en"
  }, "Open in Codex");
  bindInstallActions(new FakeRoot([], [deepLink]) as unknown as ParentNode);
  const click = new Event("click", { cancelable: true });
  deepLink.dispatchEvent(click);
  assert.equal(click.defaultPrevented, false, "Deep Link click must stay unblocked");

  const pageLinks: string[] = [];
  setBrowserGlobals({
    writeText: async (value) => { pageLinks.push(value); },
    fetch: (async () => {
      unexpectedRequests += 1;
      return new Response(null, { status: 200 });
    }) as typeof globalThis.fetch
  });
  const pageLinkButton = new FakeActionElement({
    copyPageLink: "/zh-CN/pets/part-03-jotaro-kujo/",
    pageLinkCopyLabel: "Copy page link",
    pageLinkCopiedLabel: "Link copied",
    pageLinkCopyFailedLabel: "Copy failed"
  }, "Copy page link");
  bindInstallActions(new FakeRoot([], [], [pageLinkButton]) as unknown as ParentNode);
  pageLinkButton.dispatchEvent(new Event("click"));
  await waitForImmediate();
  assert.deepEqual(pageLinks, ["https://local.test/zh-CN/pets/part-03-jotaro-kujo/"], "Page-link copy must use the current origin");
  assert.equal(pageLinkButton.textContent, "Link copied");

  setBrowserGlobals({
    writeText: async () => { throw new Error("clipboard denied"); },
    fetch: (async () => {
      unexpectedRequests += 1;
      return new Response(null, { status: 200 });
    }) as typeof globalThis.fetch
  });
  const failedPageLinkButton = new FakeActionElement({
    copyPageLink: "/zh-CN/pets/part-03-jotaro-kujo/",
    pageLinkCopyLabel: "Copy page link",
    pageLinkCopiedLabel: "Link copied",
    pageLinkCopyFailedLabel: "Copy failed"
  }, "Copy page link");
  bindInstallActions(new FakeRoot([], [], [failedPageLinkButton]) as unknown as ParentNode);
  failedPageLinkButton.dispatchEvent(new Event("click"));
  await waitForImmediate();
  assert.equal(failedPageLinkButton.textContent, "Copy failed", "Failed page-link copy must show actionable feedback");

  assert.equal(unexpectedRequests, 0, "Static gallery must not send analytics requests");
  assert.equal(unexpectedBeacons, 0, "Static gallery must not queue analytics beacons");

  console.log("Install action client OK: all Released links agree, Copy works purely statically with zero telemetry, and Deep Links stay unblocked.");
} finally {
  if (originalNavigator) Object.defineProperty(globalThis, "navigator", originalNavigator);
  else delete (globalThis as { navigator?: unknown }).navigator;
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else delete (globalThis as { window?: unknown }).window;
  globalThis.fetch = originalFetch;
}
