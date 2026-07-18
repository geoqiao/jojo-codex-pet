import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const destination = resolve(here, "../web/public/api/views.php");

await mkdir(dirname(destination), { recursive: true });
await copyFile(resolve(here, "views.php"), destination);
console.log(`Staged counter endpoint at ${destination}`);
