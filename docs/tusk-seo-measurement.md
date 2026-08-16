# Tusk SEO measurement baseline and review

Status: implementation baseline for the four existing Tusk ACT detail pages. This is a measurement procedure, not authorization to deploy, alter indexing, or run a bulk title/H1 experiment.

## Verified Google Search Console baseline

GSC property: `sc-domain:pixelstand.pet`

Search type: Web

Data range: `2026-07-20..2026-08-13` (inclusive)

| Cohort | Impressions | Clicks | CTR | Average position |
| --- | ---: | ---: | ---: | ---: |
| Entire site | 196 | 6 | 3.1% | 18.9 |
| Query matches `tusk|牙.*act` | 75 | 0 | 0% | ~20.6 weighted from the verified rows |

The Tusk/牙 cohort supplied 38.3% of site impressions and no search clicks in this window.

The verified input did not include a page-filtered total for URLs containing `/pets/part-07-tusk-act-`. That value cannot be derived from the query rows, so the page-cohort baseline is explicitly **not available**, not zero. Export it before any deployment baseline is closed and preserve it beside the query-cohort export.

| Query row | Impressions | Clicks | Average position |
| --- | ---: | ---: | ---: |
| `tusk act 3` | 29 | 0 | 20.7 |
| `tusk act 1` | 19 | 0 | 22.5 |
| `tusk act 2` | 13 | 0 | 25.0 |
| `tusk act3` | 7 | 0 | 11.9 |
| `牙act2` | 3 | 0 | 9.7 |
| `tusk act 1 pixel art` | 2 | 0 | 14.5 |
| `tusk act three` | 2 | 0 | 25.5 |

Interpretation to preserve: most primary rows rank around result pages 2–3. The evidence points chiefly to a relevance/ranking problem plus broad informational-intent mismatch. With zero cohort clicks and low page-level volume, it does **not** establish a title-only CTR failure.

## Cohort definitions

Use the same definitions for every export:

- **Query cohort:** GSC query regex `(?i)(tusk|牙.*act)`.
- **Page cohort:** page URL contains `/pets/part-07-tusk-act-`. This intentionally includes both English routes and `/zh-CN/pets/...` routes.
- **Owning pages:** the four canonical ACT detail pages, analyzed individually as well as together.
- **Onsite intent cohort:** `pet_id` is exactly one of `part-07-tusk-act-1` through `part-07-tusk-act-4` in the existing first-party action aggregate.

Do not broaden the query regex between windows. If a newly observed spelling deserves inclusion, report the fixed cohort first, then a separately labeled expanded cohort.

## 14-day review

Run after GSC has finalized the complete post-change window. Record the implementation/deployment date separately; this branch must not be deployed directly.

1. In GSC Performance → Search results, select Web and the exact 14 post-change dates.
2. Export three views: the fixed query cohort, the fixed page cohort, and their intersection. Keep query and page rows with impressions, clicks, CTR, and average position.
3. Repeat for the immediately preceding 14 dates. Compare equal windows; do not compare a partial current period with the 25-day baseline above.
4. Check each owning page for impressions, indexing/crawl anomalies, and the queries it actually owns. Treat new qualified impressions and movement toward page 1 as useful directional signals even when clicks remain sparse.
5. Summarize onsite intent for the same date labels from a read-only copy of the private aggregate file:

   ```bash
   node apps/counter-api/report-tusk-actions.mjs \
     /secure/read-only-copy/.jojo-codex-pet-actions.json \
     YYYY-MM-DD YYYY-MM-DD
   ```

6. Report GSC clicks and onsite actions in separate columns. At 14 days, make no title/H1 conclusion; fix only objective content, link, indexing, or instrumentation defects.

The action report separates actions taken on Tusk detail-page landings from actions taken on `/install/` after a Tusk pet was selected. Keep that split: install-page actions cannot be assigned to a particular Tusk search landing page.

## 28-day review

Repeat the same export and action-report steps for a complete 28-day post-change window and the immediately preceding 28 days.

For each ACT page, record:

| Window | Page | Impressions | GSC clicks | CTR | Average position | Detail-page Codex deep-link clicks | Detail-page command copies | Install-page actions for pet | Decision |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `YYYY-MM-DD..YYYY-MM-DD` | canonical page |  |  |  |  |  |  |  | keep / improve relevance / eligible single-variable test |

Decision rules:

- Do not start a title or H1 experiment until the **individual owning page**, not the four-page cohort, has roughly 200 impressions in one 28-day window.
- If the gate is not met, extend observation and prioritize relevance, crawlable internal links, and truthful product content.
- If the gate is met, test one page and one variable at a time, preserving a pre-change export and a simple rollback commit.
- Do not call small changes statistically significant. Position and CTR are diagnostics, not proof of causality.

## GSC clicks versus onsite install intent

These metrics answer different questions:

- **GSC clicks** are clicks from Google Search to a result in the selected query/page cohort.
- **`install_deeplink_click`** is an onsite click that asks Codex to open the pet metadata. It is intent, not confirmation that Codex opened or installed the pet.
- **`install_command_copy_success`** is counted only after the browser clipboard write resolves. It is intent, not proof the command ran or installation completed.

The first-party store has no source field, cookie, session, visitor/device ID, raw query, referrer, IP, or User-Agent. Therefore:

- never join a GSC click to an action;
- never label actions as conversions, successful installations, or unique users;
- never divide all actions by GSC clicks as a search conversion rate—actions include non-search traffic and one person may perform more than one action;
- compare the two time series side by side only as directional aggregates.

If the private action file did not exist for a historical window, mark the action baseline `not available`; do not backfill missing data as zero. Keep private aggregate exports outside the repository and do not add a public read endpoint merely for reporting.
