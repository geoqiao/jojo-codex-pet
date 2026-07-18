# Pilot Animation Brief

## Approval Gate

The owner approved the base designs for Jotaro Kujo, Star Platinum, DIO, and The World on 2026-07-19. Their silhouettes, proportions, and locked palettes are now canonical for Pilot animation.

## State Semantics

All pets keep the standard Codex Pet V2 state meanings. Performance is customized by character, but an ability effect must never obscure the state action.

| State | Animation priority | Ability-effect policy |
| --- | --- | --- |
| `idle` | Quiet reduced-motion baseline | None |
| `running-right` / `running-left` | Clear directional gait | None; these rows are the gait identity gate |
| `waving` | Readable greeting | None |
| `jumping` | Clear takeoff, apex, and landing | Supporting attached effect only |
| `failed` | Character-specific setback | Supporting effect visibly weakens or breaks down |
| `waiting` | Patient loop without distraction | Restrained secondary effect only |
| `running` | Active Codex work | Strongest double-layer ability treatment |
| `review` | Focused inspection | Precision-oriented double-layer ability treatment |

## Character Ability Language

Every effect is opaque, hard-edged pixel art that overlaps or stays physically attached to the pet. No detached aura, scenery, floor shadow, typography, speed lines, or soft glow is allowed.

- **Jotaro Kujo:** primary seafoam focus blocks attached to the active hand or eyes; secondary antique-gold resolve ticks integrated into the coat chain or collar. Never depict Star Platinum inside Jotaro's pet rows.
- **Star Platinum:** primary cyan/coral impact blocks attached to the fists; secondary gold precision ticks attached to the eyes, shoulders, or gauntlets. No detached punch trail.
- **DIO:** primary oxblood/cyan vampiric pressure blocks attached to the eyes or active hand; secondary antique-gold fracture accents integrated into the heart ornament or cuffs. Never depict The World inside DIO's pet rows.
- **The World:** primary turquoise time-lock plates attached to the gauntlets or torso; secondary oxblood/gold clock-slice accents integrated into the armor. No detached clock face, ring, numerals, or environment-wide time-stop field.

## Review Gates

1. Approve identity and gait from `idle` plus `running-right` contact sheets.
2. Approve the nine standard-state rows and GIF previews for each Pilot pet.
3. Generate and validate all sixteen look directions.
4. Assemble the exact 1536×2288 V2 atlas, run deterministic validation, perform blind direction QA and final visual QA, then package the installable pet.
