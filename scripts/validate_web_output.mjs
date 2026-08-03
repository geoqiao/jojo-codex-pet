import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../apps/web/dist/", import.meta.url));

if (!existsSync(dist)) {
  throw new Error("apps/web/dist is missing; run pnpm build first");
}

const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? walk(path) : [path];
});

const htmlFiles = walk(dist).filter((path) => path.endsWith(".html"));
const failures = [];
const titles = new Map();
const descriptions = new Map();

const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

expect(htmlFiles.length === 82, `expected 82 HTML files, found ${htmlFiles.length}`);
expect(existsSync(join(dist, "api/actions.php")), "missing staged action endpoint");
expect(existsSync(join(dist, "api/views.php")), "missing staged page-view endpoint");

const releasedIdsPath = join(dist, "api/released-pet-ids.json");
expect(existsSync(releasedIdsPath), "missing released-pet action allowlist");
let releasedIds = [];
if (existsSync(releasedIdsPath)) {
  const parsedReleasedIds = JSON.parse(readFileSync(releasedIdsPath, "utf8"));
  expect(Array.isArray(parsedReleasedIds), "released-pet action allowlist must be an array");
  if (Array.isArray(parsedReleasedIds)) releasedIds = parsedReleasedIds;
  expect(releasedIds.length === 24, `expected 24 released action IDs, found ${releasedIds.length}`);
}

const extract = (html, pattern) => html.match(pattern)?.[1]?.trim();

const routeFor = (file) => {
  const path = relative(dist, file).split(sep).join("/");
  if (path === "index.html") return "/";
  if (path.endsWith("/index.html")) return `/${path.slice(0, -"index.html".length)}`;
  return `/${path}`;
};

for (const file of htmlFiles) {
  const route = routeFor(file);
  const html = readFileSync(file, "utf8");
  const locale = route.startsWith("/zh-CN/") || route === "/zh-CN/" ? "zh-CN" : "en";
  const canonical = extract(html, /<link rel="canonical" href="([^"]+)"/);
  const title = extract(html, /<title>([\s\S]*?)<\/title>/);
  const description = extract(html, /<meta name="description" content="([^"]+)"/);
  const alternates = Object.fromEntries(
    [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)]
      .map((match) => [match[1], match[2]])
  );

  expect(Boolean(canonical), `${route}: missing canonical`);
  expect(Boolean(title), `${route}: missing title`);
  expect(Boolean(description), `${route}: missing meta description`);
  expect(Boolean(alternates.en), `${route}: missing hreflang=en`);
  expect(Boolean(alternates["zh-CN"]), `${route}: missing hreflang=zh-CN`);
  expect(Boolean(alternates["x-default"]), `${route}: missing hreflang=x-default`);

  if (canonical) {
    const canonicalUrl = new URL(canonical);
    const enPath = canonicalUrl.pathname.startsWith("/zh-CN/")
      ? canonicalUrl.pathname.slice("/zh-CN".length)
      : canonicalUrl.pathname === "/zh-CN/" ? "/" : canonicalUrl.pathname;
    const zhPath = enPath === "/" ? "/zh-CN/" : `/zh-CN${enPath}`;
    expect(alternates.en === `https://pixelstand.pet${enPath}`, `${route}: incorrect en alternate`);
    expect(alternates["zh-CN"] === `https://pixelstand.pet${zhPath}`, `${route}: incorrect zh-CN alternate`);
    expect(alternates["x-default"] === `https://pixelstand.pet${enPath}`, `${route}: incorrect x-default alternate`);
  }

  expect(html.includes('<meta property="og:site_name" content="JoJo Codex Pet">'), `${route}: missing og:site_name`);
  expect(/<meta property="og:image" content="https:\/\/pixelstand\.pet\/[^"]+">/.test(html), `${route}: missing absolute og:image`);
  expect(html.includes('<meta name="twitter:card" content="summary_large_image">'), `${route}: missing Twitter card`);
  expect(html.includes('<meta name="google-site-verification" content="tfvOJaUir_p6nethyb3vLwlTubhjqdMXfPyPLjA71_s">'), `${route}: missing Google site verification`);
  expect(html.includes('<meta name="google-adsense-account" content="ca-pub-3369430294552960">'), `${route}: missing Google AdSense account`);
  expect(!html.includes("data-spoiler-card"), `${route}: spoiler card marker still present`);
  expect(!html.includes("spoiler-cover"), `${route}: spoiler cover still present`);

  if (route.includes("/pets/")) {
    const titleKey = `${locale}:${title}`;
    const descriptionKey = `${locale}:${description}`;
    if (titles.has(titleKey)) failures.push(`${route}: duplicate title with ${titles.get(titleKey)}`);
    else titles.set(titleKey, route);
    if (descriptions.has(descriptionKey)) failures.push(`${route}: duplicate description with ${descriptions.get(descriptionKey)}`);
    else descriptions.set(descriptionKey, route);
  }
}

for (const route of ["/", "/zh-CN/"]) {
  const file = route === "/" ? join(dist, "index.html") : join(dist, "zh-CN/index.html");
  const html = readFileSync(file, "utf8");
  const cards = [...html.matchAll(/<article[\s\S]*?<\/article>/g)].map((match) => match[0]);
  const roster = new Map();

  for (const card of cards) {
    const id = extract(card, /data-pet-id="([^"]+)"/);
    const status = extract(card, /data-status="([^"]+)"/);
    if (id) roster.set(id, { status, card });
  }

  const released = [...roster.entries()].filter(([, item]) => item.status === "released");
  expect(roster.size === 36, `${route}: expected 36 unique cards, found ${roster.size}`);
  expect(released.length === 24, `${route}: expected 24 released cards, found ${released.length}`);
  for (const [id, item] of released) {
    const src = extract(item.card, /<img src="([^"]+)"/);
    expect(Boolean(src), `${route}: released pet ${id} has no image`);
    expect(src?.endsWith(".webp"), `${route}: released pet ${id} is not using WebP card art`);
    if (src) {
      const asset = join(dist, src.replace(/^\//, ""));
      expect(existsSync(asset), `${route}: released pet ${id} image is missing from dist`);
      if (existsSync(asset)) expect(statSync(asset).size < 500_000, `${route}: released pet ${id} card image exceeds 500 KB`);
    }
  }
}

for (const route of ["/", "/zh-CN/"]) {
  const file = route === "/" ? join(dist, "index.html") : join(dist, "zh-CN/index.html");
  const html = readFileSync(file, "utf8");
  const expectedCta = route === "/" ? "/install/" : "/zh-CN/install/";
  const heroCta = html.match(/<a\b[^>]*\bdata-home-install-cta\b[^>]*>/)?.[0];
  expect(Boolean(heroCta), `${route}: missing homepage hero Install CTA`);
  expect(heroCta?.includes(`href="${expectedCta}"`), `${route}: homepage hero Install CTA is not localized`);
  const jsonLd = extract(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  expect(Boolean(jsonLd), `${route}: missing WebSite JSON-LD`);
  if (jsonLd) {
    try {
      const data = JSON.parse(jsonLd);
      expect(data["@type"] === "WebSite", `${route}: JSON-LD is not WebSite`);
      expect(data.url === "https://pixelstand.pet/", `${route}: JSON-LD has incorrect site URL`);
      expect(data.name === "JoJo Codex Pet", `${route}: JSON-LD has incorrect site name`);
    } catch (error) {
      failures.push(`${route}: invalid JSON-LD (${error.message})`);
    }
  }
}

for (const route of ["/install/", "/zh-CN/install/"]) {
  const file = join(dist, route.replace(/^\//, ""), "index.html");
  const html = readFileSync(file, "utf8");
  const optionIds = [...html.matchAll(/<option value="(part-[^"]+)"/g)].map((match) => match[1]);
  expect(optionIds.length === 24, `${route}: expected 24 Released pet options, found ${optionIds.length}`);
  expect(
    optionIds.length === releasedIds.length && optionIds.every((id, index) => id === releasedIds[index]),
    `${route}: selector IDs do not match the staged Released-pet allowlist`
  );
  for (const method of ["codex", "bash", "powershell", "npx"]) {
    expect(html.includes(`data-action-method="${method}"`), `${route}: missing ${method} install action`);
  }
  const methodsIndex = html.indexOf('id="install-methods"');
  const releasedListIndex = html.indexOf('class="released-section"');
  expect(methodsIndex >= 0, `${route}: missing install-methods marker`);
  expect(releasedListIndex >= 0, `${route}: missing Released pet list marker`);
  if (methodsIndex >= 0 && releasedListIndex >= 0) {
    expect(methodsIndex < releasedListIndex, `${route}: install methods must precede the Released pet list`);
  }
  expect(html.includes('id="install-faq-title"'), `${route}: missing visible install FAQ`);
}

for (const route of ["/parts/", "/zh-CN/parts/"]) {
  const file = join(dist, route.replace(/^\//, ""), "index.html");
  const html = readFileSync(file, "utf8");
  const prefix = route.startsWith("/zh-CN/") ? "/zh-CN" : "";
  for (const id of JSON.parse(readFileSync(join(dist, "api/catalog-ids.json"), "utf8"))) {
    expect(html.includes(`href="${prefix}/pets/${id}/"`), `${route}: missing direct pet link for ${id}`);
  }
}

for (const file of htmlFiles.filter((path) => path.includes(`${sep}pets${sep}`))) {
  const route = routeFor(file);
  const html = readFileSync(file, "utf8");
  const isReleased = html.includes('data-status="released"');
  expect(html.includes('href="#install-this-pet"') === isReleased, `${route}: Released-only install anchor is inconsistent`);
  expect(/<a[^>]+data-install-deeplink/.test(html) === isReleased, `${route}: Released-only Codex action is inconsistent`);
}

if (failures.length > 0) {
  console.error(`Web output validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files: released pets are visible and SEO metadata is consistent.`);
