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

const outputFiles = walk(dist);
const htmlFiles = outputFiles.filter((path) => path.endsWith(".html"));
const failures = [];
const titles = new Map();
const descriptions = new Map();

const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

const extract = (html, pattern) => html.match(pattern)?.[1]?.trim();

const webpDimensions = (path) => {
  const data = readFileSync(path);
  if (data.length < 30 || data.toString("ascii", 0, 4) !== "RIFF" || data.toString("ascii", 8, 12) !== "WEBP") {
    return undefined;
  }

  for (let offset = 12; offset + 8 <= data.length;) {
    const chunk = data.toString("ascii", offset, offset + 4);
    const size = data.readUInt32LE(offset + 4);
    const payload = offset + 8;
    if (chunk === "VP8X" && payload + 10 <= data.length) {
      return [data.readUIntLE(payload + 4, 3) + 1, data.readUIntLE(payload + 7, 3) + 1];
    }
    if (chunk === "VP8L" && payload + 5 <= data.length && data[payload] === 0x2f) {
      const bits = data.readUInt32LE(payload + 1);
      return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
    }
    offset = payload + size + (size % 2);
  }

  return undefined;
};

const cssLengthAt = (length, viewport) => {
  const pixels = length.match(/^([\d.]+)px$/);
  if (pixels) return Number(pixels[1]);

  const calculation = length.match(/^calc\(([\d.]+)vw\s*-\s*([\d.]+)px\)$/);
  if (calculation) return viewport * Number(calculation[1]) / 100 - Number(calculation[2]);
  return Number.NaN;
};

const sourceSizeAt = (sizes, viewport) => {
  for (const clause of sizes.split(",").map((part) => part.trim())) {
    const conditional = clause.match(/^\(max-width:\s*([\d.]+)px\)\s+(.+)$/);
    if (conditional) {
      if (viewport <= Number(conditional[1])) return cssLengthAt(conditional[2], viewport);
      continue;
    }
    return cssLengthAt(clause, viewport);
  }
  return Number.NaN;
};

const renderedCardImageWidth = (viewport) => {
  const shellWidth = viewport <= 800 ? viewport - 20 : Math.min(1480, viewport - 32);
  const columns = viewport <= 540 ? 1 : viewport <= 840 ? 2 : viewport <= 1180 ? 3 : 4;
  const cardWidth = (shellWidth - 26 * (columns - 1)) / columns;
  return Math.min(330, 0.92 * (cardWidth - 6));
};

const responsiveViewports = [
  320, 384, 385, 390, 539, 540, 541, 600, 775, 776, 799, 800, 801,
  839, 840, 841, 900, 1178, 1179, 1180, 1181, 1456, 1512, 1513, 1600
];

const routeFor = (file) => {
  const path = relative(dist, file).split(sep).join("/");
  if (path === "index.html") return "/";
  if (path.endsWith("/index.html")) return `/${path.slice(0, -"index.html".length)}`;
  return `/${path}`;
};

expect(htmlFiles.length === 82, `expected exactly 82 HTML files, found ${htmlFiles.length}`);
const sitemapPath = join(dist, "sitemap-0.xml");
expect(existsSync(sitemapPath), "sitemap-0.xml is missing");
if (existsSync(sitemapPath)) {
  const sitemap = readFileSync(sitemapPath, "utf8");
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const sitemapRoutes = new Set(sitemapUrls.map((url) => new URL(url).pathname));
  const htmlRoutes = new Set(htmlFiles.map(routeFor));
  expect(sitemapUrls.length === 82, `expected exactly 82 sitemap URLs, found ${sitemapUrls.length}`);
  expect(sitemapRoutes.size === 82, `expected 82 unique sitemap URLs, found ${sitemapRoutes.size}`);
  expect(htmlRoutes.size === 82, `expected 82 unique HTML routes, found ${htmlRoutes.size}`);
  expect([...htmlRoutes].every((route) => sitemapRoutes.has(route)), "HTML routes and sitemap URLs do not match");
}

const cssOutput = outputFiles
  .filter((path) => path.endsWith(".css"))
  .map((path) => readFileSync(path, "utf8"))
  .join("\n");
expect(
  /\.pet-art[^,{]*\s+img[^,{]*\{[^}]*image-rendering:\s*pixelated/.test(cssOutput),
  "built Gallery card CSS is missing pixelated rendering"
);

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

const checkedSizes = new Set();

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
  for (const [id, item] of roster) {
    const src = extract(item.card, /<img src="([^"]+)"/);
    const srcset = extract(item.card, /srcset="([^"]+)"/);
    const sizes = extract(item.card, /sizes="([^"]+)"/);
    const alt = extract(item.card, /\salt="([^"]*)"/);
    const name = extract(item.card, /<h3[^>]*>([\s\S]*?)<\/h3>/);
    const part = extract(item.card, /data-part="part-([0-9]{2})"/);
    const expectedAlt = name && part
      ? route === "/"
        ? `${name}, Part ${Number(part)} pixel Codex pet`
        : `${name}，JoJo 第 ${Number(part)} 部像素 Codex 宠物`
      : undefined;
    expect(Boolean(src), `${route}: pet ${id} has no image`);
    expect(src?.endsWith("-card.webp"), `${route}: pet ${id} is not using the 640px detail/fallback WebP`);
    expect(Boolean(alt), `${route}: pet ${id} has an empty alt`);
    expect(Boolean(expectedAlt && alt === expectedAlt), `${route}: pet ${id} has an incorrect localized name/Part alt`);
    expect(item.card.includes('width="640" height="640"'), `${route}: pet ${id} is missing intrinsic dimensions`);
    expect(item.card.includes('loading="lazy"'), `${route}: pet ${id} is missing lazy loading`);
    expect(item.card.includes('decoding="async"'), `${route}: pet ${id} is missing async decoding`);
    expect(Boolean(sizes), `${route}: pet ${id} is missing responsive sizes`);

    if (sizes && !checkedSizes.has(sizes)) {
      checkedSizes.add(sizes);
      for (const viewport of responsiveViewports) {
        const declaredWidth = sourceSizeAt(sizes, viewport);
        const renderedWidth = renderedCardImageWidth(viewport);
        expect(Number.isFinite(declaredWidth), `${route}: pet ${id} has an unreadable sizes value at ${viewport}px`);
        if (Number.isFinite(declaredWidth)) {
          expect(
            Math.abs(declaredWidth - renderedWidth) <= 0.1,
            `${route}: pet ${id} sizes is ${declaredWidth.toFixed(2)}px at ${viewport}px but CSS renders ${renderedWidth.toFixed(2)}px`
          );
        }
      }
    }

    if (src) {
      const base = src.replace(/-card\.webp$/, "");
      const expectedSrcset = `${base}-card-320.webp 320w, ${base}-card-480.webp 480w, ${base}-card-640.webp 640w`;
      expect(srcset === expectedSrcset, `${route}: pet ${id} has incorrect responsive srcset`);
      const fallback = join(dist, src.replace(/^\//, ""));
      expect(existsSync(fallback), `${route}: pet ${id} fallback image is missing from dist`);
      if (existsSync(fallback)) expect(statSync(fallback).size < 500_000, `${route}: pet ${id} fallback image exceeds 500 KB`);

      for (const width of [320, 480, 640]) {
        const variant = join(dist, `${base.replace(/^\//, "")}-card-${width}.webp`);
        expect(existsSync(variant), `${route}: pet ${id} is missing its ${width}px variant`);
        if (existsSync(variant)) {
          const dimensions = webpDimensions(variant);
          expect(dimensions?.[0] === width && dimensions?.[1] === width, `${route}: pet ${id} ${width}px variant has incorrect dimensions`);
        }
      }
    }
  }
}

for (const route of ["/", "/zh-CN/"]) {
  const file = route === "/" ? join(dist, "index.html") : join(dist, "zh-CN/index.html");
  const html = readFileSync(file, "utf8");
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

if (failures.length > 0) {
  console.error(`Web output validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files: released pets are visible and SEO metadata is consistent.`);
