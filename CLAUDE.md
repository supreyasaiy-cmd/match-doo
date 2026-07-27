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

- **Colors** (see `:root` in styles.css): navy inks `--ink #0b0f18`,
  `--ink-2 #131a26`, `--ink-3 #1d2733`; accents `--red #E17F5C` (coral,
  primary/like), `--gold #F0AC72`, `--green #7ED9B4`, `--blue #6F93E0`;
  plus a periwinkle `#93A8E8` used ad hoc for the "friends" tone.
  Mood/tone reference was a dark navy + coral + periwinkle "liquid glass"
  wallpaper the user supplied — see the `LiquidGlassBG` component in
  05-screens.jsx (animated blurred blob background) for the fullest
  expression of it.
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
