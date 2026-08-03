# Aggregate page-view and install-intent counters

These are deliberately small same-origin PHP endpoints for public directional totals.

`views.php` keeps aggregate canonical pet-page views. Its private JSON store contains only:

- stable Catalog Pet ID
- aggregate view count
- update time

`actions.php` keeps anonymous daily aggregates for two install-intent actions: a successful command copy and an `Open in Codex` click. Its separate private JSON store contains only:

- server-generated day
- allowlisted event type
- released Catalog Pet ID
- allowlisted method and locale
- allowlisted canonical landing path
- aggregate count and update time

Neither endpoint creates cookies, identifiers, sessions, device profiles, or unique-visitor estimates. The action endpoint does not record or infer completed installations, and it stores no IP address, User-Agent, referrer, query string, hostname, account name, free text, or local path. Counter failures never block the static site or its install actions.

On Hostinger, both endpoints derive the account home from the document path and keep `.jojo-codex-pet-views.json` and `.jojo-codex-pet-actions.json` outside `public_html`. Each store has its own lock file and atomic replacement path. Set `JOJO_COUNTER_STORAGE_DIR` or `JOJO_ACTIONS_STORAGE_DIR` to override the corresponding storage directory for local testing. The generated `catalog-ids.json` and `released-pet-ids.json` files must sit beside the endpoints.

Run the real local PHP action-contract test with:

```bash
pnpm counter:test
```
