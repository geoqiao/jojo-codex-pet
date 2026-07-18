import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pets } from "./pets";

const here = dirname(fileURLToPath(import.meta.url));
const outputDirectory = resolve(here, "../../../apps/web/public/api");
const outputFile = resolve(outputDirectory, "catalog-ids.json");

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputFile, `${JSON.stringify(pets.map((pet) => pet.id), null, 2)}\n`, "utf8");
console.log(`Wrote ${pets.length} catalog IDs to ${outputFile}`);
