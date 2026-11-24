# Acceptance tests

- `mk test-http`: exact asset bytes, response headers, HEAD, unknown paths, traversal attempt and rejected POST.
- `mk test`: same HTTP checks plus migrated canonical PoC Chromium tests for genuine display/interaction, protected spans, advanced keyboard/clipboard/IME and bounded viewport. Test driver injects actual ephemeral HTTP URL rather than old repository layout. Browser dependencies are explicit dev-only.
- Pending: real m-os mk invocation, full browser acceptance, standalone installed pkg resolution, A/B local-vs-release mutation, explicit update, Electron and m-js-core integration. Never equate syntax checks or source commits with these results.
