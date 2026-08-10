// api/tmdb.js — Vercel serverless proxy for The Movie Database (TMDB).
//
// Holds the TMDB credential SERVER-SIDE so every visitor gets real posters
// and metadata without pasting their own key. The client (js/tmdb.js) calls
// this endpoint as:  /api/tmdb?path=/movie/popular&page=1
//
// ── Setup (one-time) ────────────────────────────────────────────────
// In your Vercel project → Settings → Environment Variables, add ONE of:
//   TMDB_ACCESS_TOKEN   a v4 "Read Access Token" (recommended; starts "ey…")
//   TMDB_API_KEY        a v3 API key
// (get either free at https://www.themoviedb.org/settings/api), then redeploy.
// Until one is set, this returns 503 and the app falls back to its bundled
// sample titles — nothing breaks.

const TMDB_BASE = 'https://api.themoviedb.org/3';

module.exports = async (req, res) => {
  const token = process.env.TMDB_ACCESS_TOKEN || '';
  const apiKey = process.env.TMDB_API_KEY || '';
  if (!token && !apiKey) {
    res.status(503).json({ error: 'TMDB not configured on the server' });
    return;
  }

  // Only allow safe, read-only TMDB paths (no arbitrary hosts/verbs).
  const path = String((req.query && req.query.path) || '');
  if (!/^\/[A-Za-z0-9/_-]+$/.test(path)) {
    res.status(400).json({ error: 'invalid path' });
    return;
  }

  const url = new URL(TMDB_BASE + path);
  for (const [k, v] of Object.entries(req.query || {})) {
    if (k === 'path') continue;
    url.searchParams.set(k, Array.isArray(v) ? v[0] : String(v));
  }

  const headers = { accept: 'application/json' };
  if (token) headers.authorization = `Bearer ${token}`;
  else url.searchParams.set('api_key', apiKey);

  try {
    const upstream = await fetch(url.toString(), { headers });
    const body = await upstream.text();
    // TMDB data isn't time-sensitive — cache at the edge to cut API calls.
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(upstream.status).send(body);
  } catch (e) {
    res.status(502).json({ error: 'upstream request failed' });
  }
};
