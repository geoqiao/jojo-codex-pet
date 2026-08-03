import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pets } from "./pets";

const here = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(here, "../../..");
const outputDirectory = resolve(here, "../../../apps/web/public/api");
const outputFile = resolve(outputDirectory, "catalog-ids.json");
const releasedOutputFile = resolve(outputDirectory, "released-pet-ids.json");
const packageOutputDirectory = resolve(here, "../../../apps/web/public/packages");
const releasedPets = pets.filter((pet) => pet.status === "released" && pet.packagePath);

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputFile, `${JSON.stringify(pets.map((pet) => pet.id), null, 2)}\n`, "utf8");
await writeFile(releasedOutputFile, `${JSON.stringify(releasedPets.map((pet) => pet.id), null, 2)}\n`, "utf8");

await rm(packageOutputDirectory, { recursive: true, force: true });
await mkdir(packageOutputDirectory, { recursive: true });

for (const pet of releasedPets) {
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
console.log(`Wrote ${releasedPets.length} released pet IDs to ${releasedOutputFile}`);
console.log(`Staged ${releasedPets.length} released pet package(s)`);
