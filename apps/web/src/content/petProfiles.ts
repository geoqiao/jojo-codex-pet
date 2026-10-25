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
      title: { en: "Animation", "zh-CN": "动画" },
      body: {
        en: "The Jotaro animation set contains the nine standard state rows and 16 clockwise look directions. Its active cue follows the design notes: seafoam focus blocks stay attached to the hand or eyes, with antique-gold resolve ticks integrated into the coat chain or collar. All nine actions and 16 look directions were checked before release.",
        "zh-CN": "承太郎的动画包含九个标准状态行和 16 个顺时针视角。主动状态遵循设计规范：海沫绿色的专注方块贴在手部或眼部，古金色的决意刻线融入衣链或衣领。所有动作与视角都在发布前检查过。"
      }
    },
    packageCompatibility: {
      title: { en: "How installing works", "zh-CN": "安装方式" },
      body: {
        en: "Open in Codex installs only Jotaro Kujo. Bash, PowerShell and npx install it by its ID, part-03-jotaro-kujo, and check the download against a SHA-256 checksum before saving it. Star Platinum is a separate pet and is never added along with it.",
        "zh-CN": "“在 Codex 中打开”只会安装空条承太郎。Bash、PowerShell 和 npx 通过 ID part-03-jotaro-kujo 安装它，并在保存前用 SHA-256 校验下载内容。白金之星是另一只宠物，不会一起安装。"
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
      title: { en: "Animation", "zh-CN": "动画" },
      body: {
        en: "The Star Platinum animation set covers all nine standard states and the complete 16-direction look loop. Its animation style keeps cyan and coral impact blocks attached to the fists, with gold precision ticks attached to the eyes, shoulders, or gauntlets; no detached punch trail is used. All nine actions and 16 look directions were checked before release.",
        "zh-CN": "白金之星的动画覆盖九个标准状态和完整的 16 方向视角循环。动画规范要求青色与珊瑚色冲击方块贴在拳部，金色精准刻线贴在眼睛、肩部或护腕，不使用脱离主体的拳风轨迹。所有动作与视角都在发布前检查过。"
      }
    },
    packageCompatibility: {
      title: { en: "How installing works", "zh-CN": "安装方式" },
      body: {
        en: "Open in Codex installs only Star Platinum. Bash, PowerShell and npx install it by its ID, part-03-star-platinum, and check the download against a SHA-256 checksum before saving it. Jotaro Kujo is a separate pet and is never added along with it.",
        "zh-CN": "“在 Codex 中打开”只会安装白金之星。Bash、PowerShell 和 npx 通过 ID part-03-star-platinum 安装它，并在保存前用 SHA-256 校验下载内容。空条承太郎是另一只宠物，不会一起安装。"
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
      title: { en: "Animation", "zh-CN": "动画" },
      body: {
        en: "DIO's animation set presents the nine standard state rows followed by 16 clockwise look directions. The approved effect language uses oxblood and cyan pressure blocks attached to the eyes or active hand, with antique-gold fracture accents integrated into the heart ornament or cuffs; The World is never drawn inside DIO's rows. All nine actions and 16 look directions were checked before release.",
        "zh-CN": "DIO 的动画按顺序呈现九个标准状态行和 16 个顺时针视角。获批的效果语言使用贴在眼睛或主动手部的酒红与青色压力方块，并把古金色裂纹点缀融入心形饰件或袖口；DIO 的动画行中不会画入世界。所有动作与视角都在发布前检查过。"
      }
    },
    packageCompatibility: {
      title: { en: "How installing works", "zh-CN": "安装方式" },
      body: {
        en: "Open in Codex installs only DIO. Bash, PowerShell and npx install it by its ID, part-03-dio, and check the download against a SHA-256 checksum before saving it. The World is a separate pet and is never added along with it.",
        "zh-CN": "“在 Codex 中打开”只会安装DIO。Bash、PowerShell 和 npx 通过 ID part-03-dio 安装它，并在保存前用 SHA-256 校验下载内容。世界是另一只宠物，不会一起安装。"
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
      title: { en: "Animation", "zh-CN": "动画" },
      body: {
        en: "The World animation set contains the nine standard state rows and all 16 look directions. Its effect language uses turquoise time-lock plates attached to the gauntlets or torso, with oxblood and gold clock-slice accents integrated into the armor; the brief disallows a detached clock face, numerals, or environment-wide field. All nine actions and 16 look directions were checked before release.",
        "zh-CN": "世界的动画包含九个标准状态行和全部 16 个视角。它的效果语言使用贴在护腕或躯干上的绿松石色停时板块，并将酒红与金色的时钟切片融入装甲；规范禁止脱离主体的钟面、数字或覆盖环境的停时场。所有动作与视角都在发布前检查过。"
      }
    },
    packageCompatibility: {
      title: { en: "How installing works", "zh-CN": "安装方式" },
      body: {
        en: "Open in Codex installs only The World. Bash, PowerShell and npx install it by its ID, part-03-the-world, and check the download against a SHA-256 checksum before saving it. DIO is a separate pet and is never added along with it.",
        "zh-CN": "“在 Codex 中打开”只会安装世界。Bash、PowerShell 和 npx 通过 ID part-03-the-world 安装它，并在保存前用 SHA-256 校验下载内容。DIO是另一只宠物，不会一起安装。"
      }
    }
  },
  "part-07-tusk-act-1": {
    seoDescription: {
      en: "Tusk ACT1 is an unofficial animated pixel Codex pet for OpenAI Codex Desktop, and the first of four Tusk forms for Johnny Joestar. It installs on its own.",
      "zh-CN": "牙 ACT1 是面向 OpenAI Codex Desktop 的非官方像素动画宠物，是乔尼·乔斯达四个牙形态中的第一个，可单独安装。"
    },
    about: {
      title: { en: "Tusk ACT1 as a Codex pet", "zh-CN": "作为 Codex 宠物的牙 ACT1" },
      body: {
        en: "This page is for the site's unofficial animated pixel version of Tusk ACT1, not a general JoJo reference article. It is the first and smallest form in Johnny Joestar's four-pet Tusk lineage, but it remains an independently installable companion with the stable ID part-07-tusk-act-1.",
        "zh-CN": "本页介绍的是本站制作的非官方牙 ACT1 像素动画宠物，而不是通用 JoJo 百科条目。它是乔尼·乔斯达四只牙系列宠物中最初、最小的形态，但仍以稳定 ID part-07-tusk-act-1 作为可独立安装的小伙伴。"
      }
    },
    animationQa: {
      title: { en: "Tiny pixel form and 9 animations", "zh-CN": "迷你像素造型与 9 种动作" },
      body: {
        en: "ACT1 is a tiny chibi Stand with Spin cues attached to its body. It has all 9 animations and a full 16-direction look loop. Its pink, cream, gold and dark-wine palette keeps the small silhouette easy to read at pet size.",
        "zh-CN": "ACT1 是身上带着回旋提示的迷你 Q 版替身，拥有全部 9 种动作和完整的 16 方向视角循环。粉色、奶油色、金色与深酒红配色让小巧的轮廓在宠物尺寸下依然清楚。"
      }
    },
    packageCompatibility: {
      title: { en: "Install ACT1 by itself", "zh-CN": "单独安装 ACT1" },
      body: {
        en: "Open in Codex installs only Tusk ACT1. Bash, PowerShell and npx install it by its ID, part-07-tusk-act-1, and check the download against a SHA-256 checksum first. None of them also installs Johnny Joestar or a later ACT. Use the lineage links to compare the other forms before you pick another pet.",
        "zh-CN": "“在 Codex 中打开”只会安装牙 ACT1。Bash、PowerShell 和 npx 通过 ID part-07-tusk-act-1 安装它，并先用 SHA-256 校验下载内容。它们都不会同时安装乔尼·乔斯达或后面的 ACT。想看其他形态，可先通过系列链接比较，再另选宠物。"
      }
    }
  },
  "part-07-tusk-act-2": {
    seoDescription: {
      en: "Tusk ACT2 is an unofficial animated pixel Codex pet for OpenAI Codex Desktop, and the second of four Tusk forms for Johnny Joestar. It installs on its own.",
      "zh-CN": "牙 ACT2 是面向 OpenAI Codex Desktop 的非官方像素动画宠物，是乔尼·乔斯达四个牙形态中的第二个，可单独安装。"
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
        en: "ACT2 has all 9 animations and a full 16-direction look loop. It keeps the compact chibi form and adds a golden Spin cuff attached to the body. A darker violet-and-pink palette sets it apart from ACT1.",
        "zh-CN": "ACT2 拥有全部 9 种动作和完整的 16 方向视角循环。它保留紧凑的 Q 版造型，并加上贴身的金色回旋护环；更深的紫粉配色让它区别于 ACT1。"
      }
    },
    packageCompatibility: {
      title: { en: "A separate ACT2 package", "zh-CN": "独立的 ACT2 宠物包" },
      body: {
        en: "Open in Codex installs only Tusk ACT2. Bash, PowerShell and npx install it by its ID, part-07-tusk-act-2, and check the download against a SHA-256 checksum before saving it. ACT1, ACT3, ACT4 and Johnny Joestar stay separate choices, so browsing the lineage never changes what you install.",
        "zh-CN": "“在 Codex 中打开”只会安装牙 ACT2。Bash、PowerShell 和 npx 通过 ID part-07-tusk-act-2 安装它，并在保存前用 SHA-256 校验下载内容。ACT1、ACT3、ACT4 与乔尼·乔斯达都是独立选择，浏览系列不会改变你要安装的宠物。"
      }
    }
  },
  "part-07-tusk-act-3": {
    seoDescription: {
      en: "Tusk ACT3 is an unofficial animated pixel Codex pet for OpenAI Codex Desktop, and the third of four Tusk forms for Johnny Joestar. It installs on its own.",
      "zh-CN": "牙 ACT3 是面向 OpenAI Codex Desktop 的非官方像素动画宠物，是乔尼·乔斯达四个牙形态中的第三个，可单独安装。"
    },
    about: {
      title: { en: "Tusk ACT3 as a Codex pet", "zh-CN": "作为 Codex 宠物的牙 ACT3" },
      body: {
        en: "This is the product page for the site's unofficial Tusk ACT3 animated pixel pet. It occupies stage three between ACT2 and ACT4 in Johnny Joestar's Tusk lineage, while part-07-tusk-act-3 stays a standalone catalog and package identity. The page therefore describes what can be previewed and installed here rather than posing as a general ACT3 wiki entry.",
        "zh-CN": "这是本站非官方牙 ACT3 像素动画宠物的产品页。它在乔尼·乔斯达的牙系列中位于 ACT2 与 ACT4 之间的第三阶段，同时 part-07-tusk-act-3 仍是独立目录与宠物包身份。因此本页说明的是可在本站预览和安装的内容，而不是冒充通用 ACT3 百科。"
      }
    },
    animationQa: {
      title: { en: "Spiral-disc motion", "zh-CN": "螺旋圆盘动画" },
      body: {
        en: "ACT3 emerges from an integrated spiral-disc base in its pixel design. It has all nine animation states and a full 16-direction look loop, and each one was checked before release.",
        "zh-CN": "ACT3 的像素设计从一体化螺旋圆盘底座中探出。它包含九种动画状态和完整的 16 方向视角循环，发布前都已逐项检查。"
      }
    },
    packageCompatibility: {
      title: { en: "Install ACT3 by itself", "zh-CN": "单独安装 ACT3" },
      body: {
        en: "Tusk ACT3 installs on its own, through Open in Codex or the Bash, PowerShell and npx commands on this page. The commands use the ID part-07-tusk-act-3 and check the download against a SHA-256 checksum. Installing it does not bring along another Tusk ACT.",
        "zh-CN": "牙 ACT3 可通过本页的“在 Codex 中打开”、Bash、PowerShell 或 npx 单独安装。命令使用 ID part-07-tusk-act-3，并用 SHA-256 校验下载内容。安装它不会附带其他牙 ACT。"
      }
    }
  },
  "part-07-tusk-act-4": {
    seoDescription: {
      en: "Tusk ACT4 is an unofficial animated pixel Codex pet for OpenAI Codex Desktop, and the fourth of four Tusk forms for Johnny Joestar. It installs on its own.",
      "zh-CN": "牙 ACT4 是面向 OpenAI Codex Desktop 的非官方像素动画宠物，是乔尼·乔斯达四个牙形态中的第四个，可单独安装。"
    },
    about: {
      title: { en: "Tusk ACT4 as a Codex pet", "zh-CN": "作为 Codex 宠物的牙 ACT4" },
      body: {
        en: "Tusk ACT4 is the fourth form in this site's ordered set of unofficial animated Tusk pets for Johnny Joestar. Its larger pixel silhouette is not used as a replacement image for the earlier forms: part-07-tusk-act-4 has a dedicated preview, detail page, palette, and package that you pick on its own.",
        "zh-CN": "牙 ACT4 是本站为乔尼·乔斯达制作的非官方牙动画宠物系列中的第四形态。它较大的像素轮廓并不会替换早期形态的图片：part-07-tusk-act-4 拥有专属预览、独立详情页、专属配色和可单独选择的宠物包。"
      }
    },
    animationQa: {
      title: { en: "Large pixel form and Spin rings", "zh-CN": "大型像素造型与回旋金环" },
      body: {
        en: "ACT4 is a powerful chibi Stand with golden Spin rings attached to its body. It has all 9 animations and a full 16-direction look loop. Its navy, deep pink, cream and gold palette keeps the fourth form distinct.",
        "zh-CN": "ACT4 是带着贴身金色回旋环的强力 Q 版替身，拥有全部 9 种动作和完整的 16 方向视角循环。海军蓝、深粉、奶油色与金色配色让第四形态保持鲜明。"
      }
    },
    packageCompatibility: {
      title: { en: "Install the fourth form only", "zh-CN": "只安装第四形态" },
      body: {
        en: "Open in Codex installs only Tusk ACT4. Bash, PowerShell and npx install it by its ID, part-07-tusk-act-4, and check the download against a SHA-256 checksum first. The lineage links show the order, not a bundle: ACT4 does not install Johnny Joestar or ACT1–ACT3, and each of them has its own page.",
        "zh-CN": "“在 Codex 中打开”只会安装牙 ACT4。Bash、PowerShell 和 npx 通过 ID part-07-tusk-act-4 安装它，并先用 SHA-256 校验下载内容。系列链接只展示顺序，并不是捆绑包：ACT4 不会安装乔尼·乔斯达或 ACT1–ACT3，它们各有自己的页面。"
      }
    }
  }
};
