# Acceptance tests

- `mk test-http`: exact asset bytes, response headers, HEAD, unknown paths, traversal attempt and rejected POST.
- `mk test`: same HTTP checks plus migrated canonical PoC Chromium tests for genuine display/interaction, protected spans, advanced keyboard/clipboard/IME and bounded viewport. Test driver injects actual ephemeral HTTP URL rather than old repository layout. Browser dependencies are explicit dev-only.
- Pending: real m-os mk invocation, full browser acceptance, standalone installed pkg resolution, A/B local-vs-release mutation, explicit update, Electron and m-js-core integration. Never equate syntax checks or source commits with these results.

## Source integration workflow

`.github/workflows/source-integration.yml` exercises actual managed mk/jsc and Node, the current m-mk source revision, real Chromium/Playwright and mk run against sibling checkouts at pinned revisions. Hosted CI does not replace operator reference-machine or installed TextEdit package acceptance. Local execution of the exact published server and HTTP test runner on Node 22.16.0 with synthetic assets passed; Git blob identities matched published source. V8 compilation and namespace/undo checks passed using real JSC rendering logic and a virtual filesystem. No complete hosted result claimed until inspected.
