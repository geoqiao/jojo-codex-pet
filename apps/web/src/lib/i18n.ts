import type { Locale, LocalizedText } from "@jojo-codex-pet/catalog";

export const localePrefix = (locale: Locale) => (locale === "en" ? "" : "/zh-CN");

export const route = (locale: Locale, path = "/") => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${localePrefix(locale)}${normalized}` || "/";
};

export const localize = (value: LocalizedText, locale: Locale) => value[locale];

export const ui = {
  en: {
    nav: { gallery: "Gallery", parts: "Parts", roster: "Roster", install: "Install", contribute: "Contribute" },
    fanProject: "Unofficial fan project",
    status: { planned: "Planned", "pilot-review": "Final review", "wave-review": "Wave review", released: "Released" },
    type: { character: "Character", stand: "Stand" },
    role: { protagonist: "Protagonist side", antagonist: "Principal antagonist side" },
    view: "views",
    reveal: "Reveal spoiler",
    open: "Open pet",
    source: "Source repository",
    notInstallable: "Animation QA pending",
    reviewNotInstallable: "Owner approval pending",
    language: "中文"
  },
  "zh-CN": {
    nav: { gallery: "宠物目录", parts: "篇章", roster: "名单", install: "安装", contribute: "投稿" },
    fanProject: "非官方同人项目",
    status: { planned: "计划中", "pilot-review": "最终动画审核", "wave-review": "批次动画审核", released: "已发布" },
    type: { character: "角色", stand: "替身" },
    role: { protagonist: "主角侧", antagonist: "篇章主反派侧" },
    view: "次浏览",
    reveal: "显示剧透",
    open: "打开宠物页",
    source: "源码仓库",
    notInstallable: "等待动画 QA",
    reviewNotInstallable: "等待站长最终审核",
    language: "EN"
  }
} as const;
