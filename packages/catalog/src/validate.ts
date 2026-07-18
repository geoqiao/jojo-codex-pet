import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
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
const packagesRoot = resolve(repositoryRoot, "pets");
const cellWidth = 192;
const cellHeight = 208;
// V2 reserves row 0, column 6 as the neutral look frame in addition to the six idle frames.
const expectedFramesByRow = [7, 8, 8, 4, 5, 8, 6, 6, 6, 8, 8] as const;

const packageIds = new Set(
  (await readdir(packagesRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
);

for (const pet of pets) {
  const isPackaged = packageIds.has(pet.id);
  if (pet.status === "planned" && isPackaged) fail(`${pet.id}: planned pets may not have a release package`);
  if (pet.status !== "planned" && !isPackaged) fail(`${pet.id}: review and released pets require a package`);
  if (pet.status === "released" && pet.packagePath !== `/packages/${pet.id}`) {
    fail(`${pet.id}: released package path must be /packages/${pet.id}`);
  }
  if (pet.status !== "released" && pet.packagePath) fail(`${pet.id}: only released pets may expose a package path`);
  if (!isPackaged) continue;

  const packageDirectory = resolve(packagesRoot, pet.id);
  const manifestPath = resolve(packageDirectory, "pet.json");
  const spritesheetPath = resolve(packageDirectory, "spritesheet.webp");
  await stat(manifestPath);
  await stat(spritesheetPath);

  const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as Record<string, unknown>;
  if (manifest.id !== pet.id) fail(`${pet.id}: package manifest ID does not match catalog`);
  if (manifest.displayName !== pet.name.en) fail(`${pet.id}: package displayName does not match the English catalog name`);
  if (typeof manifest.description !== "string" || manifest.description.trim() === "") {
    fail(`${pet.id}: package description must be a non-empty string`);
  }
  if (manifest.spriteVersionNumber !== 2) fail(`${pet.id}: package must declare spriteVersionNumber 2`);
  if (manifest.spritesheetPath !== "spritesheet.webp") fail(`${pet.id}: package must use spritesheet.webp`);

  const metadata = await sharp(spritesheetPath).metadata();
  if (metadata.format !== "webp") fail(`${pet.id}: spritesheet must be WebP`);
  if (metadata.width !== cellWidth * 8 || metadata.height !== cellHeight * 11) {
    fail(`${pet.id}: expected a 1536x2288 v2 spritesheet, found ${metadata.width}x${metadata.height}`);
  }
  if (!metadata.hasAlpha) fail(`${pet.id}: spritesheet must contain an alpha channel`);

  const { data, info } = await sharp(spritesheetPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.channels !== 4) fail(`${pet.id}: decoded spritesheet must be RGBA`);
  let transparentRgbResidue = 0;

  for (const [row, expectedFrames] of expectedFramesByRow.entries()) {
    for (let column = 0; column < 8; column += 1) {
      let visiblePixels = 0;
      for (let y = row * cellHeight; y < (row + 1) * cellHeight; y += 1) {
        for (let x = column * cellWidth; x < (column + 1) * cellWidth; x += 1) {
          const offset = (y * info.width + x) * info.channels;
          const alpha = data[offset + 3];
          if (alpha !== 0) {
            visiblePixels += 1;
          } else if (data[offset] !== 0 || data[offset + 1] !== 0 || data[offset + 2] !== 0) {
            transparentRgbResidue += 1;
          }
        }
      }

      const shouldBeUsed = column < expectedFrames;
      if (shouldBeUsed && visiblePixels < 128) {
        fail(`${pet.id}: row ${row} column ${column} is missing or effectively empty`);
      }
      if (shouldBeUsed && visiblePixels > cellWidth * cellHeight * 0.95) {
        fail(`${pet.id}: row ${row} column ${column} is nearly opaque and likely retains a background`);
      }
      if (!shouldBeUsed && visiblePixels !== 0) {
        fail(`${pet.id}: row ${row} column ${column} must be fully transparent`);
      }
    }
  }
  if (transparentRgbResidue !== 0) {
    fail(`${pet.id}: spritesheet has ${transparentRgbResidue} fully transparent pixels with RGB residue`);
  }
}

for (const packageId of packageIds) {
  if (!ids.has(packageId)) fail(`${packageId}: package directory has no catalog entry`);
}

console.log(`Catalog OK: ${pets.length} pets across ${parts.length} Parts; ${packageIds.size} v2 packages validated`);
