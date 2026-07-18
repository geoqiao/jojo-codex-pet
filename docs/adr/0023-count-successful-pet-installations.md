---
status: superseded by ADR-0024
---

# Count successful pet installations

After the Official Installer has verified and written a pet package successfully, it will send one event containing only the Catalog Pet ID and a fresh random event ID used to suppress retries from that installation attempt. The application database will retain daily and lifetime aggregate counts, while short-lived event receipts expire automatically. It will not collect operating-system details, installer entry points, versions, failure data, account names, file paths, hostnames, persistent device identifiers, free-form errors, raw IP addresses, or raw User-Agent values. The counter measures installations rather than unique people, and collection failure will never fail or delay the installation itself; the user's participation choice is recorded separately.
