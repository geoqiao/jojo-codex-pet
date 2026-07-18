import type { Part } from "./types";

export const parts = [
  { number: 1, slug: "phantom-blood", title: { en: "Phantom Blood", "zh-CN": "幻影之血" }, subtitle: { en: "A gentleman and the first darkness", "zh-CN": "绅士与最初的黑暗" }, accent: "#d84b57", count: 2 },
  { number: 2, slug: "battle-tendency", title: { en: "Battle Tendency", "zh-CN": "战斗潮流" }, subtitle: { en: "Trickery against the ultimate lifeform", "zh-CN": "智略对抗究极生命体" }, accent: "#e69a38", count: 2 },
  { number: 3, slug: "stardust-crusaders", title: { en: "Stardust Crusaders", "zh-CN": "星尘斗士" }, subtitle: { en: "The Pilot Set begins here", "zh-CN": "Pilot 四只从这里开始" }, accent: "#7657d9", count: 4 },
  { number: 4, slug: "diamond-is-unbreakable", title: { en: "Diamond is Unbreakable", "zh-CN": "不灭钻石" }, subtitle: { en: "A bright town with a hidden killer", "zh-CN": "明亮小镇与潜伏的杀手" }, accent: "#e553a4", count: 4 },
  { number: 5, slug: "golden-wind", title: { en: "Golden Wind", "zh-CN": "黄金之风" }, subtitle: { en: "Resolve takes shape in Italy", "zh-CN": "觉悟在意大利成形" }, accent: "#d7b63f", count: 5 },
  { number: 6, slug: "stone-ocean", title: { en: "Stone Ocean", "zh-CN": "石之海" }, subtitle: { en: "A prison, a lineage, and heaven", "zh-CN": "监狱、血脉与天堂" }, accent: "#54a58a", count: 6 },
  { number: 7, slug: "steel-ball-run", title: { en: "Steel Ball Run", "zh-CN": "飙马野郎" }, subtitle: { en: "A race across a new world", "zh-CN": "横跨新世界的竞赛" }, accent: "#b56b3d", count: 7 },
  { number: 8, slug: "jojolion", title: { en: "JoJolion", "zh-CN": "乔乔福音" }, subtitle: { en: "Identity beneath the wall eyes", "zh-CN": "壁之眼下的身份谜题" }, accent: "#4ca7ba", count: 4 },
  { number: 9, slug: "the-jojolands", title: { en: "The JOJOLands", "zh-CN": "The JOJOLands" }, subtitle: { en: "A mechanism for becoming rich", "zh-CN": "通往大富豪的机制" }, accent: "#6fbe5b", count: 2 }
] as const satisfies readonly Part[];
