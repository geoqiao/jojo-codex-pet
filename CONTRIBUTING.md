# Contributing

Thank you for your interest in JoJo Codex Pet.

The repository and its community pet-submission gate are public. Wave 1 (Parts 1–3) passed animation, package-installation, and gallery QA on 2026-07-21, so pull requests may now include Project Code improvements or JoJo-only Expansion Pets.

Before opening any pull request, run:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

`pnpm check` validates the bilingual 36-pet catalog and every packaged atlas. Packaged pets must be 1536×2288 WebP files with alpha, the complete Codex V2 cell contract, populated required cells, and fully transparent unused cells.

Pet submissions must:

- use a stable Part-scoped ID
- represent exactly one character or one Stand
- satisfy the complete Codex pet v2 contract
- include deterministic validation and visual QA artifacts
- comply with the split-license boundary and Fan Asset Notice

The pull-request template remains authoritative for the currently open submission types. Pet-package review requires the full `hatch-pet` direction-blind and final visual QA evidence.
