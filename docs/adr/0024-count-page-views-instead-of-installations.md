---
storage-amended-by: ADR-0029
---

# Count aggregate page views instead of installations

The Gallery will not collect installation events. It will keep only aggregate counts of how often each canonical pet detail page is opened so maintainers and visitors can see which pets attract attention; merely rendering a card in the Gallery will not increment it. Each total will be public on its pet card in a lower corner. A small same-origin endpoint on the existing Hostinger account will atomically update a dedicated MySQL table whose application data is limited to the Catalog Pet ID, total, and update time. The counter will not use custom cookies, persistent identifiers, unique-visitor estimation, sessions, device profiles, or in-page behavior tracking, and the site will not show a consent prompt for this counter. These totals are directional rather than exact because reloads, bots, and caching may affect them; there is no dedicated feedback or takedown workflow at launch, though the public GitHub repository remains available if contact becomes necessary.
