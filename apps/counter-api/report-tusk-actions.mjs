import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export const tuskPetIds = Object.freeze([
  "part-07-tusk-act-1",
  "part-07-tusk-act-2",
  "part-07-tusk-act-3",
  "part-07-tusk-act-4"
]);

const tuskPetIdSet = new Set(tuskPetIds);
const eventTypes = new Set(["install_command_copy_success", "install_deeplink_click"]);
const methods = new Set(["bash", "powershell", "npx", "codex"]);
const locales = new Set(["en", "zh-CN"]);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const isUtcDate = (value) => {
  const date = new Date(`${value}T00:00:00Z`);
  return datePattern.test(value)
    && !Number.isNaN(date.valueOf())
    && date.toISOString().slice(0, 10) === value;
};

const assertDate = (value, label) => {
  if (!isUtcDate(value)) {
    throw new Error(`${label} must be a YYYY-MM-DD UTC date`);
  }
};

const landingKind = (entry) => {
  const localePrefix = entry.locale === "zh-CN" ? "/zh-CN" : "";
  if (entry.landing_path === `${localePrefix}/pets/${entry.pet_id}/`) return "detail";
  if (entry.landing_path === `${localePrefix}/install/`) return "install";
  return undefined;
};

const emptyCounts = () => ({
  command_copies: 0,
  codex_deep_link_clicks: 0,
  total_install_intent_actions: 0,
  by_method: { bash: 0, powershell: 0, npx: 0, codex: 0 }
});

const addEntry = (target, entry) => {
  if (entry.event_type === "install_command_copy_success") target.command_copies += entry.count;
  else target.codex_deep_link_clicks += entry.count;
  target.total_install_intent_actions += entry.count;
  target.by_method[entry.method] += entry.count;
};

const validateEntry = (entry) => {
  if (
    !entry
    || typeof entry !== "object"
    || Array.isArray(entry)
    || !isUtcDate(entry.day)
    || !eventTypes.has(entry.event_type)
    || typeof entry.pet_id !== "string"
    || !methods.has(entry.method)
    || !locales.has(entry.locale)
    || typeof entry.landing_path !== "string"
    || !landingKind(entry)
    || !Number.isInteger(entry.count)
    || entry.count < 1
    || (entry.event_type === "install_deeplink_click" ? entry.method !== "codex" : entry.method === "codex")
  ) {
    throw new Error("action aggregate contains an invalid entry");
  }
};

export const summarizeTuskActions = (store, start, end) => {
  assertDate(start, "start");
  assertDate(end, "end");
  if (start > end) throw new Error("start must not be after end");
  if (!store || typeof store !== "object" || Array.isArray(store)) {
    throw new Error("action aggregate must be a JSON object");
  }

  const summary = {
    window_utc_inclusive: { start, end },
    cohort_pet_ids: tuskPetIds,
    all_tusk_landing_paths: emptyCounts(),
    tusk_detail_page_landings: emptyCounts(),
    install_page_landings: emptyCounts(),
    by_pet: Object.fromEntries(tuskPetIds.map((id) => [id, {
      all_landing_paths: emptyCounts(),
      detail_page_landings: emptyCounts(),
      install_page_landings: emptyCounts()
    }]))
  };

  for (const entry of Object.values(store)) {
    validateEntry(entry);
    if (entry.day < start || entry.day > end || !tuskPetIdSet.has(entry.pet_id)) continue;

    addEntry(summary.all_tusk_landing_paths, entry);
    addEntry(summary.by_pet[entry.pet_id].all_landing_paths, entry);

    if (landingKind(entry) === "detail") {
      addEntry(summary.tusk_detail_page_landings, entry);
      addEntry(summary.by_pet[entry.pet_id].detail_page_landings, entry);
    } else {
      addEntry(summary.install_page_landings, entry);
      addEntry(summary.by_pet[entry.pet_id].install_page_landings, entry);
    }
  }

  return summary;
};

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isCli) {
  const [storePath, start, end] = process.argv.slice(2);
  if (!storePath || !start || !end) {
    console.error("Usage: node report-tusk-actions.mjs <actions.json> <start-YYYY-MM-DD> <end-YYYY-MM-DD>");
    process.exit(2);
  }

  try {
    const store = JSON.parse(await readFile(storePath, "utf8"));
    console.log(JSON.stringify(summarizeTuskActions(store, start, end), null, 2));
  } catch (error) {
    console.error(`Unable to summarize Tusk install-intent aggregates: ${error.message}`);
    process.exit(1);
  }
}
