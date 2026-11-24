# Milestones

1. Extract engine and GUI into their definitive repositories, preserve public namespace and canonical PoC behavior. Validate real browser suite with local builds before deleting legacy m/text from active m-js-core. Review callers and remove all active TextEdit references; retain historical releases.
2. Define/verify installed JS library selection and dependency contract through pkg, with no copy or source fallback; release both libraries and web host. Install into clean m-os root. Verify the same HTTP/GUI behavior using installed asset roots.
3. Change one local GUI string; prove mk-driven local rebuild shows change while installed release is unchanged; publish explicit update and retest.
4. Add Electron host sharing exact GUI/engine assets; repeat mk and pkg acceptance.
5. Add direct general m-js-core use to both applications, test local and installed combinations, clean runtime without build tools.
