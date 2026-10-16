# NebulaCraft Launcher

A standalone, unofficial NebulaHub launcher for the **1.20.4-labeled EaglercraftZ build** in this repository. It has one available game version and an original launcher-style interface. It is not affiliated with Mojang or Microsoft and does not offer Microsoft account login.

The original web-port folders remain intact. This project publishes only `1.20.4`, not any of the other versions.

## Build and preview

Use Node.js 22 or newer (Netlify pins 24.21.0). No package installation is required.

```sh
npm run build
npm run preview
```

Open http://localhost:8001. Production output: `dist/`. Deploy that directory to Netlify with the supplied `netlify.toml`. The build copies `classes.js`, `assets.epk` and `favicon.png` byte-for-byte and rewrites the game HTML to use local assets. `build-manifest.json` records their SHA-256 hashes. The largest file is approximately 24 MB.

The standalone launcher lives at `/`; the direct game is at `/game/`. Game assets load only after Play. The app integrated into NebulaHub embeds the same standalone launcher, without credentialless mode. Browser privacy policies can partition storage between embedded and standalone use, so export/import worlds through the game's menus when moving between them. Worlds are not synced to Account Center or `.hub` files.

## Upstream build limitations

The supplied assets report version `u4`; the supplied JavaScript expects `u4 §5(Legacy)`. The runtime continues after reporting the mismatch. Some custom textures also report missing files (including raw iron/gold and some glazed terracotta). These originate in the supplied build, not missing deployment files. The original compiled files are preserved rather than suppressing checks or fabricating replacement textures.

The game identifies itself as 1.20.4, but contains a legacy Eaglercraft/MCP engine and resource-pack modifications. This distribution does not assert feature parity with official Minecraft Java 1.20.4. Multiplayer needs compatible external servers/relays; the original relay list is preserved, while the long preconfigured third-party server/ad list is removed from the generated page. Add a server yourself in the game. Other language files are not included in the repository.

## Hosting and NebulaHub integration

Live site: https://nebulacraft-shinobiscripter.netlify.app/

The `nebula.minecraft` app in the NebulaOS repository embeds this origin. COEP `require-corp` and CORP `cross-origin` allow nesting inside NebulaHub's isolated desktop without making the frame credentialless. CSP permits only this site, the production NebulaHub origin and localhost:8000 to frame it. Changing the desktop domain requires updating that allowlist.

Return to launcher asks for confirmation. Save and quit from the game before closing its window or refreshing. Fullscreen uses the browser fullscreen API and can be exited with Escape. The launcher does not download any unrelated versions.

## Attribution and licensing

Original launcher code and SVG artwork added in `site/` and `scripts/` are AGPL-3.0-only; see `LICENSE-LAUNCHER.txt`. That license does **not** relicense the supplied compiled game or its resources. Their embedded original credits and notices remain intact. The repository did not provide a separate game license or complete corresponding game source tree.

The supplied game credits EaglercraftZ-Devs and EaglercraftX/lax1dude and contributors. Minecraft and its resources are attributed to Mojang/Microsoft. Source repository: https://github.com/Shinobiscripter/minecraft (original files from commit `bfdd12b190c5d5da1c0a70b9053ecd9b8d44ca18`). Preserve notices and review upstream distribution terms when redistributing those third-party assets.

## All repository editions

The launcher now offers 1.20.4, 1.20.6, 26.2, 1.12.2, 1.8.8, 1.5.2, alpha 1.2.6, beta 1.3, beta 1.7.3, indev and Pocket Edition. Build with `npm run build`; publish `dist`. The launcher loads only the selected edition after Play. Existing `/game/` links and 1.20.4 storage origin are preserved.

The build rewrites external asset loader URLs to local files. Compressed JS and split HTML stay in their supplied formats; the browser decompresses/assembles them. No individual asset exceeds 50 MiB. Large editions still use substantial client memory. Modern Chromium with WebAssembly GC is needed for the WASM-GC builds. The shared loader's promotional server injection is omitted from the generated site; the original source remains unchanged. Pocket Edition cache cleanup is restricted to its own cache prefix.

These are community-supplied build labels, not verified official version parity. Back up worlds before switching versions: some engines can share browser databases. External multiplayer servers and relays are outside this deployment. Original game credits remain; the launcher AGPL license does not grant rights to third-party game assets. Review redistribution rights before wider distribution.
