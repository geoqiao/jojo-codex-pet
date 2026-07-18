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

const pilot = pets.filter((pet) => pet.status === "pilot-review");
if (pilot.length !== 4 || pilot.some((pet) => pet.part !== 3)) {
  fail("Pilot Set must be exactly four Part 3 pets");
}

console.log(`Catalog OK: ${pets.length} pets across ${parts.length} Parts`);
