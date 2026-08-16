import assert from "node:assert/strict";
import { pets } from "@jojo-codex-pet/catalog";
import { petProfiles } from "./petProfiles";

const part3Ids = [
  "part-03-jotaro-kujo",
  "part-03-star-platinum",
  "part-03-dio",
  "part-03-the-world"
];
const tuskIds = [
  "part-07-tusk-act-1",
  "part-07-tusk-act-2",
  "part-07-tusk-act-3",
  "part-07-tusk-act-4"
];
const expectedIds = [...part3Ids, ...tuskIds];

assert.deepEqual(
  Object.keys(petProfiles).sort(),
  [...expectedIds].sort(),
  "profile map must cover exactly the four Part 3 Pilot pets and four Tusk ACT pets"
);

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

const tuskDescriptions = tuskIds.map((id) => petProfiles[id].seoDescription?.en);
assert.ok(tuskDescriptions.every((description) => description?.includes("unofficial animated pixel Codex pet")), "Tusk metadata must qualify the actual product instead of presenting a wiki page");
assert.equal(new Set(tuskDescriptions).size, tuskIds.length, "Tusk metadata descriptions must be unique per ACT");
for (const id of part3Ids) {
  assert.equal(petProfiles[id].seoDescription, undefined, `${id} metadata must stay unchanged by the focused Tusk update`);
}

for (const section of ["about", "animationQa", "packageCompatibility"] as const) {
  const englishBodies = expectedIds.map((id) => petProfiles[id][section].body.en);
  assert.equal(new Set(englishBodies).size, expectedIds.length, `${section} English copy must be unique per pet`);
  const chineseBodies = expectedIds.map((id) => petProfiles[id][section].body["zh-CN"]);
  assert.equal(new Set(chineseBodies).size, expectedIds.length, `${section} Chinese copy must be unique per pet`);
}

console.log("Pet profile content OK: four Part 3 pets and four Tusk ACT pets have unique bilingual sections; Tusk metadata is product-qualified.");
