# Match Doo

A movie swipe-matching app prototype (Tinder-style, for picking a movie with
friends / partner / family). Runs **entirely client-side** — React + Babel are
loaded from a CDN and JSX is compiled in the browser, so there is **no build
step**.

## Run locally

Must be served over http(s), not opened as a `file://` URL (the browser blocks
the TMDB fetch and relative script loading otherwise):

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy (Vercel)

This is a static site — `vercel.json` disables any build/install and serves the
repo root as-is. Import the GitHub repo in Vercel with **Framework Preset:
Other** and no build command; it just serves `index.html`.

## Real posters (optional)

Off by default: ships 50 real titles with **illustrated** posters. Add your own
free [TMDB](https://www.themoviedb.org/settings/api) API key in
Profile → *TMDB integration* to swap in real posters/metadata fetched live from
TMDB's image CDN. Nothing is bundled.

## Structure

See [`CLAUDE.md`](CLAUDE.md) for the full file-by-file breakdown.
