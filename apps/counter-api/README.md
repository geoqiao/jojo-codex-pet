# Aggregate pet-page view counter

This is a deliberately small same-origin PHP/MySQL endpoint for public directional page totals.

Application data contains only:

- stable Catalog Pet ID
- aggregate view count
- database update time

The endpoint does not create cookies, identifiers, sessions, device profiles, unique-visitor estimates, or installation events.

Deployment requires a non-publicly-committed `config.php` based on `config.example.php` and the generated `catalog-ids.json` beside `views.php`. The endpoint creates the table from `schema.sql` idempotently on its first successful database request.
