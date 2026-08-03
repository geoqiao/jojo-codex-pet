# SEO Query Map

This document is an analysis appendix for the SEO ranking work. The approved implementation authority remains [`docs/seo-conversion-execution-handoff.md`](seo-conversion-execution-handoff.md); this map does not change its decisions, URL contract, or release gates.

## How To Use This Map

Assign one primary search intent to one canonical owner. Use secondary phrases only where they describe the same page's job. Do not create a new URL for a phrase, add `meta keywords`, or rewrite a pet title in bulk. Query-level numbers remain blank until a Google Search Console export is available.

The existing handoff snapshot records **112 impressions, 3 clicks, and average position 16.2** for the site, plus **6 impressions, 2 clicks, and average position 3.2** for the install page. Those are page-level snapshots, not query volumes; no per-query volume, position, or CTR is inferred here.

## English Map

| Canonical owner | Primary intent / query pattern | Secondary intent / query pattern | Page job and baseline | Observe in GSC |
| --- | --- | --- | --- | --- |
| `/` | `JoJo Codex Pet` | `JoJo Codex Desktop pets`; `animated JoJo Codex pet` | Brand and product identity. Keep the existing title/H1 subject; the first viewport now explains that this is an unofficial gallery of animated JoJo character and Stand companions for OpenAI Codex Desktop. | Query, page, impressions, clicks, CTR, average position, country, device |
| `/install/` | `install JoJo Codex pet` | `Codex pet download`; `Codex pet installer` | Installation intent. The released-pet selector, four install methods, FAQ, and Released list are the conversion baseline. | Query, page, impressions, clicks, CTR, average position, country, device; observe Copy/Open intent actions separately |
| `/parts/` | `JoJo Codex pets by Part` | `JoJo Codex pet collection`; `JoJo Part 3 pets` | Browse by story Part. Each Part card links directly to its existing pet detail pages; no Part detail URL is introduced. | Query, page, impressions, clicks, CTR, average position, country, device; landing pet links |
| `/roster/` | `JoJo Codex pet roster` | `JoJo Codex pet list`; `36 JoJo Codex pets` | Complete roster and release-state orientation. Keep Released versus Wave Review visible and link to the existing detail pages. | Query, page, impressions, clicks, CTR, average position, country, device; Released detail clicks |
| `/pets/[released-id]/` | `[Name] Codex Pet` | `[Name] animated Codex pet`; `[Name] Codex Desktop pet` | One released character or Stand. The Part 3 pilot details add unique About, Animation/QA, and Package/compatibility copy plus a visible install anchor. | Query, page, impressions, clicks, CTR, average position, country, device; install-anchor, deep-link, and command-copy intent |

## Chinese Map

| Canonical owner | Primary intent / query pattern | Secondary intent / query pattern | Page job and baseline | Observe in GSC |
| --- | --- | --- | --- | --- |
| `/zh-CN/` | `JoJo Codex Pet` | `JoJo Codex Desktop 宠物`; `JoJo 动画宠物` | 品牌与产品身份。保留现有 title/H1 主体；首屏明确这是面向 OpenAI Codex Desktop 的非官方 JoJo 角色与替身动画宠物目录。 | query、page、impressions、clicks、CTR、average position、country、device |
| `/zh-CN/install/` | `安装 JoJo Codex 宠物` | `Codex 宠物下载`; `Codex 宠物安装器` | 安装意图。已发布宠物选择器、四种安装方式、FAQ 与已发布名单是当前转化基线。 | query、page、impressions、clicks、CTR、average position、country、device；另看复制/打开意图动作 |
| `/zh-CN/parts/` | `JoJo Codex 宠物 篇章` | `JoJo Codex 宠物合集`; `JoJo 第三部宠物` | 按篇章浏览。每个篇章卡片直接链接到现有宠物详情页，不新增篇章详情 URL。 | query、page、impressions、clicks、CTR、average position、country、device；落地详情链接 |
| `/zh-CN/roster/` | `JoJo Codex 宠物名单` | `JoJo Codex 宠物列表`; `36 只 JoJo Codex 宠物` | 完整名单与发布状态导航。保持 Released 与 Wave Review 可见，并链接现有详情页。 | query、page、impressions、clicks、CTR、average position、country、device；已发布详情点击 |
| `/zh-CN/pets/[released-id]/` | `[名称] Codex 宠物` | `[名称] 动画 Codex 宠物`; `[名称] Codex Desktop 宠物` | 一只已发布角色或替身。第三部 Pilot 详情页增加独特的“关于这只宠物”“动画与 QA”“宠物包与兼容性”内容，并保留可见安装锚点。 | query、page、impressions、clicks、CTR、average position、country、device；安装锚点、深链、命令复制意图 |

## Observation Template

Populate one row per query after each 14-day and 28-day review window:

| Review window | Locale | Query | Landing page | Impressions | Clicks | CTR | Average position | Country/device | Intent action | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `YYYY-MM-DD..YYYY-MM-DD` | `en` or `zh-CN` | GSC value | GSC value | GSC value | GSC value | GSC value | GSC value | GSC value | Copy/Open/deep-link or `—` | Keep, expand content, or single-variable test |

Only run a title or H1 single-variable experiment after the owning page has roughly 200 impressions in a 28-day window. Until then, prioritize visible content, crawlable internal links, and accurate action measurements.
