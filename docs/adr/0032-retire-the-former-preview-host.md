# Retire the former preview host

The former `jojo-preview.easytry.shop` test host has been removed from Hostinger together with its exact A and AAAA records. It will not be retained as a route-preserving redirect because the owner classified it as disposable test infrastructure. `https://pixelstand.pet` remains the only canonical production origin, and `www.pixelstand.pet` redirects permanently to the apex host. This supersedes the former-host retention in ADR 0025 and ADR 0030 while preserving their canonical-domain and public-indexing decisions.
