import type { Pet } from "./types";

const source = "https://github.com/geoqiao/jojo-codex-pet";

export const pets: readonly Pet[] = [
  { id: "part-01-jonathan-joestar", part: 1, name: { en: "Jonathan Joestar", "zh-CN": "乔纳森·乔斯达" }, type: "character", role: "protagonist", status: "wave-review", source, image: "/wave-1-bases/part-01-jonathan-joestar.png", palette: ["#11142c", "#6fc4a3", "#e47867", "#f5d24f"] },
  { id: "part-01-dio-brando", part: 1, name: { en: "Dio Brando", "zh-CN": "迪奥·布兰度" }, type: "character", role: "antagonist", status: "wave-review", source, spoiler: true, image: "/wave-1-bases/part-01-dio-brando.png", palette: ["#171a2b", "#f4e6e1", "#396a46", "#df3b87", "#79dcf0"] },

  { id: "part-02-joseph-joestar", part: 2, name: { en: "Joseph Joestar", "zh-CN": "乔瑟夫·乔斯达" }, type: "character", role: "protagonist", status: "wave-review", source, image: "/wave-1-bases/part-02-joseph-joestar.png", palette: ["#182348", "#3155c7", "#e87516", "#55d9d2", "#f0b33c"] },
  { id: "part-02-kars", part: 2, name: { en: "Kars", "zh-CN": "卡兹" }, type: "character", role: "antagonist", status: "wave-review", source, spoiler: true, image: "/wave-1-bases/part-02-kars.png", palette: ["#11152d", "#a56fc1", "#199a9b", "#e4b54c", "#a52f4e"] },

  { id: "part-03-jotaro-kujo", part: 3, name: { en: "Jotaro Kujo", "zh-CN": "空条承太郎" }, type: "character", role: "protagonist", status: "released", source, pairIds: ["part-03-star-platinum"], image: "/pilot-bases/part-03-jotaro-kujo.png", palette: ["#171a33", "#7ed6c4", "#ff6b6b", "#e8c66a"], packagePath: "/packages/part-03-jotaro-kujo" },
  { id: "part-03-star-platinum", part: 3, name: { en: "Star Platinum", "zh-CN": "白金之星" }, type: "stand", role: "protagonist", status: "pilot-review", source, ownerId: "part-03-jotaro-kujo", lineageStage: 1, image: "/pilot-bases/part-03-star-platinum.png", palette: ["#5a2c6f", "#42c7d9", "#ff6b6b", "#f4e6c2"] },
  { id: "part-03-dio", part: 3, name: { en: "DIO", "zh-CN": "DIO" }, type: "character", role: "antagonist", status: "pilot-review", source, pairIds: ["part-03-the-world"], spoiler: true, image: "/pilot-bases/part-03-dio.png", palette: ["#7a1f3d", "#f2e7cf", "#36c9c6", "#d9a441"] },
  { id: "part-03-the-world", part: 3, name: { en: "The World", "zh-CN": "世界" }, type: "stand", role: "antagonist", status: "pilot-review", source, ownerId: "part-03-dio", lineageStage: 1, spoiler: true, image: "/pilot-bases/part-03-the-world.png", palette: ["#1a686d", "#d9a441", "#7a1f3d", "#f2e7cf"] },

  { id: "part-04-josuke-higashikata", part: 4, name: { en: "Josuke Higashikata", "zh-CN": "东方仗助" }, type: "character", role: "protagonist", status: "planned", source, pairIds: ["part-04-crazy-diamond"] },
  { id: "part-04-crazy-diamond", part: 4, name: { en: "Crazy Diamond", "zh-CN": "疯狂钻石" }, type: "stand", role: "protagonist", status: "planned", source, ownerId: "part-04-josuke-higashikata", lineageStage: 1 },
  { id: "part-04-yoshikage-kira", part: 4, name: { en: "Yoshikage Kira", "zh-CN": "吉良吉影" }, type: "character", role: "antagonist", status: "planned", source, pairIds: ["part-04-killer-queen"], spoiler: true },
  { id: "part-04-killer-queen", part: 4, name: { en: "Killer Queen", "zh-CN": "杀手皇后" }, type: "stand", role: "antagonist", status: "planned", source, ownerId: "part-04-yoshikage-kira", lineageStage: 1, spoiler: true, abilityModes: [{ en: "Bites the Dust", "zh-CN": "败者食尘" }] },

  { id: "part-05-giorno-giovanna", part: 5, name: { en: "Giorno Giovanna", "zh-CN": "乔鲁诺·乔巴拿" }, type: "character", role: "protagonist", status: "planned", source, pairIds: ["part-05-gold-experience", "part-05-gold-experience-requiem"] },
  { id: "part-05-gold-experience", part: 5, name: { en: "Gold Experience", "zh-CN": "黄金体验" }, type: "stand", role: "protagonist", status: "planned", source, ownerId: "part-05-giorno-giovanna", lineageStage: 1 },
  { id: "part-05-gold-experience-requiem", part: 5, name: { en: "Gold Experience Requiem", "zh-CN": "黄金体验镇魂曲" }, type: "stand", role: "protagonist", status: "planned", source, ownerId: "part-05-giorno-giovanna", lineageStage: 2, spoiler: true },
  { id: "part-05-diavolo", part: 5, name: { en: "Diavolo", "zh-CN": "迪亚波罗" }, type: "character", role: "antagonist", status: "planned", source, pairIds: ["part-05-king-crimson"], spoiler: true },
  { id: "part-05-king-crimson", part: 5, name: { en: "King Crimson", "zh-CN": "绯红之王" }, type: "stand", role: "antagonist", status: "planned", source, ownerId: "part-05-diavolo", lineageStage: 1, spoiler: true },

  { id: "part-06-jolyne-cujoh", part: 6, name: { en: "Jolyne Cujoh", "zh-CN": "空条徐伦" }, type: "character", role: "protagonist", status: "planned", source, pairIds: ["part-06-stone-free"] },
  { id: "part-06-stone-free", part: 6, name: { en: "Stone Free", "zh-CN": "石之自由" }, type: "stand", role: "protagonist", status: "planned", source, ownerId: "part-06-jolyne-cujoh", lineageStage: 1 },
  { id: "part-06-enrico-pucci", part: 6, name: { en: "Enrico Pucci", "zh-CN": "恩里克·普奇" }, type: "character", role: "antagonist", status: "planned", source, pairIds: ["part-06-whitesnake", "part-06-c-moon", "part-06-made-in-heaven"], spoiler: true },
  { id: "part-06-whitesnake", part: 6, name: { en: "Whitesnake", "zh-CN": "白蛇" }, type: "stand", role: "antagonist", status: "planned", source, ownerId: "part-06-enrico-pucci", lineageStage: 1, spoiler: true },
  { id: "part-06-c-moon", part: 6, name: { en: "C-MOON", "zh-CN": "新月" }, type: "stand", role: "antagonist", status: "planned", source, ownerId: "part-06-enrico-pucci", lineageStage: 2, spoiler: true },
  { id: "part-06-made-in-heaven", part: 6, name: { en: "Made in Heaven", "zh-CN": "天堂制造" }, type: "stand", role: "antagonist", status: "planned", source, ownerId: "part-06-enrico-pucci", lineageStage: 3, spoiler: true },

  { id: "part-07-johnny-joestar", part: 7, name: { en: "Johnny Joestar", "zh-CN": "乔尼·乔斯达" }, type: "character", role: "protagonist", status: "planned", source, pairIds: ["part-07-tusk-act-1", "part-07-tusk-act-2", "part-07-tusk-act-3", "part-07-tusk-act-4"] },
  { id: "part-07-tusk-act-1", part: 7, name: { en: "Tusk ACT1", "zh-CN": "牙 ACT1" }, type: "stand", role: "protagonist", status: "planned", source, ownerId: "part-07-johnny-joestar", lineageStage: 1 },
  { id: "part-07-tusk-act-2", part: 7, name: { en: "Tusk ACT2", "zh-CN": "牙 ACT2" }, type: "stand", role: "protagonist", status: "planned", source, ownerId: "part-07-johnny-joestar", lineageStage: 2, spoiler: true },
  { id: "part-07-tusk-act-3", part: 7, name: { en: "Tusk ACT3", "zh-CN": "牙 ACT3" }, type: "stand", role: "protagonist", status: "planned", source, ownerId: "part-07-johnny-joestar", lineageStage: 3, spoiler: true },
  { id: "part-07-tusk-act-4", part: 7, name: { en: "Tusk ACT4", "zh-CN": "牙 ACT4" }, type: "stand", role: "protagonist", status: "planned", source, ownerId: "part-07-johnny-joestar", lineageStage: 4, spoiler: true },
  { id: "part-07-funny-valentine", part: 7, name: { en: "Funny Valentine", "zh-CN": "法尼·瓦伦泰" }, type: "character", role: "antagonist", status: "planned", source, pairIds: ["part-07-d4c"], spoiler: true },
  { id: "part-07-d4c", part: 7, name: { en: "D4C", "zh-CN": "D4C" }, type: "stand", role: "antagonist", status: "planned", source, ownerId: "part-07-funny-valentine", lineageStage: 1, spoiler: true, abilityModes: [{ en: "Love Train", "zh-CN": "Love Train" }] },

  { id: "part-08-josuke-higashikata", part: 8, name: { en: "Josuke Higashikata", "zh-CN": "东方定助" }, type: "character", role: "protagonist", status: "planned", source, pairIds: ["part-08-soft-and-wet"] },
  { id: "part-08-soft-and-wet", part: 8, name: { en: "Soft & Wet", "zh-CN": "软又湿" }, type: "stand", role: "protagonist", status: "planned", source, ownerId: "part-08-josuke-higashikata", lineageStage: 1, abilityModes: [{ en: "Go Beyond", "zh-CN": "超越" }] },
  { id: "part-08-toru", part: 8, name: { en: "Toru", "zh-CN": "透龙" }, type: "character", role: "antagonist", status: "planned", source, pairIds: ["part-08-wonder-of-u"], spoiler: true },
  { id: "part-08-wonder-of-u", part: 8, name: { en: "Wonder of U", "zh-CN": "奇迹于你" }, type: "stand", role: "antagonist", status: "planned", source, ownerId: "part-08-toru", lineageStage: 1, spoiler: true },

  { id: "part-09-jodio-joestar", part: 9, name: { en: "Jodio Joestar", "zh-CN": "乔迪奥·乔斯达" }, type: "character", role: "protagonist", status: "planned", source, pairIds: ["part-09-november-rain"] },
  { id: "part-09-november-rain", part: 9, name: { en: "November Rain", "zh-CN": "十一月雨" }, type: "stand", role: "protagonist", status: "planned", source, ownerId: "part-09-jodio-joestar", lineageStage: 1 }
];
