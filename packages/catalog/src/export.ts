import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pets } from "./pets";

const here = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(here, "../../..");
const outputDirectory = resolve(here, "../../../apps/web/public/api");
const outputFile = resolve(outputDirectory, "catalog-ids.json");
const packageOutputDirectory = resolve(here, "../../../apps/web/public/packages");

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputFile, `${JSON.stringify(pets.map((pet) => pet.id), null, 2)}\n`, "utf8");

await rm(packageOutputDirectory, { recursive: true, force: true });
await mkdir(packageOutputDirectory, { recursive: true });

for (const pet of pets.filter((item) => item.status === "released")) {
  const sourceDirectory = resolve(repositoryRoot, "pets", pet.id);
  const targetDirectory = resolve(packageOutputDirectory, pet.id);
  await mkdir(targetDirectory, { recursive: true });

  const checksums: string[] = [];
  for (const filename of ["pet.json", "spritesheet.webp"]) {
    const source = resolve(sourceDirectory, filename);
    const target = resolve(targetDirectory, filename);
    await copyFile(source, target);
    const checksum = createHash("sha256").update(await readFile(source)).digest("hex");
    checksums.push(`${checksum}  ${filename}`);
  }
  await writeFile(resolve(targetDirectory, "checksums.sha256"), `${checksums.join("\n")}\n`, "utf8");
}

console.log(`Wrote ${pets.length} catalog IDs to ${outputFile}`);
console.log(`Staged ${pets.filter((pet) => pet.status === "released").length} released pet package(s)`);
