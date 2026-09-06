# JoJo Codex Pet 安装转化路径验收

结论：本 worktree 的详情页与 Install 页已在本地静态站点完成中英双语、移动端/桌面端和键盘路径验收；未部署生产、未合并 `main`。

## 范围

- Worktree：`/Users/geoqiao/.paseo/worktrees/30n9fhm8/jojo-install-path-2026-09-06`
- Branch：`agent/install-path-2026-09-06`
- 本地服务：`http://127.0.0.1:4173`
- 保持不变：36 个 Released catalog、既有 URL/SEO、像素资产、installer、费率和隐私契约。

## 浏览器验收

使用独立 Playwright CLI 浏览器会话 `jojo-followup`，在当前最终 `apps/web/dist` 上覆盖重拍以下六张截图：

| 页面 | 尺寸 | 结果 | 证据 |
| --- | ---: | --- | --- |
| English Install | 360×732 | 选择器/控制面板进入文档流；主 CTA 在首屏以下，未声称首屏可见 | [截图](qa-install-en-360.png) |
| 中文 Install | 390×844 | 中文前提、选择器、`在 Codex 中打开` 和安装后 Refresh 指引可见 | [截图](qa-install-zh-390.png) |
| English pet detail | 390×844 | 真实像素预览、桌面端前提、单一主 CTA 和手机复制页面链接可用 | [截图](qa-pet-en-390.png) |
| 中文 pet detail | 390×844 | 中文详情、真实像素预览、桌面端前提和主 CTA 可用 | [截图](qa-pet-zh-390.png) |
| English Install | 1440×1000 | 桌面端三栏选择/预览/主 CTA 布局正常 | [截图](qa-install-en-desktop.png) |
| English pet detail | 1440×1000 | 桌面端详情与安装卡片正常，无横向溢出 | [截图](qa-pet-en-desktop.png) |

360×732 初始滚动位置的实际几何位置：`.picker-control` top `607.39px`，`#released-pet-select` top `642.39px`，主 Codex CTA `.codex-action` top `852.27px`。因此选择器/控制面板已按最终 CSS 排在预览之前，但 CTA 不在 732px 首屏内；六张截图只记录最终候选的实际位置，不声称所有操作都在首屏。

## 交互步骤与结果

1. 在 Install 页选择 `Tusk ACT3`。
   - 选择值：`part-07-tusk-act-3`
   - Codex 深链、Bash、PowerShell、npx 命令和页面链接均切换到同一宠物 ID。
2. 点击 Bash `Copy`。
   - 浏览器剪贴板写入成功；本地 action endpoint 收到 `install_command_copy_success`。
3. 将剪贴板写入替换为拒绝，再点击 PowerShell `Copy`。
   - 按钮显示 `Copy failed`；没有成功 action 记录。
4. 点击手机转接的 `Copy page link`。
   - 成功显示 `Link copied`，写入当前 origin 下的宠物页 URL；该动作不发送安装统计。
   - 模拟剪贴板拒绝时显示 `Copy failed`。
5. 点击 `Open in Codex`。
   - 浏览器 harness 拦截 `codex://` 导航，页面仍停留在 Install 页；应用 click handler 发送一条 Codex 安装意图记录，不等待 metrics 返回。
6. 从选择器聚焦后按 `Tab`。
   - 真实焦点顺序经过选择器、`Open in Codex`、原生 `Other install methods` `<summary>`；焦点轮廓为 `outline: solid`。
7. 未执行 Bash、PowerShell 或 npx 安装器，也未执行真实 Codex 安装；因此不会把“点击/复制”误报成完成安装。项目代码没有写入 `~/.codex`。

## 自动检查

- `pnpm --filter @jojo-codex-pet/web test`
- `pnpm --filter @jojo-codex-pet/web check`
- `pnpm build`
- `pnpm site:validate`：82 个 HTML 文件
- `pnpm counter:test`
- `git diff --check`

以上均通过。生产部署、GSC、WAF、合并 `main` 均未执行。
