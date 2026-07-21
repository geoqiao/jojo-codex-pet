import { readdir } from "node:fs/promises";
import { stat } from "node:fs/promises";
import { extname, join, parse } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
const assetDirectories = ["pilot-bases", "wave-1-bases", "wave-2-bases"];

const sources = (await Promise.all(assetDirectories.map(async (directory) => {
  const absoluteDirectory = join(publicDirectory, directory);
  const files = await readdir(absoluteDirectory);
  return files
    .filter((file) => extname(file) === ".png")
    .map((file) => join(absoluteDirectory, file));
}))).flat();

await Promise.all(sources.map(async (source) => {
  const { dir, name } = parse(source);
  const output = join(dir, `${name}-card.webp`);
  await sharp(source)
    .resize({
      width: 640,
      height: 640,
      fit: "inside",
      kernel: sharp.kernel.nearest,
      withoutEnlargement: true
    })
    .webp({ lossless: true, effort: 6 })
    .toFile(output);
}));

const totalBytes = (await Promise.all(sources.map(async (source) => {
  const { dir, name } = parse(source);
  return (await stat(join(dir, `${name}-card.webp`))).size;
}))).reduce((sum, size) => sum + size, 0);

console.log(`Generated ${sources.length} lossless 640px WebP card images (${(totalBytes / 1_000_000).toFixed(2)} MB).`);
