# Change Log

## [2.0.0] - 2026-04-02

### Breaking Changes

The `Show Image Metadata` command in the Explorer right-click menu has been moved from the top (`navigation` group) to the bottom group.

* [2c6f940](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/2c6f94086bbcf71c662ffdabe4671d4d5e55472f) chore: move context menu command to bottom group

### New Features

Added `openAsDefaultEditor` setting. When enabled, clicking an image file in the Explorer opens the Image Metadata Viewer instead of the built-in image viewer. Also added support for Windows on ARM (`win32-arm64`) platform.

* [a3aacb7](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/a3aacb7e1fd79235b9c30d34e631202bfb42319b) feat: opening image metadata on click
* [5e7cc38](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/5e7cc38247eb3b2c961be73885cf330cab8e6991) feat: supports `win32-arm64` target

### Performances

* [8e96d43](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/8e96d431bbd33c2f00506f20d665822cbd024b60) perf: reduce package size (exclude sharp C++ source from VSIX package)
* [ddfa718](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/ddfa71892fbf31260001cf2d5112c60683d01c70) refactor: replace `onStartupFinished` with explicit activation events

### Misc

* [c8cfb03](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/c8cfb039e6c2d91216f9197fdfc2e63ebd138b35) chore: update biome schema version and fix lint script flag
* [6802439](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/68024395fabaaec1851295e508c17afced72ab5d) docs: update `README.md`
* [ca64220](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/ca64220f582f5d1f18b376644dc24d65998e2c7f) fix(ci): add node-version and remove unnecessary matrix strategy
* [cc8b9db](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/cc8b9dbc21b0b3cf8087a7ecc6d0a3e737247285) refactor: extract custom editor classes into separate module and narrow activation events
* [19d837e](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/19d837e57611d65e5dc1366277e6c92b77688182) ci: install npm `11.11.0` in CI to satisfy engines requirement
* [404df99](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/404df99ced92fd64e4f0a6292ebf8c5c9f620c53) ci: install npm `11.11.0` in CI to satisfy engines requirement
* [06c412f](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/06c412f6971ac73ba15aceb7c341d6902718a410) fix(tsconfig): add mocha and node types to resolve test compilation errors
* [bc44201](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/bc44201d71b71623b9d9b3a47da8a8140390242f) chore: add `.npmrc`
* [193c0c3](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/193c0c3ca4d8aaa00dc707372122c8d0e5413799) chore(deps): update `typescript`
* [eae1224](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/eae12243e0829cf49321d5470ede74847f2aab8c) ci: avoid using `npx` in ci
* [bc35395](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/bc35395f6145100efefd3bcd8db9b1a6bf00b6d6) chore: update `.vscodeignore`
* [21438db](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/21438dba7138845beac3a8f5cf58c6c7dac62843) ci: unify build and package jobs into a single per-platform matrix job
* [bb4b692](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/bb4b69299ccd65f8b0f552fbe0d9095db6e43006) ci: add least-privilege permissions to CI, lint, and publish workflows
* [2722fab](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/2722fabcf05c4e6d8a1f6f4ad130c0da208d33e2) ci: pinned versions
* [7388d7c](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/7388d7c4e6685e9def7afe9627e5dbc541990657) chore(ai): add `.claude`
* [a42ba6a](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/a42ba6ab01b493193b85134f7d75fe8f7703377a) docs(ai): add `AGENTS.md`
* [d3da1cf](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/d3da1cf07e8bf5d851e676f25828ce6cf8e8cf98) chore(deps): bump dependencies
* [a04f1ee](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/commit/a04f1ee15797f045465fabc2df216a393908af3b) docs: fix typo

## [1.0.1] - 2025-07-31

Initial release.
