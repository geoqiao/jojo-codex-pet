# JoJo Codex Pet

[English](../../README.md)

这是一个非官方、非商业、无广告的 JoJo 主题 Codex 动态宠物合集。每个具名角色与替身都是独立可安装的 Codex 宠物，并按篇章展示在公开目录中。

> 当前公开开发状态：36 只首发名单已锁定。第三部 Pilot 四只均已完成 Codex Pet V2 图集，并通过确定性校验、三次独立方向盲测和最终视觉 QA。承太郎已经发布；白金之星、DIO 与世界仍等待站长最终动画审核，审核前不会开放安装按钮。

## 首发范围

- 第 1–9 部历代主角与篇章主反派
- 角色宠物与替身宠物分开
- 具名且持久的替身形态单独成为宠物
- 能力模式作为动画表现，不单独成为宠物
- 第 9 部连载期间不指定篇章主反派

首发名单共 36 只，分三波通过质量门发布。详见[完整名单](../headline-roster.md)。

## 网站

在正式域名启用前，[jojo-preview.easytry.shop](https://jojo-preview.easytry.shop/) 就是可索引的正式站。默认英文，可切换简体中文。

站点只公开累计宠物详情页浏览次数，不统计安装、不创建访客标识、不估算独立访客，也不接入广告分析。

## 安装空条承太郎

每种方式都只安装当前选择的宠物。安装后进入 Codex **Settings → Pets**，点击 **Refresh**，再选择 **Jotaro Kujo**。

```bash
curl -fsSL https://jojo-preview.easytry.shop/install.sh | bash -s -- part-03-jotaro-kujo
```

```bash
npx --yes --package=github:geoqiao/jojo-codex-pet jojo-codex-pet part-03-jotaro-kujo
```

Windows PowerShell 与官方 `codex://pets/install` 入口见网站的 Install 页面和承太郎详情页。

## 开发

需要 Node.js 22.12+ 与 pnpm 11。

```bash
pnpm install
pnpm check
pnpm build
pnpm dev
```

## 贡献与许可

Wave 1 通过质量门后才开放社区宠物 PR。项目代码使用 MIT 许可；JoJo 角色身份与同人素材不在 MIT 授权范围内。使用或投稿前请阅读 [FAN-ASSET-NOTICE.md](../../FAN-ASSET-NOTICE.md)。
