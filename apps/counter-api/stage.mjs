import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const destinationDirectory = resolve(here, "../web/public/api");
const endpoints = ["views.php", "actions.php"];

await mkdir(destinationDirectory, { recursive: true });
for (const endpoint of endpoints) {
  const destination = resolve(destinationDirectory, endpoint);
  await copyFile(resolve(here, endpoint), destination);
  console.log(`Staged counter endpoint at ${destination}`);
}
