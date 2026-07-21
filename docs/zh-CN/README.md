# JoJo Codex Pet

[English](../../README.md)

这是一个非官方、非商业、无广告的 JoJo 主题 Codex 动态宠物合集。每个具名角色与替身都在按篇章公开的目录中拥有独立宠物身份；完成的 V2 安装包始终一次只安装一只。

> 当前公开发布状态：第 1–9 部的 36 只首发宠物已全部展示。其中 23 只拥有完整且通过 QA 的 Codex Pet V2 安装包，现已全部发布并可独立安装；其余 13 只继续以“计划中”公开展示，等真实安装包通过同一质量门后再开放安装。

## 首发范围

- 第 1–9 部历代主角与篇章主反派
- 角色宠物与替身宠物分开
- 具名且持久的替身形态单独成为宠物
- 能力模式作为动画表现，不单独成为宠物
- 第 9 部连载期间不指定篇章主反派

首发名单共 36 只，分三波通过质量门发布。详见[完整名单](../headline-roster.md)、[第一波进度](../wave-1-status.md)、[第一波第 1–2 部动画审核](../visual/wave-1-animation-review/README.md)、[第二波进度](../wave-2-status.md)与[完整 15 只第二波动画审核](../visual/wave-2-animation-review/README.md)。

## 网站

在正式域名启用前，[jojo-preview.easytry.shop](https://jojo-preview.easytry.shop/) 就是可索引的正式站。默认英文，可切换简体中文。

站点只公开累计宠物详情页浏览次数，不统计安装、不创建访客标识、不估算独立访客，也不接入广告分析。

## 安装已发布宠物

每种方式都只安装当前选择的宠物。你可以在网站的[安装页](https://jojo-preview.easytry.shop/zh-CN/install/)选择 23 个已发布稳定 ID 中的任意一个。安装后进入 Codex **Settings → Pets**，点击 **Refresh**，再选择对应宠物。

```bash
curl -fsSL https://jojo-preview.easytry.shop/install.sh | bash -s -- part-03-jotaro-kujo
```

```bash
npx --yes --package=github:geoqiao/jojo-codex-pet jojo-codex-pet part-03-jotaro-kujo
```

Windows PowerShell 与官方 `codex://pets/install` 入口见网站的安装页和各个已发布宠物详情页。

## 开发

需要 Node.js 22.13+ 与 pnpm 11。

```bash
pnpm install
pnpm check
pnpm build
pnpm dev
```

## 贡献与许可

Wave 1 已通过质量门，现已开放仅限 JoJo 的扩展宠物 PR。项目代码使用 MIT 许可；JoJo 角色身份与同人素材不在 MIT 授权范围内。使用或投稿前请阅读 [CONTRIBUTING.md](../../CONTRIBUTING.md) 与 [FAN-ASSET-NOTICE.md](../../FAN-ASSET-NOTICE.md)。
