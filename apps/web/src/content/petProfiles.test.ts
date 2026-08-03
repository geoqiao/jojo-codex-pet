import assert from "node:assert/strict";
import { pets } from "@jojo-codex-pet/catalog";
import { petProfiles } from "./petProfiles";

const expectedIds = [
  "part-03-jotaro-kujo",
  "part-03-star-platinum",
  "part-03-dio",
  "part-03-the-world"
];

assert.deepEqual(Object.keys(petProfiles).sort(), [...expectedIds].sort(), "Part 3 profile map must cover exactly the four Pilot pets");

for (const id of expectedIds) {
  const pet = pets.find((candidate) => candidate.id === id);
  const profile = petProfiles[id];
  assert.equal(pet?.status, "released", `${id} must remain Released when editorial content is added`);
  assert.ok(profile, `${id} must have an editorial profile`);
  for (const section of ["about", "animationQa", "packageCompatibility"] as const) {
    assert.ok(profile[section].title.en.length > 0 && profile[section].title["zh-CN"].length > 0, `${id} ${section} needs bilingual headings`);
    assert.ok(profile[section].body.en.length >= 80 && profile[section].body["zh-CN"].length >= 40, `${id} ${section} needs substantive bilingual copy`);
  }
}

for (const section of ["about", "animationQa", "packageCompatibility"] as const) {
  const englishBodies = expectedIds.map((id) => petProfiles[id][section].body.en);
  assert.equal(new Set(englishBodies).size, expectedIds.length, `${section} English copy must be unique per pet`);
  const chineseBodies = expectedIds.map((id) => petProfiles[id][section].body["zh-CN"]);
  assert.equal(new Set(chineseBodies).size, expectedIds.length, `${section} Chinese copy must be unique per pet`);
}

console.log("Pet profile content OK: four Released Part 3 profiles have unique bilingual sections.");
