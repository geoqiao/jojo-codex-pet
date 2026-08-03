# SEO conversion path — Batch A verification

Date: 2026-08-03

Status: `ready-for-merge` (local candidate only; not merged or deployed)

## Scope and protected baseline

- Base: `origin/main@8b283a2`, which remains the current production commit and the previous-production commit for any later release.
- Scope: Tickets 1–5 — aggregate Copy/Open intent actions, `/install/` selector and command priority, homepage CTA, Released detail anchor, and direct `/parts/` pet links.
- URL, title/H1 subject, canonical, hreflang, robots, sitemap, noindex, catalog status, pet packages, and the 24 Released / 12 Wave Review boundary are unchanged.
- Tusk ACT3 and all Wave 3 packages/assets remain untouched.

## Action data contract

The candidate adds `actions.php` and a separate private `.jojo-codex-pet-actions.json` store. Stored entries contain only:

- server-generated day
- `install_command_copy_success` or `install_deeplink_click`
- Released Catalog pet ID
- `bash`, `powershell`, `npx`, or `codex` method with event/method pairing enforced
- `en` or `zh-CN`
- the matching canonical Install or pet-detail landing path
- aggregate count and update time

The endpoint accepts only `POST`, limits the body to 2,048 bytes, validates every dimension, uses a dedicated lock and atomic replacement, and ignores rather than stores extra payload fields. It does not record cookies, sessions, identifiers, IP, User-Agent, referrer, query string, hostname, account name, local path, free text, or installation completion.

Real local PHP integration evidence:

- Valid Copy and Deep Link payloads incremented only their matching aggregate key.
- Unknown pet/event/method/locale/path, event-method mismatch, locale/path mismatch, pet/path mismatch, malformed JSON, non-POST methods, and oversized bodies returned 4xx and did not mutate storage.
- Extra `visitor_id` and `raw_referrer` test fields were absent from storage.
- Existing-but-unreadable and empty stores returned 503 without replacement; the previous aggregate bytes were preserved after a read failure.
- A forced partial filesystem write was rejected by exact byte-count validation; the valid destination remained unchanged and the temporary file was removed.
- With PHP `display_errors=1`, unreadable allowlist/store and failed atomic-replacement paths returned the exact fixed JSON error contract, exposed no private/source path, and preserved historical aggregates.
- Existing `views.php` remains separately staged and its schema/source file is unchanged.

## Browser Harness evidence

Browser Harness connected to the user's running Chrome. Functional tests used local static build output plus a real local PHP endpoint; one unchanged production missing-page URL was checked read-only. No production files or Hostinger settings were changed.

### Install page

- All 24 Released options were iterated in English. For every option, Codex name/image URL and Bash/PowerShell/npx command matched the same selected `pet_id`; no failures were found.
- At 390×844, the selector starts at `y=619` and the Open in Codex action ends at `y=807`, both within the first viewport. The complete Released list starts at `y=2801`.
- Keyboard Tab moved in order from the jump link to the selector, Open in Codex, Bash, PowerShell, and npx. The jump link, selector, Deep Link, command buttons, FAQ summary, and Released links all matched `:focus-visible` with an immediate 3px light outline plus 6px ink outer ring; ink contrasts 15.98:1 on acid and 17.58:1 on paper. Pressing Enter on the focused npx button changed its label to `Copied` and wrote one matching aggregate.
- Real compositor clicks copied the exact selected Bash/PowerShell commands to the system clipboard, changed the button to `Copied`, and added only the matching aggregate. Clipboard rejection did not change the label or storage; an HTTP 501 tracking response did not undo a successful Copy.
- A successful real compositor Deep Link click retained `defaultPrevented=false`, kept its exact `codex://pets/install?...` target, and added one matching aggregate. The unavailable-endpoint path was then completed with the PHP server stopped: `sendBeacon` declined, the real fallback request rejected with `TypeError: Failed to fetch`, and the compositor click still had `defaultPrevented=false` with the unchanged exact Codex URL.
- Chinese 390px rendered 24 localized options and the localized Open action within the first viewport. Browser metadata checks returned the exact English and Chinese canonicals plus matching `en`, `zh-CN`, and `x-default` hreflang URLs.
- English and Chinese pages both had a 390px document width with no horizontal overflow.

### Homepage, details, and Parts

- English and Chinese homepage heroes expose the localized direct Install CTA and retain stable canonical/hreflang metadata.
- At a 390×844 viewport with no scroll, Released Jotaro's `Install this pet ↓` anchor occupied `y=535.5–581.5`, inside the first viewport, targeted the one existing install box, and showed the same dual focus ring. Its browser metadata returned the exact localized canonical plus matching `en`, `zh-CN`, and `x-default` alternates.
- Released Jotaro exposes one Codex Deep Link and three matching Copy actions for `part-03-jotaro-kujo`. The Wave Review Johnny page exposes no install anchor, Deep Link, Copy action, or `codex://` URL and retains its disabled `Wave review` control.
- English and Chinese `/parts/` each expose 36 unique direct localized pet-detail links with valid paths and the dual focus ring; nine secondary collection links remain.
- The unchanged production missing-page URL passed the Hostinger browser challenge, rendered the true Hostinger not-found page, and returned HTTP 404. No branded-404 work was included.

## Automated verification

Passed locally:

```text
pnpm check
pnpm counter:test
pnpm build
pnpm site:validate
git diff --check
```

`pnpm check` includes client tests proving all 24 Released pets share one command/Deep Link constructor, Copy attribution is snapshotted before an asynchronous Clipboard result, Clipboard failure does not count, endpoint failure does not undo Copy feedback, and both successful beacons and rejected fallback requests leave Deep Link navigation unblocked. `pnpm counter:test` additionally covers unreadable/empty stores, unreadable allowlists, forced short writes, failed atomic replacement, exact JSON errors under `display_errors=1`, and private-path non-disclosure.

The output validator confirms 82 pages, 24 Released selector options in both locales, all four action methods, FAQ presence, method-before-list order, localized hero CTA, Released-only detail anchors/actions, all 36 direct Part links, staged separate endpoints, and the 24-ID action allowlist. Existing SEO metadata validation remains active.

`pnpm production:build` was also run as a negative gate check and correctly refused the feature branch with `expected branch main` before producing a deployable candidate.

## Release gate and rollback

Independent final review found no unresolved P0/P1. This batch has not been merged, pushed, or deployed. A later release requires explicit user approval, successful CI, a clean synchronized `main`, `pnpm production:build`, a recorded candidate artifact hash, GSC/PSI baseline capture, and Hostinger upload from `apps/web/dist` contents only. Until then, rollback is simply dropping or reverting the feature candidate; production remains `8b283a2`.
