import type { LocalizedText } from "@jojo-codex-pet/catalog";

export interface PetProfileSection {
  title: LocalizedText;
  body: LocalizedText;
}

export interface PetProfile {
  about: PetProfileSection;
  animationQa: PetProfileSection;
  packageCompatibility: PetProfileSection;
}

export const petProfiles: Readonly<Record<string, PetProfile>> = {
  "part-03-jotaro-kujo": {
    about: {
      title: { en: "About this Codex pet", "zh-CN": "关于这只 Codex 宠物" },
      body: {
        en: "Jotaro Kujo is the Part 3 protagonist-side character pet, paired with Star Platinum. The gallery keeps the character at the stable ID part-03-jotaro-kujo, so this released package can be installed on its own rather than silently adding the Stand.",
        "zh-CN": "空条承太郎是第三部主角侧的角色宠物，与白金之星配对。目录将角色固定为 part-03-jotaro-kujo 这个稳定 ID，因此这只已发布宠物可以单独安装，不会暗中附带替身。"
      }
    },
    animationQa: {
      title: { en: "Animation and QA", "zh-CN": "动画与 QA" },
      body: {
        en: "The Jotaro V2 reel contains the nine standard state rows and 16 clockwise look directions. Its active cue follows the Pilot brief: seafoam focus blocks stay attached to the hand or eyes, with antique-gold resolve ticks integrated into the coat chain or collar. The final 8×11 atlas passed deterministic validation, blind direction review, continuity review, and independent visual QA.",
        "zh-CN": "承太郎的 V2 动画包含九个标准状态行和 16 个顺时针视角。主动状态遵循 Pilot brief：海沫绿色的专注方块贴在手部或眼部，古金色的决意刻线融入衣链或衣领。最终 8×11 图集通过确定性校验、盲测方向审核、连续性审核和独立视觉 QA。"
      }
    },
    packageCompatibility: {
      title: { en: "Package and compatibility", "zh-CN": "宠物包与兼容性" },
      body: {
        en: "The Codex deep link sends Jotaro Kujo's name, hosted spritesheet URL, description, and spriteVersionNumber 2; it does not carry the stable ID or run the command-line package checks. Bash and PowerShell use part-03-jotaro-kujo to download the package and validate SHA-256 plus manifest id, spriteVersionNumber, and spritesheetPath. npx performs those same checks and additionally verifies that the WebP atlas is 1536×2288.",
        "zh-CN": "Codex 深链发送 Jotaro Kujo 的名称、托管图集 URL、描述和 spriteVersionNumber 2；它不携带稳定 ID，也不执行命令行安装器的包校验。Bash 与 PowerShell 使用 part-03-jotaro-kujo 下载宠物包，并校验 SHA-256 以及清单的 id、spriteVersionNumber 和 spritesheetPath。npx 执行同样的校验，并额外确认 WebP 图集为 1536×2288。"
      }
    }
  },
  "part-03-star-platinum": {
    about: {
      title: { en: "About this Codex pet", "zh-CN": "关于这只 Codex 宠物" },
      body: {
        en: "Star Platinum is the Part 3 protagonist-side Stand pet owned by Jotaro Kujo. It has its own stable ID, part-03-star-platinum, and its own package, which lets the Stand remain an independent Codex companion while the relationship stays visible on the detail page.",
        "zh-CN": "白金之星是第三部主角侧、由空条承太郎拥有的替身宠物。它使用独立的稳定 ID part-03-star-platinum 和独立宠物包，因此替身可以作为单独的 Codex 小伙伴安装，同时在详情页保留与承太郎的关系。"
      }
    },
    animationQa: {
      title: { en: "Animation and QA", "zh-CN": "动画与 QA" },
      body: {
        en: "The Star Platinum V2 reel covers all nine standard states and the complete 16-direction look loop. Its Pilot animation language keeps cyan and coral impact blocks attached to the fists, with gold precision ticks attached to the eyes, shoulders, or gauntlets; no detached punch trail is used. The 1536×2288 atlas passed deterministic, blind-direction, continuity, and independent visual QA gates.",
        "zh-CN": "白金之星的 V2 动画覆盖九个标准状态和完整的 16 方向视角循环。Pilot 动画规范要求青色与珊瑚色冲击方块贴在拳部，金色精准刻线贴在眼睛、肩部或护腕，不使用脱离主体的拳风轨迹。1536×2288 图集通过确定性、盲测方向、连续性和独立视觉 QA 门槛。"
      }
    },
    packageCompatibility: {
      title: { en: "Package and compatibility", "zh-CN": "宠物包与兼容性" },
      body: {
        en: "For Star Platinum, Open in Codex receives the display name, hosted spritesheet URL, description, and V2 version number as deep-link fields; it does not receive part-03-star-platinum or perform checksum and manifest validation. Bash and PowerShell download that stable ID and validate SHA-256, manifest id, spriteVersionNumber, and spritesheetPath. npx shares the contract and adds the 1536×2288 WebP dimension check, while every CLI flow installs only this Stand.",
        "zh-CN": "对白金之星而言，“在 Codex 中打开”只接收显示名称、托管图集 URL、描述和 V2 版本号这些深链字段；它不会接收 part-03-star-platinum，也不执行校验和或清单校验。Bash 与 PowerShell 下载这个稳定 ID，并校验 SHA-256、清单 id、spriteVersionNumber 和 spritesheetPath。npx 遵循相同合同并额外检查 1536×2288 WebP 尺寸；所有命令行流程都只安装这只替身。"
      }
    }
  },
  "part-03-dio": {
    about: {
      title: { en: "About this Codex pet", "zh-CN": "关于这只 Codex 宠物" },
      body: {
        en: "DIO is the Part 3 principal-antagonist-side character pet, paired with The World. The character remains a separate released package at part-03-dio, while the detail page links the pair so fans can move between the character and Stand identities without merging them.",
        "zh-CN": "DIO 是第三部篇章主反派侧的角色宠物，与世界配对。角色保留为独立的已发布包 part-03-dio，详情页再链接到配对替身，让读者可以在角色与替身身份之间切换，而不会把两者合并。"
      }
    },
    animationQa: {
      title: { en: "Animation and QA", "zh-CN": "动画与 QA" },
      body: {
        en: "DIO's V2 reel presents the nine standard state rows followed by 16 clockwise look directions. The approved effect language uses oxblood and cyan pressure blocks attached to the eyes or active hand, with antique-gold fracture accents integrated into the heart ornament or cuffs; The World is never drawn inside DIO's rows. The final atlas cleared deterministic, blind-direction, continuity, and independent visual QA.",
        "zh-CN": "DIO 的 V2 动画按顺序呈现九个标准状态行和 16 个顺时针视角。获批的效果语言使用贴在眼睛或主动手部的酒红与青色压力方块，并把古金色裂纹点缀融入心形饰件或袖口；DIO 的动画行中不会画入世界。最终图集通过确定性、盲测方向、连续性和独立视觉 QA。"
      }
    },
    packageCompatibility: {
      title: { en: "Package and compatibility", "zh-CN": "宠物包与兼容性" },
      body: {
        en: "DIO's deep link is metadata-only: it passes the name, hosted spritesheet URL, description, and spriteVersionNumber 2 to Codex, without a stable ID or CLI-style package validation. The Bash and PowerShell routes use part-03-dio and check SHA-256 plus manifest id, spriteVersionNumber, and spritesheetPath. The npx route repeats those checks and is the CLI path that also verifies the WebP atlas dimensions are 1536×2288.",
        "zh-CN": "DIO 的深链只传递元数据：将名称、托管图集 URL、描述和 spriteVersionNumber 2 交给 Codex，不携带稳定 ID，也不执行命令行安装器那样的包校验。Bash 和 PowerShell 使用 part-03-dio，并校验 SHA-256 以及清单 id、spriteVersionNumber 和 spritesheetPath。npx 重复这些校验，并额外确认 WebP 图集尺寸为 1536×2288。"
      }
    }
  },
  "part-03-the-world": {
    about: {
      title: { en: "About this Codex pet", "zh-CN": "关于这只 Codex 宠物" },
      body: {
        en: "The World is the Part 3 principal-antagonist-side Stand pet owned by DIO. It is published independently at part-03-the-world, with a direct relationship link back to DIO, so installing the Stand never implies installing the character as well.",
        "zh-CN": "世界是第三部篇章主反派侧、由 DIO 拥有的替身宠物。它以 part-03-the-world 独立发布，并通过关系链接返回 DIO，因此安装替身并不意味着同时安装角色。"
      }
    },
    animationQa: {
      title: { en: "Animation and QA", "zh-CN": "动画与 QA" },
      body: {
        en: "The World V2 reel contains the nine standard state rows and all 16 look directions. Its effect language uses turquoise time-lock plates attached to the gauntlets or torso, with oxblood and gold clock-slice accents integrated into the armor; the brief disallows a detached clock face, numerals, or environment-wide field. The 8×11 atlas passed deterministic, blind-direction, continuity, and independent visual QA.",
        "zh-CN": "世界的 V2 动画包含九个标准状态行和全部 16 个视角。它的效果语言使用贴在护腕或躯干上的绿松石色停时板块，并将酒红与金色的时钟切片融入装甲；规范禁止脱离主体的钟面、数字或覆盖环境的停时场。8×11 图集通过确定性、盲测方向、连续性和独立视觉 QA。"
      }
    },
    packageCompatibility: {
      title: { en: "Package and compatibility", "zh-CN": "宠物包与兼容性" },
      body: {
        en: "The World deep link carries its name, hosted spritesheet URL, description, and spriteVersionNumber 2, not part-03-the-world or a checksum/manifest/dimension check. Bash and PowerShell use part-03-the-world to validate SHA-256 and the manifest id, spriteVersionNumber, and spritesheetPath. npx applies that contract and adds a 1536×2288 WebP check before installing this Stand.",
        "zh-CN": "世界的深链携带名称、托管图集 URL、描述和 spriteVersionNumber 2，不携带 part-03-the-world，也不执行校验和、清单或尺寸检查。Bash 与 PowerShell 使用 part-03-the-world，校验 SHA-256 以及清单 id、spriteVersionNumber 和 spritesheetPath。npx 遵循这份合同，并在安装这只替身前额外检查 1536×2288 WebP 图集。"
      }
    }
  }
};
