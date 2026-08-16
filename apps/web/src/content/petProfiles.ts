import type { LocalizedText } from "@jojo-codex-pet/catalog";

export interface PetProfileSection {
  title: LocalizedText;
  body: LocalizedText;
}

export interface PetProfile {
  seoDescription?: LocalizedText;
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
  },
  "part-07-tusk-act-1": {
    seoDescription: {
      en: "Tusk ACT1 is an unofficial animated pixel Codex pet for OpenAI Codex Desktop, released as its own validated V2 package in Johnny Joestar's four-stage Tusk lineage.",
      "zh-CN": "牙 ACT1 是面向 OpenAI Codex Desktop 的非官方像素动画宠物，作为乔尼·乔斯达四阶段牙系列中的独立 V2 宠物包发布。"
    },
    about: {
      title: { en: "Tusk ACT1 as a Codex pet", "zh-CN": "作为 Codex 宠物的牙 ACT1" },
      body: {
        en: "This page is for the site's unofficial animated pixel version of Tusk ACT1, not a general JoJo reference article. It is the first and smallest form in Johnny Joestar's four-pet Tusk lineage, but it remains an independently installable companion with the stable ID part-07-tusk-act-1.",
        "zh-CN": "本页介绍的是本站制作的非官方牙 ACT1 像素动画宠物，而不是通用 JoJo 百科条目。它是乔尼·乔斯达四只牙系列宠物中最初、最小的形态，但仍以稳定 ID part-07-tusk-act-1 作为可独立安装的小伙伴。"
      }
    },
    animationQa: {
      title: { en: "Tiny pixel form and V2 motion", "zh-CN": "迷你像素造型与 V2 动画" },
      body: {
        en: "The released ACT1 package uses a transparent 1536×2288 Codex Pet V2 atlas with the required 8×11 layout, nine standard animation states, and 16-direction look loop. Its package description identifies a tiny chibi Stand with attached Spin cues; the pink, cream, gold, and dark-wine palette keeps that compact silhouette readable at pet scale.",
        "zh-CN": "已发布的 ACT1 宠物包使用透明的 1536×2288 Codex Pet V2 图集，包含规定的 8×11 布局、九种标准动画状态和 16 方向视角循环。包描述将它定义为带有贴身回旋提示的迷你 Q 版替身；粉色、奶油色、金色与深酒红配色让紧凑轮廓在宠物尺寸下依然清楚。"
      }
    },
    packageCompatibility: {
      title: { en: "Install ACT1 by itself", "zh-CN": "单独安装 ACT1" },
      body: {
        en: "Open in Codex sends ACT1's display name and hosted V2 spritesheet to Codex. The Bash, PowerShell, and npx choices instead install part-07-tusk-act-1 and validate the package contract; none of these methods silently installs Johnny Joestar or a later ACT. Use the lineage links to compare the other forms before choosing a separate package.",
        "zh-CN": "“在 Codex 中打开”会把 ACT1 的显示名称与托管 V2 图集发送给 Codex；Bash、PowerShell 和 npx 则安装 part-07-tusk-act-1 并校验宠物包合同。所有方式都不会暗中安装乔尼·乔斯达或后续 ACT；可先通过系列链接比较其他形态，再分别选择宠物包。"
      }
    }
  },
  "part-07-tusk-act-2": {
    seoDescription: {
      en: "Tusk ACT2 is an unofficial animated pixel Codex pet for OpenAI Codex Desktop, with its own validated V2 package and a clear place in Johnny Joestar's Tusk lineage.",
      "zh-CN": "牙 ACT2 是面向 OpenAI Codex Desktop 的非官方像素动画宠物，拥有独立通过验证的 V2 宠物包，并属于乔尼·乔斯达的牙形态系列。"
    },
    about: {
      title: { en: "Tusk ACT2 as a Codex pet", "zh-CN": "作为 Codex 宠物的牙 ACT2" },
      body: {
        en: "Tusk ACT2 is represented here as the second unofficial animated pixel companion in Johnny Joestar's ordered Tusk set. The site does not treat it as a redirect or a paragraph on an ACT1 page: part-07-tusk-act-2 is a stable catalog identity with its own preview, palette, detail route, and installable package.",
        "zh-CN": "本站把牙 ACT2 制作为乔尼·乔斯达牙系列中第二只非官方像素动画宠物，而不是 ACT1 页面上的跳转或一段百科说明。part-07-tusk-act-2 是稳定的目录身份，拥有自己的预览、配色、详情路由和可安装宠物包。"
      }
    },
    animationQa: {
      title: { en: "Compact form and golden Spin cuff", "zh-CN": "紧凑造型与金色回旋护环" },
      body: {
        en: "ACT2's released V2 atlas is a transparent 1536×2288 WebP arranged as 8 columns by 11 rows, covering all nine standard states and the complete 16-direction look loop. Its package description calls out the compact chibi form and attached golden Spin cuff, while the darker violet-and-pink palette separates this pet from ACT1 without relying on a detached effect.",
        "zh-CN": "ACT2 已发布的 V2 图集是透明的 1536×2288 WebP，按 8 列 × 11 行排列，覆盖九种标准状态和完整的 16 方向视角循环。宠物包描述明确指出紧凑 Q 版造型与贴身金色回旋护环；更深的紫粉配色让它区别于 ACT1，而不依赖脱离主体的特效。"
      }
    },
    packageCompatibility: {
      title: { en: "A separate ACT2 package", "zh-CN": "独立的 ACT2 宠物包" },
      body: {
        en: "The Codex deep link opens metadata for Tusk ACT2 and its hosted spritesheet. Command-line installation uses the exact ID part-07-tusk-act-2, checking the manifest and downloaded package before writing this pet. ACT1, ACT3, ACT4, and Johnny Joestar remain separate choices, so moving forward in the visible lineage never changes the selected install behind the scenes.",
        "zh-CN": "Codex 深链打开牙 ACT2 及其托管图集的元数据；命令行安装则使用准确 ID part-07-tusk-act-2，并在写入这只宠物前校验清单和下载包。ACT1、ACT3、ACT4 与乔尼·乔斯达始终是独立选择，因此在可见系列中向后浏览不会暗中改变当前安装目标。"
      }
    }
  },
  "part-07-tusk-act-3": {
    seoDescription: {
      en: "Tusk ACT3 is an unofficial animated pixel Codex pet for OpenAI Codex Desktop, released with a validated V2 atlas, independent package, and documented visual QA.",
      "zh-CN": "牙 ACT3 是面向 OpenAI Codex Desktop 的非官方像素动画宠物，已凭通过验证的 V2 图集、独立宠物包与视觉 QA 记录发布。"
    },
    about: {
      title: { en: "Tusk ACT3 as a Codex pet", "zh-CN": "作为 Codex 宠物的牙 ACT3" },
      body: {
        en: "This is the product page for the site's unofficial Tusk ACT3 animated pixel pet. It occupies stage three between ACT2 and ACT4 in Johnny Joestar's Tusk lineage, while part-07-tusk-act-3 stays a standalone catalog and package identity. The page therefore describes what can be previewed and installed here rather than posing as a general ACT3 wiki entry.",
        "zh-CN": "这是本站非官方牙 ACT3 像素动画宠物的产品页。它在乔尼·乔斯达的牙系列中位于 ACT2 与 ACT4 之间的第三阶段，同时 part-07-tusk-act-3 仍是独立目录与宠物包身份。因此本页说明的是可在本站预览和安装的内容，而不是冒充通用 ACT3 百科。"
      }
    },
    animationQa: {
      title: { en: "Spiral-disc motion and recorded QA", "zh-CN": "螺旋圆盘动画与 QA 记录" },
      body: {
        en: "ACT3 emerges from an integrated spiral-disc base in its pixel design. Its 1536×2288 V2 atlas contains the nine required animation states and full 16-direction look loop; the release review records deterministic validation, three cardinal-direction blind reviews, and independent visual QA, while retaining the accepted secondary-axis and continuity warnings instead of hiding them.",
        "zh-CN": "ACT3 的像素设计从一体化螺旋圆盘底座中探出。1536×2288 V2 图集包含规定的九种动画状态和完整 16 方向视角循环；发布审核记录了确定性校验、三轮主方向盲审与独立视觉 QA，并如实保留已接受的次轴方向和连续性警告。"
      }
    },
    packageCompatibility: {
      title: { en: "Validated ACT3 install paths", "zh-CN": "通过验证的 ACT3 安装路径" },
      body: {
        en: "Tusk ACT3 is independently available through Open in Codex or the Bash, PowerShell, and npx commands on this page. CLI methods target part-07-tusk-act-3 and validate its manifest and SHA-256 package contract. Installing it does not bundle another Tusk ACT.",
        "zh-CN": "牙 ACT3 可通过本页的“在 Codex 中打开”、Bash、PowerShell 或 npx 独立安装。命令行方式以 part-07-tusk-act-3 为目标，并校验清单与 SHA-256 包合同。安装时不会捆绑其他牙 ACT。"
      }
    }
  },
  "part-07-tusk-act-4": {
    seoDescription: {
      en: "Tusk ACT4 is an unofficial animated pixel Codex pet for OpenAI Codex Desktop, released as the fourth independently installable V2 package in the Tusk lineage.",
      "zh-CN": "牙 ACT4 是面向 OpenAI Codex Desktop 的非官方像素动画宠物，作为牙系列中第四个可独立安装的 V2 宠物包发布。"
    },
    about: {
      title: { en: "Tusk ACT4 as a Codex pet", "zh-CN": "作为 Codex 宠物的牙 ACT4" },
      body: {
        en: "Tusk ACT4 is the fourth form in this site's ordered set of unofficial animated Tusk pets for Johnny Joestar. Its larger pixel silhouette is not used as a replacement image for the earlier forms: part-07-tusk-act-4 has a dedicated preview, detail page, locked palette, and V2 package that users select on its own.",
        "zh-CN": "牙 ACT4 是本站为乔尼·乔斯达制作的非官方牙动画宠物系列中的第四形态。它较大的像素轮廓并不会替换早期形态的图片：part-07-tusk-act-4 拥有专属预览、独立详情页、锁定配色和可单独选择的 V2 宠物包。"
      }
    },
    animationQa: {
      title: { en: "Large pixel form and Spin rings", "zh-CN": "大型像素造型与回旋金环" },
      body: {
        en: "The ACT4 package describes a powerful chibi Stand with attached golden Spin rings. Its released transparent WebP atlas follows the same validated Codex Pet V2 contract—1536×2288 pixels, 8×11 cells, nine standard animation states, and a complete 16-direction look loop—while the navy, deep pink, cream, and gold palette keeps the fourth form visually distinct.",
        "zh-CN": "ACT4 宠物包将其描述为带有贴身金色回旋环的强力 Q 版替身。已发布的透明 WebP 图集遵循同一套通过验证的 Codex Pet V2 合同：1536×2288 像素、8×11 单元、九种标准动画状态以及完整 16 方向视角循环；海军蓝、深粉、奶油色与金色配色让第四形态保持鲜明。"
      }
    },
    packageCompatibility: {
      title: { en: "Install the fourth form only", "zh-CN": "只安装第四形态" },
      body: {
        en: "Open in Codex uses Tusk ACT4's own display name and spritesheet URL. Bash, PowerShell, and npx target part-07-tusk-act-4 and validate that package before installation. The four visible lineage links explain sequence, not a bundle: selecting ACT4 installs neither Johnny Joestar nor ACT1–ACT3, and each earlier form keeps its own stable route and package.",
        "zh-CN": "“在 Codex 中打开”使用牙 ACT4 自己的显示名称与图集 URL；Bash、PowerShell 和 npx 以 part-07-tusk-act-4 为目标，并在安装前校验该宠物包。四个可见系列链接只说明顺序，并不代表捆绑：选择 ACT4 不会安装乔尼·乔斯达或 ACT1–ACT3，每个早期形态仍保留独立稳定路由与宠物包。"
      }
    }
  }
};
