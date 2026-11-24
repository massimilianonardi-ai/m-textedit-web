# m-textedit-web

Web host for the shared TextEdit GUI. The service owns only HTTP asset delivery. It loads the engine and GUI artifacts from explicit directories and never copies the editor or loads m-js-core. Initial functionality is the canonical PoC 066 editor; file upload/download, authentication, multi-user service and remote filesystem access are not yet implemented. Default listener is loopback only.

## Development

Sibling checkouts: `m-js-textedit`, `m-js-textedit-gui`, `m-textedit-web`. In an initialized m shell with mk, jsc and Node.js:

```sh
mk build
mk run
# separate terminal, from the same repo
mk test-http
```

Open http://127.0.0.1:8765/ (`TEXTEDIT_PORT` overrides port). `mk build` builds the two sibling projects and checks the exact assets; no extra JS compilation is needed for this Node service. `mk test-http` runs real HTTP integration without browser dependencies. For the full `mk test`, explicitly prepare the test-only Playwright dependency (`npm install`, then `npx playwright install chromium` or choose the real reference Chromium via the existing PoC G07 environment flags). Runtime uses only Node built-ins. Browser tests exercise actual PoC GUI interactions and the real engine over HTTP; full execution remains pending.

The same `bin/server.cjs <engine-asset-dir> <gui-asset-dir> [port]` works for installed assets once the pkg library resolution contract is established. No production fallback to sibling repositories is permitted. Initial pkg release and installation are pending.

See [architecture](docs/architecture.md), [tests](docs/tests.md), [execution plan](docs/execution-plan.md).
