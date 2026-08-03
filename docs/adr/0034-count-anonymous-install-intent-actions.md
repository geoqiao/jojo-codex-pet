---
amends: ADR-0024
---

# Count anonymous aggregate install-intent actions

The Gallery will count two in-page actions: a command copy only after the browser clipboard write succeeds, and a click on the official Codex install deep link. These events measure install intent, not completed or unique installations, and amend only ADR-0024's prohibition on in-page behavior tracking; installers still send no completion event.

A separate same-origin endpoint stores daily aggregates limited to the server-generated day, allowlisted event type, released Catalog Pet ID, install method, locale, canonical landing path, count, and update time. It uses a private JSON file outside `public_html` and never stores cookies, sessions, event or visitor IDs, IP addresses, User-Agent values, referrers, query strings, free text, account names, hostnames, or file paths. Endpoint failure is silent and never delays or blocks Copy, Codex deep-link navigation, or static page use.
