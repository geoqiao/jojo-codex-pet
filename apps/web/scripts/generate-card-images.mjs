import { readdir, stat } from "node:fs/promises";
import { extname, join, parse } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
const assetDirectories = ["pilot-bases", "wave-1-bases", "wave-2-bases", "wave-3-bases"];
const responsiveVariants = [320, 480, 640];

const sources = (await Promise.all(assetDirectories.map(async (directory) => {
  const absoluteDirectory = join(publicDirectory, directory);
  const files = await readdir(absoluteDirectory);
  return files
    .filter((file) => extname(file) === ".png")
    .map((file) => join(absoluteDirectory, file));
}))).flat();

await Promise.all(sources.map(async (source) => {
  const { dir, name } = parse(source);
  await Promise.all([
    ...responsiveVariants.map((width) => sharp(source)
      .resize({
        width,
        height: width,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        kernel: sharp.kernel.nearest
      })
      .webp({ lossless: true, effort: 6 })
      .toFile(join(dir, `${name}-card-${width}.webp`))),
    sharp(source)
      .resize({
        width: 640,
        height: 640,
        fit: "inside",
        kernel: sharp.kernel.nearest,
        withoutEnlargement: true
      })
      .webp({ lossless: true, effort: 6 })
      .toFile(join(dir, `${name}-card.webp`))
  ]);
}));

const totals = Object.fromEntries(await Promise.all(responsiveVariants.map(async (width) => {
  const bytes = (await Promise.all(sources.map(async (source) => {
    const { dir, name } = parse(source);
    return (await stat(join(dir, `${name}-card-${width}.webp`))).size;
  }))).reduce((sum, size) => sum + size, 0);
  return [width, bytes];
})));
const fallbackBytes = (await Promise.all(sources.map(async (source) => {
  const { dir, name } = parse(source);
  return (await stat(join(dir, `${name}-card.webp`))).size;
}))).reduce((sum, size) => sum + size, 0);
const responsiveBytes = Object.values(totals).reduce((sum, size) => sum + size, 0);
const summary = responsiveVariants.map((width) => `${width}px ${(totals[width] / 1_000_000).toFixed(2)} MB`).join(" · ");

console.log(`Generated ${sources.length} responsive WebP card sets (${summary}; responsive total ${(responsiveBytes / 1_000_000).toFixed(2)} MB).`);
console.log(`Preserved ${sources.length} detail/fallback 640px WebP files (${(fallbackBytes / 1_000_000).toFixed(2)} MB).`);
