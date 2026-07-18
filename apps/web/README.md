# Gallery application

Astro 7 static gallery for JoJo Codex Pet. The English routes are unprefixed; Simplified Chinese routes live under `/zh-CN/`.

Run commands from the monorepo root:

```bash
pnpm dev
pnpm check
pnpm build
```

The root build exports the validated pet IDs and stages the same-origin PHP view-counter endpoint before Astro generates the production site.
