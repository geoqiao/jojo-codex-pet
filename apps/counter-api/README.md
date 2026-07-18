# Aggregate pet-page view counter

This is a deliberately small same-origin PHP endpoint for public directional page totals.

Its private JSON store contains only:

- stable Catalog Pet ID
- aggregate view count
- update time

The endpoint does not create cookies, identifiers, sessions, device profiles, unique-visitor estimates, or installation events.

On Hostinger, the counter derives the account home from the document path and stores `.jojo-codex-pet-views.json` outside `public_html`. File locking and atomic replacement protect concurrent increments. Set `JOJO_COUNTER_STORAGE_DIR` to override that storage directory for local testing. The generated `catalog-ids.json` must sit beside `views.php`.
