import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parts } from "./parts";
import { pets } from "./pets";

const fail = (message: string): never => {
  throw new Error(message);
};

if (pets.length !== 36) fail(`Expected 36 pets, found ${pets.length}`);

const ids = new Set(pets.map((pet) => pet.id));
if (ids.size !== pets.length) fail("Catalog pet IDs must be unique");

for (const part of parts) {
  const actual = pets.filter((pet) => pet.part === part.number).length;
  if (actual !== part.count) fail(`Part ${part.number}: expected ${part.count}, found ${actual}`);
}

for (const pet of pets) {
  if (!/^part-\d{2}-[a-z0-9-]+$/.test(pet.id)) fail(`Invalid ID: ${pet.id}`);
  if (pet.ownerId && !ids.has(pet.ownerId)) fail(`${pet.id}: missing owner ${pet.ownerId}`);
  for (const pairId of pet.pairIds ?? []) {
    if (!ids.has(pairId)) fail(`${pet.id}: missing pair ${pairId}`);
  }
}

const pilot = pets.filter((pet) => pet.part === 3 && pet.status !== "planned");
if (pilot.length !== 4 || pilot.some((pet) => pet.part !== 3)) {
  fail("Pilot Set must be exactly four Part 3 pets");
}

const here = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(here, "../../..");

const readWebpDimensions = (data: Buffer): { width: number; height: number } => {
  if (data.length < 30 || data.toString("ascii", 0, 4) !== "RIFF" || data.toString("ascii", 8, 12) !== "WEBP") {
    return fail("Released spritesheet must be a valid WebP file");
  }

  const chunk = data.toString("ascii", 12, 16);
  if (chunk === "VP8L" && data[20] === 0x2f) {
    const bits = data.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X") {
    return {
      width: data.readUIntLE(24, 3) + 1,
      height: data.readUIntLE(27, 3) + 1
    };
  }

  return fail(`Unsupported WebP chunk ${chunk || "unknown"}`);
};

for (const pet of pets) {
  if (pet.status !== "released") {
    if (pet.packagePath) fail(`${pet.id}: only released pets may expose a package path`);
    continue;
  }

  if (pet.packagePath !== `/packages/${pet.id}`) {
    fail(`${pet.id}: released package path must be /packages/${pet.id}`);
  }

  const packageDirectory = resolve(repositoryRoot, "pets", pet.id);
  const manifestPath = resolve(packageDirectory, "pet.json");
  const spritesheetPath = resolve(packageDirectory, "spritesheet.webp");
  await stat(manifestPath);
  await stat(spritesheetPath);

  const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as Record<string, unknown>;
  if (manifest.id !== pet.id) fail(`${pet.id}: package manifest ID does not match catalog`);
  if (manifest.spriteVersionNumber !== 2) fail(`${pet.id}: package must declare spriteVersionNumber 2`);
  if (manifest.spritesheetPath !== "spritesheet.webp") fail(`${pet.id}: package must use spritesheet.webp`);

  const dimensions = readWebpDimensions(await readFile(spritesheetPath));
  if (dimensions.width !== 1536 || dimensions.height !== 2288) {
    fail(`${pet.id}: expected a 1536x2288 v2 spritesheet, found ${dimensions.width}x${dimensions.height}`);
  }
}

console.log(`Catalog OK: ${pets.length} pets across ${parts.length} Parts`);
