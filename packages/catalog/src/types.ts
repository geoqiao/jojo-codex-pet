export type Locale = "en" | "zh-CN";

export interface LocalizedText {
  en: string;
  "zh-CN": string;
}

export interface Part {
  number: number;
  slug: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  accent: string;
  count: number;
}

export type PetType = "character" | "stand";
export type StoryRole = "protagonist" | "antagonist";
export type PetStatus = "planned" | "pilot-review" | "wave-review" | "released";

export interface Pet {
  id: string;
  part: number;
  name: LocalizedText;
  type: PetType;
  role: StoryRole;
  status: PetStatus;
  source: string;
  ownerId?: string;
  pairIds?: string[];
  lineageStage?: number;
  abilityModes?: LocalizedText[];
  image?: string;
  palette?: string[];
  packagePath?: string;
}
