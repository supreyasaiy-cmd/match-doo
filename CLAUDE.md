# Match Doo — project brief

A movie swipe-matching app prototype (Tinder-style, for picking a movie with
friends/partner/family). Runs entirely client-side, no build step: React +
Babel are loaded from CDN and JSX is compiled in the browser at load time.

## Running it locally

There is no build/bundle step, but it must be served over http(s), **not**
opened directly as a `file://` URL — the browser blocks the TMDB API fetch
(CORS) and some relative script loading from `file://`. From this folder:

```
python3 -m http.server 8000
```
then open `http://localhost:8000/index.html`. Any static server works
(`npx serve`, VS Code Live Server, etc.) — just needs to be http(s).

After editing any file, a normal browser refresh is enough — nothing to
rebuild.

## File structure

```
index.html          — loads everything, in a specific order (see comment inside)
styles.css           — all global CSS (design tokens, animations, base styles)
js/
  data.js             — window.MOVIES (50 seeded titles), window.FRIENDS, window.MATCHES, window.ROOMS seed
  tmdb.js             — window.TMDB module: real poster/metadata fetching from TMDB's API
  image-slot.js        — <image-slot> custom element used by the ad system (vendored, don't need to touch)
jsx/
  00-ios-device.jsx    — generic iOS 26 "Liquid Glass" device frame chrome (status bar, nav bar, etc.)
  01-tweaks-panel.jsx  — generic dev-tools Tweaks panel shell (design QA tool, not app content)
  02-components.jsx    — shared atoms: Icon, IconBadge, Poster, Avatar, TabBar, TopBar, PrimaryBtn
  03-ads.jsx           — banner/swipe/popup ad rendering + scheduling
  04-swipe.jsx         — the swipe card stack (4-direction gestures)
  05-screens.jsx       — Welcome/Auth/Onboarding/Matches/Friends/Profile/MovieDetail/MatchCelebration
  06-search-readmore.jsx — Search screen + Read More bottom sheet
  07-rooms.jsx         — Rooms (groups) screen + room detail + create-room flow
  08-add-flow.jsx      — Add-friend category picker + add-room-members sheet
  09-app.jsx           — root state machine (App component), mounts with ReactDOM.createRoot
```

## IMPORTANT gotcha: cross-file component sharing

Each `jsx/*.jsx` file is its own `<script type="text/babel">` — Babel
transpiles to strict mode, and in strict mode a top-level `function Foo(){}`
does **not** automatically become `window.Foo`. So every file that defines
components other files need to use ends with:

```js
Object.assign(window, { Foo, Bar, Baz });
```

**If you add a new shared component, you must add it to that file's
Object.assign export list**, or any other file referencing it bare (e.g.
`<Foo/>`) will throw `ReferenceError: Foo is not defined` at runtime with no
build-time warning. This bit us twice already during earlier iteration
(IconBadge, and a handful of pre-existing components in 05-screens.jsx —
RatingCard, Section, Stat, PosterRow, EmptySectionRow — were missing from the
export list and would have crashed the Search/Rooms screens).

A quick way to sanity check this after edits: grep each file for JSX tags
(`<ComponentName`) and confirm each one is either defined in that same file
or present in some file's `Object.assign(window, {...})` list.

## Design system

- **Colors** — "Midnight Sunset" mood (the hour people gather to watch a
  film): a deep-blue night sky meeting a coral + gold sunset. See `:root` in
  styles.css. Midnight inks `--ink #13181B` (Neverything), `--ink-2 #1B2530`,
  `--ink-3 #26333F`, over `--page-bg #0F141A`. Accents: `--red #FD8973`
  (Miami Coral, primary/like), `--gold #FFBF65` (Sea Buckthorn),
  `--blue #6F93E0` (with deep Ateneo Blue `#003A6C` used for the ambient
  night-sky washes/gradients), `--green #8FB4E6` (a soft sky blue — the palette
  has no green, so the "positive" role is a cool tone). Neutrals:
  `--cream #F0EEEB` (Magical Moonlight), `--cream-2 #CCD5DA` (Polar Drift).
  Semantic split to avoid collisions: SEEN (swipe-down) and series use blue,
  while READ MORE (swipe-up) and movies use gold. The mood's fullest
  expression is the `LiquidGlassBG` component in 05-screens.jsx (animated
  blurred blobs: a dominant deep-blue night blob upper-left, a coral sun glow
  upper-right, gold near the horizon) plus the blue-dominant `body` gradient
  in styles.css. (Legacy note: earlier iterations were an all-warm "On Fire"
  orange theme and, before that, navy+coral+periwinkle.)
- **Typography**: single family, `Plus Jakarta Sans` (Google Fonts, free/OFL),
  loaded via `<link>` in index.html, referenced everywhere through the CSS
  vars `--serif` and `--sans` (both point to the same family — the "serif"
  var name is legacy from an earlier Instrument Serif pairing, kept so
  components didn't need touching when the font changed).
- **Icons**: `Icon` component (02-components.jsx) is a small hand-drawn SVG
  icon set keyed by name, default stroke 1.6 (thin/elegant). `IconBadge`
  wraps an icon in a tonal gradient-ring circle (the "system icon" motif),
  used in TabBar's active tab, the add-friend category picker, and Profile
  settings rows.
- Overall style direction settled on: "Modern Elegant" — thinner strokes,
  restrained glow/badges, lighter font weights (500 not 600/700 on buttons),
  calmer/less-bouncy animation easing.

## TMDB integration (real posters)

Off by default — `window.MOVIES` (js/data.js) ships 50 real movie titles
with real metadata but **illustrated** posters (an abstract gradient-circle
art style, see `PosterArt` in 02-components.jsx), because real poster
artwork is copyrighted and can't be scraped/bundled.

If the person connects their own free TMDB API key (Profile tab →
"TMDB integration" → paste key), `js/tmdb.js` fetches TMDB's popular-movies
list and the app swaps `window.MOVIES` for real data + real poster/backdrop
URLs pointed at TMDB's own image CDN (`image.tmdb.org`) — nothing is
downloaded/bundled by us, the browser just requests them live from TMDB,
which is within TMDB's API terms for free personal use with attribution.
The connect flow is `TmdbConnectSheet` in 05-screens.jsx; the fetch/normalize
logic is `window.TMDB` in js/tmdb.js.

## Known non-issues

- The abstract "editorial poster" look (colored circle art instead of a
  photo) on movies is **intentional default behavior** when no TMDB key is
  connected — not a bug.
