# JoJo Codex Pet

[简体中文](docs/zh-CN/README.md)

An unofficial, non-commercial, advertisement-free collection of JoJo-themed animated companions for Codex. Each named character and Stand is an independently installable Codex pet, presented in a public Part-by-Part gallery.

> Public development status: the 36-pet headline roster is locked and the Part 3 Pilot Set is at its standard-animation approval gate. No Pilot pet is installable until its sixteen look directions, complete Codex pet v2 atlas, and QA package pass review.

## Headline scope

- Parts 1–9 protagonists and principal antagonists
- Character pets and Stand pets remain separate
- Persistent named Stand forms become separate pets
- Ability modes remain animation cues rather than separate pets
- Part 9's principal-antagonist slot stays unassigned while the story is ongoing

The approved launch roster contains 36 pets across three quality-gated waves. See [the complete roster](docs/headline-roster.md).

## Gallery

The production site will be served at [jojo-preview.easytry.shop](https://jojo-preview.easytry.shop/) until a dedicated domain replaces it. English is the default language and Simplified Chinese is available.

Primary sections:

- Gallery
- Parts
- Roster
- Install
- Contribute

The site publishes aggregate pet-page view totals. It does not collect install events, create visitor identifiers, estimate unique users, or run advertising analytics.

## Codex pet contract

This catalog accepts only Codex pet v2 packages. A released pet must include:

- an 8-column by 11-row validated spritesheet
- all nine standard animation rows
- all 16 look directions
- `spriteVersionNumber: 2`
- deterministic and visual QA evidence

The primary install action installs only the selected pet. Pair and Part installation are explicit secondary actions.

## Repository layout

```text
apps/web/          Astro gallery
apps/counter-api/  Minimal first-party aggregate view counter
packages/catalog/  Typed bilingual Part and pet catalog
docs/              Roster, decisions, and visual reviews
pets/              Released v2 packages (added only after QA)
```

## Development

Requirements: Node.js 22.12+ and pnpm 11.

```bash
pnpm install
pnpm check
pnpm build
pnpm dev
```

## Contributing

Community pet pull requests open only after Wave 1 passes its quality gate. See [CONTRIBUTING.md](CONTRIBUTING.md) for the current boundary.

## Licensing

Project Code is MIT licensed. JoJo character identities and fan materials are excluded from the MIT grant. Read [FAN-ASSET-NOTICE.md](FAN-ASSET-NOTICE.md) before using or contributing artwork.
