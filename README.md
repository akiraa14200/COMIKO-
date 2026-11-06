# Strawhat Pirate Web

A responsive browser-based companion for the Strawhat Pirate Android app.

## Features

- Browser-style address/search bar and embedded website view, with an option to open sites in a separate tab when embedding is refused.
- Local destination-domain guard using the domain list from the Android app.
- Anime and Manga site catalogue loaded from the same public Google Sheets CSV sources as Android.
- Saved websites and browsing history stored locally in browser storage.
- Built-in music search using public Piped API instances and YouTube embedded playback.
- Responsive desktop and mobile interface, settings, and compact now-playing controls.

## Run and deploy

This is a static HTML/CSS/JavaScript application. Open index.html through a static server or deploy this branch to Vercel, Netlify, or GitHub Pages. No package installation or build command is required.

## Important web-platform differences

This is a web companion, not a one-to-one port of Android WebView:

- Browsers do not let a normal website inspect or block every subresource request made inside a cross-origin iframe. The domain guard checks the destination URL before opening it; it is not a full network-level ad/tracker blocker.
- Many sites send X-Frame-Options or Content-Security-Policy headers that forbid embedding. Use Open in new tab for those sites.
- Cross-origin iframe history/back-forward controls are limited by browser security.
- Music search depends on public third-party Piped instances, which can be unavailable, rate-limited, or block browser CORS requests. Playback uses the YouTube IFrame Player and follows YouTube's availability and playback rules.
- Saved links and history use local browser storage. They do not sync with the Android app or another device.

The Android app's source catalogue URLs and initial domain block list were used as implementation references. No manga chapters or music are hosted by this project.
