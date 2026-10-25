import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import states from "../src/lib/pet-motion-states.json" with { type: "json" };

// Slices every pet's V2 atlas into one lossy WebP strip per animation state (rows 0-8, one frame per
// 192x208 cell) so the gallery never ships the 2.4 MB atlas. Row 9-10 look directions are not used.
// Strips are enlarged 2x with nearest-neighbour so the browser does not smooth the pixels again when it
// draws them at about 2.7x. The script also writes pet-motion-fit.json, which places each animation
// layer over the static card art (same foot line and height) so hover does not make the pet jump.
const petsDirectory = fileURLToPath(new URL("../../../pets/", import.meta.url));
const outputDirectory = fileURLToPath(new URL("../public/pet-motion/", import.meta.url));
const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
const fitFile = fileURLToPath(new URL("../src/lib/pet-motion-fit.json", import.meta.url));
const generatorFiles = [import.meta.url, new URL("../src/lib/pet-motion-states.json", import.meta.url)].map(fileURLToPath);

const cell = { width: 192, height: 208 };
const atlas = { width: cell.width * 8, height: cell.height * 11 };
const scale = 2;
const idleBudget = 120_000;
const qualities = [80, 70, 60, 50, 40, 30];
const concurrency = 4;

const modifiedAt = async (path) => (await stat(path).catch(() => undefined))?.mtimeMs ?? 0;
const newestInput = async (petId) => Math.max(
  await modifiedAt(join(petsDirectory, petId, "spritesheet.webp")),
  ...(await Promise.all(generatorFiles.map(modifiedAt)))
);

const encode = (image, quality) => image.clone()
  .webp({ quality, alphaQuality: 100, smartSubsample: true, effort: 4 })
  .toBuffer();

/** Bounding box of the pixels that are mostly opaque, so soft shadows do not count. */
const opaqueBounds = async (image) => {
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = -1, bottom = -1;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (data[(y * info.width + x) * info.channels + info.channels - 1] < 128) continue;
      left = Math.min(left, x);
      right = Math.max(right, x + 1);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y + 1);
    }
  }
  return { left, top, right, bottom };
};

const baseDirectories = (await readdir(publicDirectory)).filter((name) => name.endsWith("-bases"));
const cardImage = async (petId) => {
  for (const directory of baseDirectories) {
    const path = join(publicDirectory, directory, `${petId}-card-640.webp`);
    if (await modifiedAt(path)) return path;
  }
  throw new Error(`${petId}: no card-640.webp found`);
};

// Percentages of the square card image: the layer is as tall as the pet in the card art, its feet sit on
// the card art's lowest opaque row, and it is centred on the card art's horizontal middle.
const fitPet = async (petId) => {
  const card = sharp(await cardImage(petId));
  const { width, height } = await card.metadata();
  const art = await opaqueBounds(card.clone());
  const frame = await opaqueBounds(sharp(join(petsDirectory, petId, "spritesheet.webp")).extract({ left: 0, top: 0, ...cell }));
  const factor = (art.bottom - art.top) / (frame.bottom - frame.top);
  const percent = (value, size) => Math.round((value / size) * 10_000) / 100;
  return {
    left: percent((art.left + art.right) / 2 - ((frame.left + frame.right) / 2) * factor, width),
    top: percent(art.bottom - frame.bottom * factor, height),
    width: percent(cell.width * factor, width),
    height: percent(cell.height * factor, height)
  };
};

const generatePet = async (petId) => {
  const target = join(outputDirectory, petId);
  if (await modifiedAt(join(target, "review.webp")) > await newestInput(petId)) return undefined;

  const source = await sharp(join(petsDirectory, petId, "spritesheet.webp")).raw().toBuffer({ resolveWithObject: true });
  if (source.info.width !== atlas.width || source.info.height !== atlas.height) {
    throw new Error(`${petId}: expected a ${atlas.width}x${atlas.height} V2 atlas, found ${source.info.width}x${source.info.height}`);
  }
  const strip = (row, frames) => sharp(source.data, { raw: source.info })
    .extract({ left: 0, top: row * cell.height, width: frames * cell.width, height: cell.height })
    .resize({ width: frames * cell.width * scale, height: cell.height * scale, kernel: "nearest" });

  // One quality per pet keeps every state visually consistent; the idle strip sets the hover budget.
  const idle = strip(0, states[0].durations.length);
  let quality = qualities[0];
  let idleBytes = await encode(idle, quality);
  for (const candidate of qualities.slice(1)) {
    if (idleBytes.length <= idleBudget) break;
    quality = candidate;
    idleBytes = await encode(idle, quality);
  }
  if (idleBytes.length > idleBudget) throw new Error(`${petId}: idle strip is ${idleBytes.length} bytes at quality ${quality}`);

  await mkdir(target, { recursive: true });
  const written = [];
  const write = async (name, bytes) => {
    await writeFile(join(target, name), bytes);
    written.push(bytes.length);
  };
  await write("idle.webp", idleBytes);
  await write("poster.webp", await encode(strip(0, 1), quality));
  for (const [row, state] of states.entries()) {
    if (row > 0) await write(`${state.id}.webp`, await encode(strip(row, state.durations.length), quality));
  }
  return { petId, quality, idleBytes: idleBytes.length, files: written.length, bytes: written.reduce((sum, size) => sum + size, 0) };
};

const petIds = (await readdir(petsDirectory, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
const results = [];
const queue = [...petIds];
await Promise.all(Array.from({ length: concurrency }, async () => {
  for (let petId = queue.shift(); petId; petId = queue.shift()) results.push(await generatePet(petId));
}));

const fit = {};
for (const petId of petIds.sort()) fit[petId] = await fitPet(petId);
const fitJson = `${JSON.stringify(fit, null, 2)}\n`;
if (await readFile(fitFile, "utf8").catch(() => "") !== fitJson) await writeFile(fitFile, fitJson);

const generated = results.filter(Boolean);
if (generated.length === 0) {
  console.log(`Pet motion strips are up to date (${petIds.length} pets).`);
} else {
  const files = generated.reduce((sum, item) => sum + item.files, 0);
  const bytes = generated.reduce((sum, item) => sum + item.bytes, 0);
  const largestIdle = Math.max(...generated.map((item) => item.idleBytes));
  console.log(`Generated ${files} motion strips for ${generated.length} pets (${(bytes / 1_000_000).toFixed(1)} MB; largest idle strip ${(largestIdle / 1000).toFixed(0)} KB).`);
}
