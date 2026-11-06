# Comicko

Comicko is an Android manga and manhwa reader build based on the open-source [Yōkai](https://github.com/null2264/yokai) project, itself a fork in the Mihon/Tachiyomi family.

## Features inherited from Yōkai

- Manga library and chapter tracking
- Online sources through compatible extensions/repositories
- Configurable reading modes, including webtoon-style reading
- Offline reading of downloaded chapters and local manga
- Categories, library updates, backups, and reading progress
- Tracker integrations supported by upstream

## Build an APK

Open **Actions → Build Comicko APK** in this repository. The workflow checks out the upstream Yōkai source, applies the Comicko application ID and display name, builds the standard debug variant, and uploads the APK as the `comicko-debug-apk` artifact.

The source is fetched from upstream during the build; this repository currently contains the build workflow rather than a full copy of all Yōkai source files.

## Extensions and content

Comicko does not host manga chapters. Available content depends on the sources/extensions the user chooses and the rights those providers have to distribute it. Extension compatibility depends on the upstream reader version.

## Credits and license

Yōkai is licensed under Apache-2.0. This project must retain the upstream license and attribution notices when redistributing source or binaries. See the [Yōkai source repository](https://github.com/null2264/yokai) and its `LICENSE` file for the applicable terms. Third-party dependencies and extensions retain their own licenses.


## Strawhat Pirate web build

The `strawhat-pirate-web` branch also contains an independent, responsive browser-based starter for the reader:

- Responsive desktop and mobile layout
- Local image-page import and in-browser reading
- Left-to-right, right-to-left, and vertical reading modes
- Page navigation, keyboard controls, and fit-to-screen setting
- Personal library status labels and reading-session history

### Run locally

Open `index.html` in a modern browser, or serve this branch with any static web host. No package installation or build step is required.

### Current web limitations

This is a first web implementation, not a browser port of the Android extension runtime. Android/Kotlin extensions cannot be executed directly in a browser. The web build currently reads user-selected image files locally; it does not yet connect to online manga sources, sync the Android library, or persist the selected page-image files after the browser tab is closed. Those capabilities need a separate web-compatible source/API and storage integration.
