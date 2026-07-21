# Google Search Advanced SEO Research for pixelstand.pet

Date: 2026-07-21

## Scope

This note starts from Google's [Get started with Search Console](https://support.google.com/webmasters/answer/9128669?hl=en) guide, follows the "SEO (advanced user)" path, and uses only directly relevant first-party Google Search Central and Search Console documentation. It also compares those requirements with the current repository implementation. It does not have access to the property's private Search Console reports, so Search Console-only conclusions are explicitly separated below.

## Executive finding

`pixelstand.pet` has the basic repository-side foundations for discovery: a canonical production origin, static HTML, a sitemap integration, a permissive `robots.txt`, per-page canonical tags, visible internal navigation, and English/Chinese routes. Google defines the minimum technical eligibility requirements as: Googlebot is not blocked, the page returns HTTP `200`, and the page contains indexable content. Meeting those conditions makes a page eligible, but does not guarantee indexing. ([Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical))

The highest-value repo-side improvements are:

1. Complete every localized page's `hreflang` set with self-references.
2. Give every pet page a unique, descriptive title and description.
3. Give each pet page richer, page-specific text, metadata, and image signals.
4. Add a home-page `WebSite` identity signal and an explicit per-page preview image.
5. Redirect `www.pixelstand.pet` to the apex host. The disposable preview subdomain has now been removed.
6. Use Search Console's Page indexing, URL Inspection, Performance, Core Web Vitals, Manual actions, and Security reports as the authoritative monitoring loop.

Sitemap success means Google processed the sitemap and discovered submitted URLs. It does not establish that all submitted URLs are indexed, selected as canonicals, displayed, or ranking. Google explicitly says not to expect every URL to be indexed and to focus on the canonical version of every important page. ([Page indexing report](https://support.google.com/webmasters/answer/7440203))

## Pre-remediation repository baseline

The following observations were captured from the source tree before the remediation below, not from Search Console:

- `apps/web/astro.config.mjs` sets `https://pixelstand.pet` as the site origin, uses Astro's sitemap integration, and statically renders English and Simplified Chinese routes.
- `apps/web/public/robots.txt` allows all crawling and declares `https://pixelstand.pet/sitemap-index.xml`.
- `apps/web/src/layouts/BaseLayout.astro` provides a description, `index, follow`, favicon, self-canonical URL, the other language variant, `x-default`, Open Graph title/description/URL, and a normal crawlable navigation structure.
- `apps/web/src/components/pages/PetDetailPage.astro` renders every named pet and its detail content directly in static HTML without a spoiler gate.
- Pet art uses standard `<img src>` elements with width and height attributes, and related-pet navigation uses ordinary `<a href>` links.
- No JSON-LD structured data or `og:image` was emitted at the time of this baseline.
- The canonical-domain ADR previously proposed redirecting `jojo-preview.easytry.shop`, but the owner has now explicitly chosen to delete that disposable test subdomain instead.

## Pre-remediation live audit snapshot (2026-07-21)

The public and built-site audit produced the following evidence:

- Google Search Console successfully processed the sitemap index and discovered **82 URLs**.
- The sitemap contains **41 English and 41 Simplified Chinese URLs**. All 82 returned `200` to the crawl audit, had self-canonicals, contained a title, meta description and one H1, and had no accidental `noindex`.
- A built-site link audit checked **1,208 local references** and found no missing internal targets.
- The 100 built `<img>` elements all had non-empty alt text plus explicit width and height attributes.
- `http://pixelstand.pet` redirects to HTTPS, while `https://www.pixelstand.pet` currently serves a duplicate `200` page whose canonical points to the apex host. A direct server-side `301` or `308` from `www` to `https://pixelstand.pet` would be cleaner.
- A real Chrome session loaded both the home page and a released pet page successfully. Their rendered title, H1, canonical, robots directive, body text, and images were readable. A separate Lighthouse-style automated request received `403` only for a compressed automation probe; this is therefore not currently evidence that normal visitors or Google's basic static fetch are blocked. Lab performance remains unmeasured and should be rechecked from PageSpeed Insights or Search Console field data.
- There are **20 English** spoiler pages sharing `Spoiler pet — JoJo Codex Pet` and **20 Chinese** spoiler pages sharing `剧透宠物 — JoJo Codex Pet`. The Part 4 and Part 8 Josuke pages also share the same English title and description.
- The catalog contains **23 released and 13 planned pets**. Planned pages are currently short and structurally similar, so they need more page-specific value if they remain indexable.
- No page currently emits JSON-LD, `og:image`, or Twitter Card image metadata.
- Base/gallery PNG assets total roughly **22 MB**, with some individual 1024×1024 images around 1.7 MB. Responsive WebP/AVIF thumbnails are a concrete transfer-size opportunity.

## Implementation follow-up (2026-07-21)

The approved remediation has now been deployed to the production site:

- All 23 released pets and their artwork render directly. Spoiler covers, reveal buttons, hidden identities, and the catalog `spoiler` field were removed.
- All 82 pages now emit reciprocal `hreflang="en"`, `hreflang="zh-CN"`, and `hreflang="x-default"` links.
- Every English and Chinese pet page now has a Part-specific unique title and meta description, including both Josuke Higashikata entries.
- Every page now has `og:site_name`, an absolute `og:image`, and Twitter Card metadata. Home pages emit `WebSite` JSON-LD; pet pages emit `WebPage` JSON-LD with `primaryImageOfPage`.
- Twenty-three lossless 640px WebP card images total 5.47 MB and are used by gallery and detail-page visual rendering instead of the roughly 22 MB PNG source set. The high-resolution PNGs remain available for social/search preview metadata.
- Planned pages now contain subject-, Part-, role-, release-wave-, relationship-, ability-, and status-specific visible text rather than only a generic pending message.
- The production `.htaccess` now redirects `www.pixelstand.pet` and every path permanently to the equivalent `pixelstand.pet` URL with HTTP `301`.
- `pnpm site:validate` checks all 82 built HTML files for released-art visibility, unique pet metadata, language alternates, social metadata, structured data, and optimized card assets.
- A post-deployment crawl fetched all 82 sitemap URLs with `200`, verified 72 unique localized pet titles and descriptions, found all 36 catalog entries and 23 released WebP images, and confirmed the route-preserving `www` redirect.

## Applicable official requirements and recommendations

### 1. Crawling, indexing, and canonicalization

For each important page, verify that Googlebot can fetch the public URL, receives `200`, sees the important text and images, and is not blocked by `robots.txt`, a robots meta directive, authentication, or unreachable resources. Google recommends the Page indexing and Crawl Stats reports for site-wide problems and URL Inspection for individual pages. ([Technical requirements](https://developers.google.com/search/docs/essentials/technical), [Maintaining your website's SEO](https://developers.google.com/search/docs/fundamentals/get-started))

Internal discovery should not depend only on the sitemap. Google says links are both a discovery mechanism and a relevance signal; crawlable links should be real `<a>` elements with resolvable `href` values and descriptive anchor text. The current navigation and related-pet links use this pattern. Audit that every pet is reachable from at least one aggregation page without relying only on filtering or JavaScript state. ([Google link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable))

Do not treat a 100% indexed ratio as the goal. The goal is for the canonical version of each important page to be indexed; duplicate, removed, alternate, or low-value URLs can legitimately remain unindexed. For this 82-URL site, inspect the home page and representative high-value English and Chinese pages, then use the Page indexing report's reason groups to decide whether exclusions are intentional. ([Page indexing report](https://support.google.com/webmasters/answer/7440203))

### 2. English and Simplified Chinese localization

Google requires each `hreflang` cluster to list the current page itself and all alternate language versions, with fully qualified URLs. Both versions must point to each other or Google can ignore the annotations. `x-default` is an optional fallback and does not replace the language-specific self-reference. ([Localized versions documentation](https://developers.google.com/search/docs/specialty/international/localized-versions))

Gap at audit time, now resolved: `BaseLayout.astro` emitted only the other language and `x-default`. The correct set now present on both members of each pair is:

```html
<link rel="alternate" hreflang="en" href="https://pixelstand.pet/..." />
<link
  rel="alternate"
  hreflang="zh-CN"
  href="https://pixelstand.pet/zh-CN/..."
/>
<link rel="alternate" hreflang="x-default" href="https://pixelstand.pet/..." />
```

Keep a self-canonical on each genuinely translated language page rather than canonicalizing Chinese pages to English. Google considers localized pages duplicates only when the main content remains untranslated. ([Localized versions documentation](https://developers.google.com/search/docs/specialty/international/localized-versions))

### 3. Titles, snippets, and people-first content

Google recommends a descriptive and concise `<title>` on every page, avoiding vague, repeated, or boilerplate titles. The main visual title should also be clear and consistent with the title signal. ([Title link best practices](https://developers.google.com/search/docs/appearance/title-link))

Resolved in the current build: every pet title contains the exact subject, numbered Part, and localized Part title. The catalog now shows every identity directly, so search-result titles and visible page identity no longer conflict.

Google may build snippets from on-page text or use the meta description when it describes the page better. It recommends accurate, page-specific descriptions; programmatic descriptions are acceptable when they are human-readable and diverse. ([Snippet and meta-description guidance](https://developers.google.com/search/docs/appearance/snippet))

Opportunity identified at audit time, now implemented: pet descriptions and visible copy include meaningful page-specific facts already present in the catalog, such as Part, role, Stand relationship, release state, release wave, and installation availability. Snippets are still primarily generated from visible page content, so future copy improvements should remain visible rather than metadata-only.

Google's people-first guidance asks whether content is original, substantial, complete for its topic, produced carefully, clearly sourced, focused on a real audience, and satisfying after the visit. ([Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)) For this fan catalog, that means the strongest long-term ranking work is not adding keywords mechanically; it is adding genuinely useful, original material such as animation-state notes, ability-effect explanations, package QA evidence, installation compatibility, relationship navigation, and clear fan-project/source context. Audit planned and spoiler-protected pages for whether they provide a distinct user benefit instead of only a name and status template.

### 4. Images and visual discovery

Google recommends standard `<img src>` elements, descriptive alt text, relevant nearby text, descriptive filenames, responsive images, and a balance between quality and download size. It can use `og:image` or `primaryImageOfPage` to understand a preferred preview image; an image sitemap can help with images that are otherwise difficult to discover. ([Google image SEO best practices](https://developers.google.com/search/docs/appearance/google-images))

Current strengths: the pet art uses crawlable `<img src>` markup, supported PNG assets, explicit dimensions, and human-readable filenames.

Current opportunities:

- Localize and enrich alt text. `${name} pixel pet` remains partly English on Chinese pages and says little about Part, role, or visual subject.
- Add a representative, high-resolution absolute `og:image` for the home page and each released pet detail page. This also improves non-Google link previews.
- Consider `WebPage.primaryImageOfPage` when structured data is added.
- Measure the 1024×1024 PNG payloads and provide responsive variants if image transfer materially affects LCP. An image sitemap is optional rather than a prerequisite because the current images are directly discoverable in HTML.

### 5. Site identity, favicon, and structured data

Google says home-page `WebSite` structured data is the most important explicit way to express a preferred site name, while also considering `og:site_name`, the title, headings, and other home-page text. The chosen name should be concise, accurate, unique, and used consistently. ([Site names in Google Search](https://developers.google.com/search/docs/appearance/site-names))

Recommended enhancement: add a JSON-LD `WebSite` entity to the domain root with the canonical URL, `name: "JoJo Codex Pet"`, and a truthful `alternateName` if the project has one. Also add `og:site_name`. Do not present the project as an official JoJo organization; retain the visible unofficial fan-project disclosure.

The existing favicon link is structurally appropriate. Verify that the selected icon is square, stable, crawlable, visually representative, and preferably larger than 48×48 pixels. A valid favicon is eligible but not guaranteed to appear. ([Favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search))

Structured data is an enhancement, not an indexing requirement or ranking guarantee. Google recommends JSON-LD, requires the markup to represent visible main content accurately, and does not guarantee a rich result even when validation succeeds. Validate it with the Rich Results Test and URL Inspection. ([General structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies))

Optional later enhancement: visible breadcrumbs plus matching `BreadcrumbList` markup for routes such as `Gallery > Part 5 > Giorno Giovanna`. Do not add breadcrumb markup that invents a hierarchy users cannot see or navigate. ([Breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb))

### 6. Former host and canonical domain move

Google's preferred migration method for an old public hostname is server-side permanent redirects from each old URL to its corresponding new URL, kept for at least one year. That transfers signals more reliably than leaving duplicate hosts live. ([Google site-move guide](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes))

For this project, the owner has explicitly chosen deletion because `jojo-preview.easytry.shop` was only a disposable test host. Hostinger accepted and completed the website deletion on 2026-07-21: the subdomain no longer appears in the website/subdomain inventory, and an exact website lookup returns no result. The former URL stopped serving its previous duplicate `200` content and now fails TLS. The two remaining exact A/AAAA records were then deleted with narrow record filters and a final control-plane query returned no `jojo-preview` DNS records. Resolver caches may retain the old answer until its 1,800-second TTL expires.

This choice is acceptable for removing a test duplicate, but it deliberately gives up the signal-transfer benefit of route-for-route redirects. If Search Console or backlink data later shows that the preview host acquired meaningful signals, restoring a narrow redirect would be the SEO-preserving alternative.

### 7. Page experience and Core Web Vitals

Google recommends evaluating page experience holistically: Core Web Vitals, HTTPS, mobile display, distracting ads, intrusive interstitials, and whether the main content is easy to distinguish. ([Page experience guidance](https://developers.google.com/search/docs/appearance/page-experience)) The current ad-free presentation and static rendering are favorable starting points, but they do not prove field performance.

The published good-experience thresholds are LCP within 2.5 seconds, INP under 200 ms, and CLS under 0.1. Use Search Console's Core Web Vitals report for real-user groups and PageSpeed Insights for individual URLs. ([Core Web Vitals and Search](https://developers.google.com/search/docs/appearance/core-web-vitals)) Test at minimum the home page and a released pet page on mobile because the image-heavy detail layout can behave differently from aggregation pages. The current audit confirmed successful real-browser rendering but did not obtain reliable lab scores, so no performance pass/fail claim should be made yet.

## What can and cannot be inferred without Search Console access

### Can be verified publicly or from the repository

- Public HTTP status, redirect behavior, HTTPS, robots rules, sitemap syntax and listed URLs.
- Rendered HTML title, description, canonical, language annotations, structured data, headings, links, images, and visible content.
- Whether important assets are publicly fetchable without authentication.
- Lab performance and accessibility from PageSpeed Insights/Lighthouse.
- Whether a public Google search visibly returns a specific URL, with the caveat that results vary by user, place, device, and time.

### Requires the verified Search Console property

- Google's actual indexed/not-indexed count and each exclusion reason.
- The Google-selected canonical for an indexed URL.
- Google's last crawl, crawl source, crawler type, rendered screenshot, and resource/JavaScript problems for a specific URL.
- Whether a live-test success differs from the last indexed version. The live test does not predict the Google-selected canonical and does not test every Page indexing condition.
- Manual actions, security issues, temporary removals, crawl statistics, HTTPS report, and field Core Web Vitals group data.
- Search queries, impressions, clicks, CTR, average position, device/country breakdown, and Web versus Image Search performance.

Google warns that `URL is on Google` means eligible, not guaranteed to appear for every query, and that live inspection does not test manual actions, security issues, legal removals, temporary Search Console blocks, or all quality conditions. ([URL Inspection documentation](https://support.google.com/webmasters/answer/9012289))

## Live audit checklist for the main task

### A. Public fetch and rendered HTML

- [x] Confirm `https://pixelstand.pet/robots.txt` returns `200`, allows intended routes, and points to the canonical sitemap index.
- [x] Confirm the sitemap index and child sitemap return valid XML and list only canonical `https://pixelstand.pet` URLs.
- [x] Fetch all 82 sitemap URLs and record non-`200` results, redirect chains, duplicate canonicals, missing titles/descriptions/H1s, and accidental `noindex` values.
- [x] Configure `https://www.pixelstand.pet` and its paths to redirect directly to the preferred HTTPS apex host. Root and representative pet paths return route-preserving HTTP `301` responses.
- [x] Confirm Hostinger has removed the website/vhost and the exact A/AAAA records for `jojo-preview.easytry.shop`. The old site no longer serves duplicate content; only ordinary DNS cache expiry may remain.
- [ ] Check that all important HTML, CSS, fonts, pet images, and package links are fetchable anonymously.

### B. Language annotations

- [x] For every English/Chinese pair, verify identical sets containing self `en`, self `zh-CN`, and `x-default` absolute URLs.
- [x] Verify reciprocal mappings point to the true equivalent route.
- [x] Keep self-canonical URLs on both genuinely translated pages.
- [ ] Confirm each page's `<html lang>`, title, description, headings, alt text, and navigation match the page language.

### C. Titles, content, and internal discovery

- [x] Find and remove duplicate or generic pet-page titles.
- [x] Replace duplicate and thin pet meta descriptions with Part- and status-specific descriptions.
- [x] Confirm every page has one clear, visible main heading that matches its topic.
- [x] Confirm every pet URL is linked by crawlable HTML from the gallery, roster, parts, install, or related-pet navigation.
- [ ] Confirm planned entries still provide a distinct user benefit; otherwise consider whether they belong in the sitemap before real content exists.
- [ ] Review anchor text for useful subject names rather than generic-only labels.

### D. Images and search appearance

- [x] Confirm every meaningful pet image has localized, descriptive alt text and useful nearby text.
- [x] Add/verify representative `og:image` URLs and ensure preview images are crawlable, relevant, high-resolution, and not extreme in aspect ratio.
- [ ] Verify the favicon is square, stable, crawlable, and preferably larger than 48×48.
- [x] Add and validate home-page `WebSite` JSON-LD; add only visible-content-matching schema elsewhere.
- [ ] Run the Rich Results Test after any structured-data change.

### E. Page experience

- [ ] Run PageSpeed Insights for the English home page, Chinese home page, one released pet page, and one planned page on mobile and desktop.
- [ ] Record LCP, INP/TBT proxy where field INP is unavailable, CLS, blocking resources, image transfer, and mobile overflow.
- [x] Remove spoiler interactions so identities, released artwork, and useful text are always present and visible.
- [ ] Verify main content remains clear and usable without intrusive interstitials or ads.

### F. Search Console advanced-user loop

- [ ] Page indexing: compare indexed and not-indexed reason groups; focus on every important canonical page, not 100% of all discovered URLs.
- [ ] URL Inspection: inspect the home page, one aggregation page, two released English pet pages, their Chinese alternates, one planned page, and any affected URL from each exclusion group.
- [ ] For each inspected URL, compare user-declared canonical with Google-selected canonical, inspect last crawl and referring sitemap, run the live test, and view the rendered screenshot/resources.
- [ ] Overview, Manual actions, and Security issues: confirm no warnings.
- [ ] Crawl Stats and HTTPS: look for host, DNS, robots, 5xx, and certificate anomalies.
- [ ] Core Web Vitals: monitor field-data URL groups once sufficient data exists.
- [ ] Performance: after data accumulates, review queries, pages, devices, countries, Web/Image search type, impressions, clicks, CTR, and average position. Google defines CTR as clicks divided by impressions and cautions that average position is an approximate, context-dependent metric. ([Performance report](https://support.google.com/webmasters/answer/7576553), [metrics definitions](https://support.google.com/webmasters/answer/7042828))
- [ ] Recheck weekly during the first indexing period, then monthly unless an indexing, traffic, manual-action, or security alert appears.

## Prioritized implementation order

1. **P0 — Correctness (complete):** self-referential `hreflang`, unique pet titles, the production `www` redirect, and the explicitly requested preview-host deletion are live and verified.
2. **P1 — Distinct value and previews (complete):** pet text/meta descriptions, localized alt text, per-page `og:image`, and home-page `WebSite` identity markup are deployed.
3. **P1 — Evidence:** inspect representative URLs and all Page indexing reason groups in Search Console; run mobile PageSpeed tests.
4. **P2 — Enhancements:** consider responsive image variants, visible breadcrumbs plus matching `BreadcrumbList`, and an image sitemap only if image discovery is a measured priority.
5. **Ongoing:** use Search Console Performance data to decide which pages and queries deserve content improvements; optimize for meaningful impressions and qualified clicks rather than raw impression volume.

## Primary sources

- [Get started with Search Console](https://support.google.com/webmasters/answer/9128669?hl=en)
- [Maintaining your website's SEO](https://developers.google.com/search/docs/fundamentals/get-started)
- [Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical)
- [Page indexing report](https://support.google.com/webmasters/answer/7440203)
- [URL Inspection tool](https://support.google.com/webmasters/answer/9012289)
- [Performance report](https://support.google.com/webmasters/answer/7576553)
- [Search Console metric definitions](https://support.google.com/webmasters/answer/7042828)
- [Localized versions of pages](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Title link best practices](https://developers.google.com/search/docs/appearance/title-link)
- [Snippet and meta-description guidance](https://developers.google.com/search/docs/appearance/snippet)
- [Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google image SEO best practices](https://developers.google.com/search/docs/appearance/google-images)
- [Site names in Google Search](https://developers.google.com/search/docs/appearance/site-names)
- [Favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [General structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Google site-move guide](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Page experience guidance](https://developers.google.com/search/docs/appearance/page-experience)
- [Core Web Vitals and Search](https://developers.google.com/search/docs/appearance/core-web-vitals)
