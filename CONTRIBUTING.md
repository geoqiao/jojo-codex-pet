# Contributing

Thank you for your interest in JoJo Codex Pet.

The repository is public, but community pet submissions are not open yet. The Contribution Gate opens only after Wave 1 (Parts 1–3) passes animation, package-installation, and gallery QA.

Until then, pull requests may address Project Code, accessibility, translations, documentation, or reproducible validation. Do not submit new character art or pet packages before the gate opens.

Before opening any pull request, run:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

`pnpm check` validates the bilingual 36-pet catalog and every packaged atlas. Packaged pets must be 1536×2288 WebP files with alpha, the complete Codex V2 cell contract, populated required cells, and fully transparent unused cells.

When pet submissions open, they will be JoJo-only Expansion Pets and must:

- use a stable Part-scoped ID
- represent exactly one character or one Stand
- satisfy the complete Codex pet v2 contract
- include deterministic validation and visual QA artifacts
- comply with the split-license boundary and Fan Asset Notice

The pull-request template remains authoritative for the currently open submission types. Pet-package review will additionally require the full `hatch-pet` direction-blind and final visual QA evidence after the gate opens.
