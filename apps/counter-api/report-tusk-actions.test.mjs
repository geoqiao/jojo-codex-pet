import assert from "node:assert/strict";
import { summarizeTuskActions, tuskPetIds } from "./report-tusk-actions.mjs";

const entry = (overrides = {}) => ({
  day: "2026-08-20",
  event_type: "install_command_copy_success",
  pet_id: "part-07-tusk-act-1",
  method: "bash",
  locale: "en",
  landing_path: "/pets/part-07-tusk-act-1/",
  count: 2,
  updated_at: "2026-08-20T01:02:03+00:00",
  ...overrides
});

const store = {
  a: entry(),
  b: entry({
    event_type: "install_deeplink_click",
    method: "codex",
    locale: "zh-CN",
    landing_path: "/zh-CN/pets/part-07-tusk-act-1/",
    count: 3
  }),
  c: entry({
    pet_id: "part-07-tusk-act-3",
    method: "npx",
    landing_path: "/install/",
    count: 4
  }),
  d: entry({ day: "2026-08-01", count: 100 }),
  e: entry({ pet_id: "part-03-jotaro-kujo", count: 100 })
};

const report = summarizeTuskActions(store, "2026-08-14", "2026-08-27");
assert.deepEqual(report.cohort_pet_ids, tuskPetIds);
assert.deepEqual(report.all_tusk_landing_paths, {
  command_copies: 6,
  codex_deep_link_clicks: 3,
  total_install_intent_actions: 9,
  by_method: { bash: 2, powershell: 0, npx: 4, codex: 3 }
});
assert.equal(report.tusk_detail_page_landings.total_install_intent_actions, 5);
assert.equal(report.install_page_landings.total_install_intent_actions, 4);
assert.equal(report.by_pet["part-07-tusk-act-1"].all_landing_paths.total_install_intent_actions, 5);
assert.equal(report.by_pet["part-07-tusk-act-1"].detail_page_landings.total_install_intent_actions, 5);
assert.equal(report.by_pet["part-07-tusk-act-1"].install_page_landings.total_install_intent_actions, 0);
assert.equal(report.by_pet["part-07-tusk-act-2"].all_landing_paths.total_install_intent_actions, 0);
assert.equal(report.by_pet["part-07-tusk-act-3"].all_landing_paths.total_install_intent_actions, 4);
assert.equal(report.by_pet["part-07-tusk-act-3"].install_page_landings.total_install_intent_actions, 4);

assert.throws(() => summarizeTuskActions([], "2026-08-14", "2026-08-27"), /JSON object/);
assert.throws(() => summarizeTuskActions(store, "2026-08-28", "2026-08-27"), /start must not/);
assert.throws(() => summarizeTuskActions(store, "2026-02-31", "2026-08-27"), /UTC date/);
assert.throws(
  () => summarizeTuskActions({ bad: entry({ count: 0 }) }, "2026-08-14", "2026-08-27"),
  /invalid entry/
);
assert.throws(
  () => summarizeTuskActions(
    { bad: entry({ event_type: "install_deeplink_click", method: "bash" }) },
    "2026-08-14",
    "2026-08-27"
  ),
  /invalid entry/
);
assert.throws(
  () => summarizeTuskActions(
    { bad: entry({ landing_path: "/pets/part-07-tusk-act-2/" }) },
    "2026-08-14",
    "2026-08-27"
  ),
  /unexpected canonical landing_path/
);

console.log("Tusk action report OK: UTC windows, pet cohort, landing-page split, event totals, and invalid aggregates are covered.");
