# pixelstand.pet SEO 转化执行 Handoff

状态：`ready-for-agent`

日期：2026-08-03
权威性：以本文件为剩余 SEO 与转化工作的实施边界；不要重新规划 Tusk ACT3，也不要把旧审计中的 Tusk Planned 页面实验带回来。

## Task

在不改 URL、title、canonical、hreflang、sitemap 或索引策略的前提下，完成 `pixelstand.pet` 的安装转化路径、隐私优先的 Copy/Open 聚合统计、Hub 内链和响应式图片优化，并按真实浏览器与生产构建路径验收。

## Context

2026-08-03 SEO 审计确认站点没有 P0 技术故障。审计使用的代码版本为 `0b3e269`，GSC 性能数据截至 2026-08-01：28 天 3 点击、112 曝光、CTR 2.7%、平均排名 16.2；`/install/` 只有 6 次曝光，但取得 2 次点击，平均排名 3.2。数据量很小，不能据此做批量 title、内容或索引策略变更。

审计发现的主要可执行问题：

- `/install/` 的四种安装方式固定指向 `releasedPets[0]`，命令位于完整宠物列表之后。
- 首页首屏没有明确的 Install CTA。
- Released pet 详情页安装区在长详情内容之后。
- `/parts/` 的 pet 名称是纯文本，主要入口跳回依赖查询参数过滤的首页 roster。
- pet 卡片只使用单一 640px WebP，没有 `srcset/sizes`。
- Copy 命令和 Open in Codex 点击当前不可测。

用户已作出两个产品决定：

1. Tusk ACT3 要制作成真实可安装宠物并填充现有详情页；不再做 Planned 页面桥接实验。
2. Copy/Open 行为统计要做，但只能描述为安装意图动作，不能称为成功安装。

Tusk ACT3 已由本次交付完成，不属于本 handoff 的待办。接收方不得重新生成、改画或退回 Planned 实验。

## Repository and branch state

- 当前工作目录：`/Users/geoqiao/Documents/JOJO-codex-pet`
- 当前分支：`agent/show-all-pets-and-seo`
- 进入本轮前 HEAD：`0b3e269`
- 本 handoff 与 Tusk ACT3 release 变更仍在 working tree、尚未 commit；接收方不得清理或覆盖这些未提交文件。
- `origin/main` 在 handoff 编写时为 `3a5bbf9`，包含 Wave 3 的 review 资产；其中 Tusk ACT3 原先仍为 `wave-review`，没有公开 `packagePath`。
- 只读参考 worktree：`/Users/geoqiao/Documents/JOJO-codex-pet-johnny-kimi-k3`（`herdr-worker/wave3-part7`，`e5d6982`）与 `/Users/geoqiao/Documents/JOJO-codex-pet-wave3-integration`（`herdr-worker/wave3-integration`，`3a5bbf9`）。剩余 SEO 工作不应在这两个 worktree 中落改动。
- 开始工作前必须重新运行 `git status --short`、`git log --oneline --decorate -8`，以实际状态为准。
- 不要盲目 cherry-pick 整个 `e5d6982` Part 7 commit；它包含 7 只宠物，会扩大本 handoff 范围，并与已经完成的 Tusk ACT3 文件重叠。

## Relevant files

- `apps/web/src/components/pages/InstallPage.astro` — 安装页布局、四种安装方法、Copy 逻辑；当前命令固定到第一只 Released pet。
- `apps/web/src/components/pages/GalleryPage.astro` — 首页 hero；可安装数量已改为从 catalog 动态计算，后续必须保留。
- `apps/web/src/components/PetDetailContent.astro` — Released pet 的 Open/Copy 操作和安装区。
- `apps/web/src/components/pages/PartsPage.astro` — Part Hub，当前 pet 名称不是详情页链接。
- `apps/web/src/components/PetCard.astro` — 640px 单图卡片输出。
- `apps/web/scripts/generate-card-images.mjs` — 卡片 WebP 生成入口。
- `apps/counter-api/views.php` — 现有 page-view 聚合端点；不要直接破坏其存储 schema。
- `apps/counter-api/stage.mjs` — 将 PHP 端点和 catalog ID 清单放入静态站构建目录。
- `apps/web/src/components/ViewCounts.astro` — 现有 page-view 客户端；行为统计应使用独立组件或小模块。
- `docs/adr/0024-count-page-views-instead-of-installations.md` — 当前明确禁止 in-page behavior tracking；新增 ADR 必须只 supersede 这一窄边界。
- `README.md`、`docs/zh-CN/README.md`、`apps/counter-api/README.md` — 对外隐私说明。
- `packages/catalog/src/validate.ts`、`scripts/validate_web_output.mjs` — package 和构建站点验收源。

## Current state

已完成：

- Tusk ACT3 V2 atlas、package、站点 base/card 资产、catalog release 填充和 QA 证据；Catalog 当前为 24 Released / 12 Planned。
- Tusk ACT3 已按真实 installer HTTP 下载、checksum 校验与原子安装路径完成代表性测试，并已写入当前用户的 `~/.codex/pets/part-07-tusk-act-3`。
- Tusk ACT3 不再需要 SEO 实验文案。
- 现有 82 个英文/中文 URL 的 URL 结构保持不变。

尚未实施：

- Copy/Open 聚合统计。
- `/install/` 原地 pet selector 与首屏命令。
- 首页和 Released detail 的 Install CTA。
- `/parts/` 直接 pet 内链。
- 320/480/640 响应式卡片图片。

## Protected completed scope

接收方可以在同一分支继续剩余 tickets，但必须保留以下已完成结果：

- `pets/part-07-tusk-act-3/`
- `apps/web/public/wave-3-bases/part-07-tusk-act-3.png`
- `apps/web/public/wave-3-bases/part-07-tusk-act-3-card.webp`
- `docs/visual/wave-3-tusk-act-3-review/`
- `packages/catalog/src/pets.ts` 中 Tusk ACT3 的 `released`、palette、image 与 `packagePath`
- `GalleryPage.astro` 中从 catalog 计算 Released 数量的逻辑
- README 的 24 Released / 12 Planned 现状

Tusk ACT3 的 V2 spritesheet SHA-256 为 `b54d175fdfa90878fab77f56b479b10e8040584e482e94835135671a218557e6`。接收方不应重新生成、替换或通过整票 cherry-pick 覆盖这些文件；如后续改动触及它们，必须重新跑完整 package、build 与 local-install hash 验收。

## Decisions

### D1 — Copy/Open 统计获批

只记录两个事件：

- `install_command_copy_success`：仅在 `navigator.clipboard.writeText()` resolve 后计数。
- `install_deeplink_click`：用户点击 `codex://pets/install` 时计数；它只代表点击意图。

绝不能记录或推断成功安装。Bash、PowerShell、npx 和 Codex installer 都不得发送安装完成事件。

### D2 — 最小隐私数据合同

允许存储的字段只有：

- server-generated `day`
- allowlisted `event_type`
- Catalog `pet_id`
- allowlisted `method`: `bash | powershell | npx | codex`
- allowlisted `locale`: `en | zh-CN`
- allowlisted canonical `landing_path`
- aggregate `count` 与 `updated_at`

禁止 Cookie、session、event ID、用户/设备 ID、IP、User-Agent、raw referrer、查询字符串、自由文本错误、账号名、路径或 hostname。不要增加 `source_class`；GSC 已提供搜索来源的聚合数据，当前规模不值得引入跨页状态。

统计失败必须静默降级，不能阻止 Copy、Deep Link 或静态页面使用。计数是 directional，不是 unique users，也不做去重承诺。

### D3 — 保持 page-view counter 稳定

优先新增独立 `actions.php` 与独立私有存储文件，例如 `.jojo-codex-pet-actions.json`，不要把事件 schema 塞进现有 `.jojo-codex-pet-views.json`。两者可复用同样的 catalog allowlist、文件锁和 atomic replace 设计，但不要求先抽象公共 PHP 框架。

### D4 — SEO 稳定面

本轮明确不改：

- URL、canonical、hreflang、robots、sitemap、noindex
- 首页或 `/install/` 的 title/H1 主体
- pet title/description 的批量规则
- 新 Part landing pages
- Hostinger WAF/CDN/缓存规则
- 批量 Request Indexing

## Execution order

### Ticket 1 — Aggregate Copy/Open actions

实施一条完整但最小的 tracer path：

1. 新增 ADR，说明只对 ADR-0024 的“无 in-page behavior tracking”窄条款作修订，仍不收集 installation events。
2. 新增并 stage `actions.php`，使用独立私有 JSON/lock 文件。
3. 对 payload 的每个字段做 enum/allowlist 校验，限制 body 大小，只接受 `POST`。
4. 增加小型客户端 Action component/module。
5. 接入当前 `/install/` 和 Released pet detail：Copy 成功后 fire-and-forget 计数；Deep Link 点击时使用 `sendBeacon` 或 `fetch(..., {keepalive:true})`，但导航绝不能等待统计结果。
6. 更新中英文隐私文案：公开说明记录匿名聚合 Copy/Open 动作，但不记录安装结果或访客标识。

验收：

- [ ] 合法 Copy/Open payload 只增加对应聚合 key。
- [ ] 未知 pet、event、method、locale、path 和超大 body 返回 4xx，不写文件。
- [ ] 请求中即使夹带额外字段，额外字段也不进入存储。
- [ ] endpoint 失败时 Copy/Open 主动作仍成功。
- [ ] Copy 失败不计数。
- [ ] 没有 Cookie、localStorage、sessionStorage 或 identifier。
- [ ] 对外文案不出现“successful install”或“conversion user”。

### Ticket 2 — `/install/` conversion path

- 将 pet selector 和四种安装方式移到完整 Released pet 长列表之前（当前 24 只，必须动态计算）。
- selector 只列 `status === "released" && packagePath` 的 pet。
- 原地选择后同时更新 Open in Codex、Bash、PowerShell、npx；四种方法必须始终指向同一个 `pet_id`。
- 默认 pet 可以保留 Catalog 中第一只 Released pet，但 UI 必须明确当前选择。
- 增加基于真实 installer 行为的可见 FAQ：平台、安装位置、Codex Refresh、SHA-256/manifest 校验、重新安装行为。
- 保持 URL、title、H1、canonical 不变。

验收：

- [ ] 遍历所有 Released pet，四种方法均生成正确 ID/package URL。
- [ ] 390px 首屏可发现选择器和安装动作，不需越过完整 pet 列表。
- [ ] selector、tabs/buttons、Copy feedback 全部键盘可用且有 visible focus。
- [ ] Copy 成功事件使用选择后的 `pet_id` 和正确 `method`。

### Ticket 3 — Homepage Install CTA

- Hero 增加明确的 `Install a released pet` CTA，直链 localized `/install/`。
- 可安装数量从 catalog 计算的改动已随 Tusk ACT3 完成；保留该逻辑，不再硬编码数字。
- 保留品牌 H1、title 和现有 hero 主题。

### Ticket 4 — Released detail CTA

- Released pet 首屏增加 `Install this pet ↓` 锚点，指向现有 install box。
- 不复制第二套命令或 Deep Link 生成逻辑。
- Planned/review 状态不展示可安装 CTA。
- 现有详情页 Copy/Open 统一接入 Ticket 1 的 action module。

### Ticket 5 — `/parts/` direct internal links

- 每个 hero/antagonist pet 名称使用真实 `<a href>` 直达 localized detail page。
- 保留现有 `Open collection` 过滤入口作为次要入口。
- 不创建新 Part URL。

### Ticket 6 — Responsive pet images

- 生成 320/480/640 WebP 变体，并在 `PetCard.astro` 使用 `srcset/sizes`。
- 详情页需要的 640px 版本保留；小屏卡片不应默认下载 640px。
- 保留 `width`、`height`、alt、lazy loading 和 pixelated rendering。
- 将性能变更作为独立部署批次，不与安装页重新排序混在同一性能基线。

### Ticket 7 — Deploy and observe

- 每批发布前保存 GSC page/query baseline 与 PSI URL 结果。
- 7 天只检查功能、索引状态、5xx/404 和 Copy error；不下排名结论。
- 14 天看 Released 页面收录和落地页到动作的方向性变化。
- 28 天比较等长窗口 CTR、动作数、索引覆盖和 PSI；流量不足时延长观察，不制造显著性结论。

## Deferred backlog and activation gates

以下项目来自原始 SEOreview，但不应混入第一批转化实现。接收方要保留它们，并且只在对应条件满足后单独开票：

- **Branded 404**：可增加 Gallery 与 Install 链接，但先验证现有 404 仍返回真实 `404`，不能为了品牌页误变成 soft 404。
- **Accessibility fixes**：在改 CTA/selector 时顺手修复同一组件内的 contrast、touch target 与 visible focus；其余问题单独跑 Lighthouse/axe 后开票，不做全站视觉重构。
- **QA evidence and freshness**：Breadcrumb、可见更新时间或 QA 证据链接只有在有真实、持续维护的数据源时再加；不要生成装饰性或过期标记。
- **Owned-channel links**：只在真实 GitHub README、Release 或安装文档中自然添加描述性 `/install/` / Released pet 链接；不要为了外链数量制造内容。任何 GitHub 发布动作都需要用户单独授权。
- **HTTP security headers / PHP exposure**：HSTS、`X-Frame-Options`、`Referrer-Policy` 与 PHP 版本暴露属于安全加固，不是当前 SEO 瓶颈；需先确认 Hostinger 配置面与回滚方式，再独立实施。
- **Hostinger logs / WAF**：只有拿到 hPanel access/error log 后才分析 bot、5xx 或 WAF；当前 GSC Live Test 成功，不能从一次 `curl 403` 推断 Google 被拦，更不能直接放宽生产 WAF。
- **Title/description experiment**：单页达到约 200 impressions / 28 天后，一次只测试一页；保留发布前基线和独立回滚点。当前不启动。
- **Indexing escalation**：Released 页面首次发现 28 天后仍大面积未抓取时，再调查抓取与内链；此前不批量 Request Indexing、不改 noindex/sitemap。
- **New Part landing pages**：现有 82 个 URL 收录稳定后再评估；本轮不新增 URL。

## Verification

每张实现票至少运行：

```bash
pnpm check
pnpm build
pnpm site:validate
git diff --check
```

浏览器验收使用真实 Chrome 路径，至少覆盖英文/中文、桌面和 390px：

- 首页 CTA
- `/install/` selector 和四种方法
- Released pet Copy/Open
- Planned/review pet 不可安装状态
- `/parts/` 直接详情页链接
- 404 与一个代表性 canonical/hreflang 页面

生产前后 sitemap URL 数仍应为 82；Tusk ACT3 是已有 URL 的状态填充，不应新增页面。

## What was tried or rejected

- Tusk ACT3 Planned 页面桥接实验 — 用户明确取消，因为 Tusk ACT3 改为真实制作并填充。
- 标准 A/B test — 当前流量太低，不足以支持；采用顺序发布和页面级观察。
- 批量 title/description 更新 — GSC 样本不足，暂不做。
- 批量 noindex、移出 sitemap 或 Request Indexing — 没有技术封锁证据，风险高于收益。
- 为“外链数量”刻意制造 GitHub 链接 — README 已有描述性 `/install/` 链接；以后只在真实 Release/安装文档中自然链接。

## Constraints

- 用户要求剩余工作交给其他人；不要在 Tusk ACT3 交付会话继续实现这些 tickets。
- 不部署生产、不改 Hostinger 控制面，除非用户另行明确批准。
- 不把 mock 或静态单元测试当成端到端完成证据；至少执行一条真实 Copy payload、一个真实 Deep Link click handler 和完整 production build。
- 保持英文默认、中文 `/zh-CN/` 与 Released pet 的动态计数一致；本 handoff 快照为 24 只。
- 生产输出不得泄露 email、IP、UA、raw referrer 或其他敏感数据。
- JoJo fan assets 不属于 MIT code license；保留现有非官方、非商业和 Fan Asset Notice 边界。
