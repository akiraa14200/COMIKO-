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
