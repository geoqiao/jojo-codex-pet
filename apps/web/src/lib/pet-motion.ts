import fit from "./pet-motion-fit.json";
import states from "./pet-motion-states.json";

export const motionStates = states;
export type MotionStateId = (typeof states)[number]["id"];

export const motionStripUrl = (petId: string, state: string) => `/pet-motion/${petId}/${state}.webp`;
export const motionPosterUrl = (petId: string) => `/pet-motion/${petId}/poster.webp`;

export const motionLabels: Record<"en" | "zh-CN", Record<string, string>> = {
  en: {
    idle: "Idle",
    "running-right": "Run right",
    "running-left": "Run left",
    waving: "Wave",
    jumping: "Jump",
    failed: "Failed",
    waiting: "Waiting",
    running: "Working",
    review: "Review"
  },
  "zh-CN": {
    idle: "待机",
    "running-right": "向右跑",
    "running-left": "向左跑",
    waving: "挥手",
    jumping: "跳跃",
    failed: "失败",
    waiting: "等待",
    running: "工作中",
    review: "审阅"
  }
};

/** Inline custom properties that place the animation layer over the pet's static card art. */
export const motionFitStyle = (petId: string) => {
  const box = (fit as Record<string, { left: number; top: number; width: number; height: number } | undefined>)[petId];
  return box ? `--fit-left:${box.left}%;--fit-top:${box.top}%;--fit-width:${box.width}%;--fit-height:${box.height}%` : undefined;
};

const durationsFor = (state: string) => states.find((item) => item.id === state)?.durations;

const strips = new Map<string, Promise<boolean>>();

/** Fetches and decodes one strip once; resolves false when the strip is unavailable. */
export const loadStrip = (url: string) => {
  let strip = strips.get(url);
  if (!strip) {
    const image = new Image();
    image.src = url;
    strip = image.decode().then(() => true, () => false);
    strips.set(url, strip);
  }
  return strip;
};

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export interface MotionStep {
  state: string;
  /** Plays before moving to the next step (the last step wraps to the first); omit to loop forever. */
  loops?: number;
}

/**
 * Plays a pet's animation strips on one layer element with the per-frame durations of the Codex pet
 * states. The layer is a background-image box, so CSS alone decides how large the pet is drawn.
 */
export class MotionPlayer {
  readonly #layer: HTMLElement;
  readonly #petId: string;
  #steps: MotionStep[];
  #step = 0;
  #frame = 0;
  #loop = 0;
  #timer = 0;
  #wanted = false;
  #inView = true;
  #tabVisible = true;
  #generation = 0;

  constructor(layer: HTMLElement, petId: string, steps: MotionStep[]) {
    this.#layer = layer;
    this.#petId = petId;
    this.#steps = steps;
  }

  get playing() {
    return this.#wanted;
  }

  get state() {
    return this.#steps[this.#step]!.state;
  }

  /** Pauses while the layer is scrolled away or the tab is hidden, and resumes afterwards. */
  watchVisibility() {
    new IntersectionObserver(([entry]) => {
      this.#inView = entry!.isIntersecting;
      this.#syncVisibility();
    }).observe(this.#layer);
    document.addEventListener("visibilitychange", () => {
      this.#tabVisible = !document.hidden;
      this.#syncVisibility();
    });
  }

  /** Switches to new steps and shows their first frame; returns false when the strip cannot load. */
  async set(steps: MotionStep[]) {
    const generation = this.#invalidate();
    this.#steps = steps;
    this.#step = 0;
    this.#frame = 0;
    this.#loop = 0;
    const ready = await this.#draw(generation);
    if (ready && generation === this.#generation && this.#wanted) this.#schedule();
    return ready;
  }

  /** Shows the first frame without playing. */
  async showFirstFrame() {
    this.#wanted = false;
    return this.set(this.#steps);
  }

  async play() {
    this.#wanted = true;
    return this.set(this.#steps);
  }

  pause() {
    this.#wanted = false;
    this.#invalidate();
  }

  #syncVisibility() {
    if (!this.#inView || !this.#tabVisible) {
      this.#invalidate();
    } else if (this.#wanted) {
      this.#schedule();
    }
  }

  #invalidate() {
    window.clearTimeout(this.#timer);
    return ++this.#generation;
  }

  async #draw(generation: number) {
    const state = this.state;
    const url = motionStripUrl(this.#petId, state);
    if (!(await loadStrip(url))) return false;
    if (generation !== this.#generation) return false;
    const frames = durationsFor(state)!.length;
    this.#layer.style.backgroundImage = `url(${url})`;
    this.#layer.style.backgroundSize = `${frames * 100}% 100%`;
    this.#layer.style.backgroundPosition = frames > 1 ? `${(this.#frame / (frames - 1)) * 100}% 0` : "0 0";
    return true;
  }

  #schedule() {
    if (!this.#inView || !this.#tabVisible) return;
    const generation = this.#invalidate();
    const durations = durationsFor(this.state)!;
    this.#timer = window.setTimeout(() => void this.#advance(generation), durations[this.#frame]);
  }

  async #advance(generation: number) {
    const durations = durationsFor(this.state)!;
    this.#frame += 1;
    if (this.#frame >= durations.length) {
      this.#frame = 0;
      this.#loop += 1;
      const step = this.#steps[this.#step]!;
      if (step.loops !== undefined && this.#loop >= step.loops) {
        this.#step = (this.#step + 1) % this.#steps.length;
        this.#loop = 0;
      }
    }
    if (await this.#draw(generation) && generation === this.#generation) this.#schedule();
  }
}

interface HoverMotion {
  player: MotionPlayer;
  hover: boolean;
  focus: boolean;
}

/**
 * Plays the idle loop of any [data-motion-hover="<pet id>"] element while it is hovered or keyboard
 * focused. Touch input and reduced-motion preferences keep the static art.
 */
export const bindHoverMotion = () => {
  const hovers = new WeakMap<Element, HoverMotion>();

  const sync = async (element: HTMLElement, motion: HoverMotion) => {
    if (motion.hover || motion.focus) {
      if (await motion.player.play()) {
        if (motion.hover || motion.focus) element.classList.add("is-motion-active");
      }
    } else {
      motion.player.pause();
      element.classList.remove("is-motion-active");
    }
  };

  const update = (target: EventTarget | null, related: EventTarget | null, key: "hover" | "focus", value: boolean) => {
    const element = target instanceof Element ? target.closest<HTMLElement>("[data-motion-hover]") : null;
    if (!element || (related instanceof Node && element.contains(related)) || prefersReducedMotion()) return;
    const layer = element.querySelector<HTMLElement>("[data-motion-layer]");
    const petId = element.dataset.motionHover;
    if (!layer || !petId) return;
    let motion = hovers.get(element);
    if (!motion) {
      motion = { player: new MotionPlayer(layer, petId, [{ state: "idle" }]), hover: false, focus: false };
      hovers.set(element, motion);
    }
    motion[key] = value;
    void sync(element, motion);
  };

  document.addEventListener("pointerover", (event) => {
    if (event.pointerType !== "touch") update(event.target, event.relatedTarget, "hover", true);
  });
  document.addEventListener("pointerout", (event) => update(event.target, event.relatedTarget, "hover", false));
  document.addEventListener("focusin", (event) => {
    if (event.target instanceof Element && event.target.matches(":focus-visible")) update(event.target, event.relatedTarget, "focus", true);
  });
  document.addEventListener("focusout", (event) => update(event.target, event.relatedTarget, "focus", false));
};
