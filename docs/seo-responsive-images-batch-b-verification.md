# SEO responsive images — Batch B verification

Date: 2026-08-03

Status: `ready-for-merge` (local candidate only; not merged or deployed)

## Scope and baseline

- Base: `origin/main@8b283a2`.
- Scope: Ticket 6 only — 320/480/640 responsive pet-card WebP files plus `srcset`/`sizes`.
- Existing `*-card.webp` detail/fallback files remain byte-for-byte unchanged in Git, including Tusk ACT3.
- URL, title, canonical, hreflang, robots, sitemap, index status, catalog status, and the 24 Released / 12 Wave Review boundary are unchanged.

Production PageSpeed baseline captured during the 2026-08-03 audit (no field data was available):

| Page / mode | Performance | Accessibility | Best Practices | SEO | Key lab values |
| --- | ---: | ---: | ---: | ---: | --- |
| [Homepage mobile](https://pagespeed.web.dev/analysis/https-pixelstand-pet/pc3i9gjxet?form_factor=mobile) | 100 | 95 | 100 | 100 | FCP 1.0s · LCP 1.0s · TBT 0ms · CLS 0.012 · image-delivery opportunity 480 KiB |
| [Homepage desktop](https://pagespeed.web.dev/analysis/https-pixelstand-pet/pc3i9gjxet?form_factor=desktop) | 100 | 95 | 100 | 100 | FCP 0.3s · LCP 0.3s · TBT 0ms · CLS 0.021 · total payload 3,204 KiB · image-delivery opportunity 2,960 KiB |

A candidate PSI result is not available before deployment because PageSpeed Insights cannot fetch the local candidate. It must be recorded at the Batch B release gate if deployment is approved.

## Generated assets

| Variant | Files | Uncompressed repository bytes |
| --- | ---: | ---: |
| 320×320 WebP | 36 | 2,996,562 |
| 480×480 WebP | 36 | 5,871,752 |
| 640×640 WebP | 36 | 9,434,870 |
| **Responsive variants total** | **108** | **18,303,184** |

The build keeps the existing 36 detail/fallback WebP files (9,398,668 bytes) and adds exact square transparent-canvas variants so every `320w`, `480w`, and `640w` descriptor matches the file's real intrinsic width.

Full static output comparison from clean builds of the same base and candidate (excluding an incidental baseline-only `.DS_Store` Finder artifact):

- Baseline: 250 files / 116,922,922 bytes.
- Candidate: 358 files / 135,261,090 bytes.
- Difference: +108 files / +18,338,168 bytes (+15.68% uncompressed deployment size).

## 390px browser evidence

Browser Harness connected to the user's running Chrome and loaded the local candidate at a 390×844 CSS viewport with DPR 1 and cache disabled.

- Rendered card image box: 330×280 CSS px.
- Jotaro card `currentSrc`: `part-03-jotaro-kujo-card-480.webp`.
- The four visible/lazy-loaded Pilot cards requested only their 480px variants; none requested a 640px card.
- Those four requests total 402,056 bytes versus 639,448 bytes for the previous 640px fallback files: 237,392 bytes lower (37.12%) for that observed card set.
- At 600px/DPR 1, the real 249.31px slot selected 320px rather than the former fallback.
- A 1456px desktop check selected 320px at DPR 1 and 640px at DPR 2 for a 304px rendered card, confirming both the smaller desktop transfer and high-density fallback.
- Breakpoint checks on both sides of the 540/840/1180px column changes produced: 539px `330px → 480/640`, 541px `222.18px → 320/480`, 839px `330px → 480/640`, 841px `226.62px → 320/480`, 1179px `330px → 480/640`, and 1181px `240.80px → 320/640` at DPR 1/2. The last DPR 2 case correctly needs 640px because 480px is just below twice the rendered slot.
- Width, height, localized non-empty alt, lazy loading, async decoding, and pixelated rendering remain present.

## Automated verification

Passed locally:

```text
pnpm check
pnpm build
pnpm site:validate
git diff --check
```

The output validator checks all 36 cards in both locales for `srcset`, fallback, the exact localized name/Part alt, lazy loading, async decoding, intrinsic dimensions, and the built Gallery card selector's pixelated CSS. Instead of repeating the declaration, it independently models the real shell/grid/card slot at 25 representative viewport widths—including both sides of every layout breakpoint—and compares that model with the parsed `sizes` value. It also verifies all 108 responsive files and their exact dimensions, and now requires exactly 82 HTML routes and 82 unique matching sitemap URLs. Regenerating all variants produced identical SHA-256 manifests, confirming deterministic output.

`pnpm production:build` was run as a negative gate check and correctly refused the feature branch with `expected branch main` before producing a deployable candidate.

## Release gate

Independent final review found no unresolved P0/P1; its two P2 validator gaps were then closed and revalidated. This batch has not been merged, pushed, or deployed. The page-view runtime store and lock are excluded from Git and absent from the candidate. If approved later, merge after Batch A while preserving both batches' validator checks, wait for CI, run `pnpm production:build` only from a clean synchronized `main`, record `8b283a2` as the previous production commit, then capture candidate PSI and repeat the 390px request check against production.
