// tmdb.js — The Movie Database integration
// Browser-only. Stores user's API key in localStorage.

(function () {
  const KEY_STORAGE = 'matchdoo.tmdb_key';
  const BASE = 'https://api.themoviedb.org/3';
  const IMG  = 'https://image.tmdb.org/t/p';

  // TMDB genre id → name
  const GENRES = {
    28: 'Action',     12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime',      99: 'Documentary', 18: 'Drama',   10751: 'Family',
    14: 'Fantasy',    36: 'History',   27: 'Horror',    10402: 'Music',
    9648: 'Mystery',  10749: 'Romance', 878: 'Sci-Fi',  10770: 'TV Movie',
    53: 'Thriller',   10752: 'War',    37: 'Western',
    // TV-specific genre ids
    10759: 'Adventure', 10762: 'Family', 10763: 'Documentary', 10764: 'Reality',
    10765: 'Sci-Fi',    10766: 'Drama',  10767: 'Talk',        10768: 'War',
  };

  // Watch-provider TMDB ids for the services we feature.
  const PROVIDER_IDS = { 'Netflix': 8, 'Max': 1899, 'Apple TV+': 350, 'Disney+': 337 };

  // Map TMDB provider names → our short-chip style; fall back to first letter.
  const PROVIDER_ALIASES = {
    'Netflix': 'Netflix',
    'Amazon Prime Video': 'Prime',
    'Hulu': 'Hulu',
    'Max': 'Max',
    'HBO Max': 'Max',
    'Apple TV Plus': 'Apple TV+',
    'Apple TV+': 'Apple TV+',
    'Disney Plus': 'Disney+',
    'Disney+': 'Disney+',
    'Mubi': 'MUBI',
  };

  // Normalize a raw TMDB provider name: strip channel add-on suffixes
  // (e.g. "HBO Max Amazon Channel" → "Max") then alias to our chip name.
  function cleanProvider(name) {
    if (!name) return name;
    const base = name.replace(/\s+(Amazon|Apple TV|Roku Premium|Prime Video)?\s*Channel$/i, '').trim();
    return PROVIDER_ALIASES[base] || PROVIDER_ALIASES[name] || base;
  }

  // Tone palette to colorize fallback backgrounds based on title hash
  const TONES = [
    { bg: '#1a1410', fg: '#e8c994' }, { bg: '#0a1628', fg: '#e6f0ff' },
    { bg: '#2a1f15', fg: '#f4d089' }, { bg: '#101418', fg: '#86A6DD' },
    { bg: '#3a1a12', fg: '#ffb88c' }, { bg: '#13231a', fg: '#a8c9ad' },
    { bg: '#1c1738', fg: '#d4c4ff' }, { bg: '#2b1230', fg: '#ffc4d6' },
    { bg: '#0d1418', fg: '#c8d6e0' }, { bg: '#28101e', fg: '#ffb3c1' },
    { bg: '#1f1a0e', fg: '#e8d18a' }, { bg: '#1a1f1a', fg: '#c9e0c1' },
    { bg: '#0e1f24', fg: '#9ed5e0' }, { bg: '#161028', fg: '#93A8E8' },
  ];

  function hashTone(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return TONES[Math.abs(h) % TONES.length];
  }

  function getKey() {
    try { return localStorage.getItem(KEY_STORAGE) || ''; } catch { return ''; }
  }
  function setKey(k) {
    try { localStorage.setItem(KEY_STORAGE, (k || '').trim()); } catch {}
  }
  function clearKey() {
    try { localStorage.removeItem(KEY_STORAGE); } catch {}
  }

  async function call(path, params = {}) {
    const key = getKey();
    if (!key) throw new Error('TMDB key missing');
    const url = new URL(BASE + path);
    // Support both v3 api_key and v4 read-access tokens (which start with 'ey')
    const isV4Token = key.startsWith('ey') && key.length > 60;
    if (!isV4Token) url.searchParams.set('api_key', key);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    const headers = { accept: 'application/json' };
    if (isV4Token) headers.authorization = `Bearer ${key}`;
    const r = await fetch(url, { headers });
    if (!r.ok) {
      let msg = `HTTP ${r.status}`;
      try { const e = await r.json(); if (e?.status_message) msg = e.status_message; } catch {}
      const err = new Error(msg);
      err.status = r.status;
      throw err;
    }
    return r.json();
  }

  // Normalize a /discover or /popular result into our movie shape.
  // kind: 'movie' | 'tv' — TV items become type:'series'.
  function normalize(raw, kind = 'movie') {
    const isTV = kind === 'tv';
    const title = raw.title || raw.name || 'Untitled';
    const tone = hashTone(title || String(raw.id));
    const year = ((isTV ? raw.first_air_date : raw.release_date) || '').slice(0, 4);
    const genres = Array.from(new Set((raw.genre_ids || []).map((id) => GENRES[id]).filter(Boolean)));
    const synopsis = raw.overview || '';
    const tag = (synopsis.split('. ')[0] || '').slice(0, 90) +
                (synopsis.split('. ')[0] && synopsis.split('. ')[0].length > 88 ? '…' : '');
    return {
      id: (isTV ? 'tv' : 't') + raw.id,
      tmdbId: raw.id,
      mediaType: isTV ? 'tv' : 'movie',
      type: isTV ? 'series' : 'movie',
      seasons: isTV ? 1 : undefined,       // refined on detail fetch
      title,
      year: year ? Number(year) : '—',
      runtime: isTV ? 45 : 120,            // list endpoints omit runtime; fill on detail fetch
      genres: genres.length ? genres : (isTV ? ['Series'] : ['Film']),
      rt: Math.round((raw.vote_average || 0) * 10),
      imdb: Number((raw.vote_average || 0).toFixed(1)),
      where: [],                           // resolved lazily (or preset by provider discover)
      bg: tone.bg, fg: tone.fg,
      tag: tag || '',
      synopsis,
      posterPath: raw.poster_path || null,
      backdropPath: raw.backdrop_path || null,
      posterUrl: raw.poster_path ? `${IMG}/w500${raw.poster_path}` : null,
      backdropUrl: raw.backdrop_path ? `${IMG}/w1280${raw.backdrop_path}` : null,
      _detailFetched: false,
    };
  }

  async function popular(page = 1) {
    const data = await call('/movie/popular', { page });
    return (data.results || []).map((r) => normalize(r, 'movie'));
  }

  async function discover({ page = 1, genres = [], minVotes = 200 } = {}) {
    const params = {
      page,
      sort_by: 'popularity.desc',
      include_adult: 'false',
      'vote_count.gte': minVotes,
    };
    if (genres.length) params.with_genres = genres.join(',');
    const data = await call('/discover/movie', params);
    return (data.results || []).map((r) => normalize(r, 'movie'));
  }

  // Titles available on a given service (movie or tv), pre-tagged with `where`.
  async function byProvider(name, kind, region = 'US') {
    const pid = PROVIDER_IDS[name];
    if (!pid) return [];
    const data = await call(`/discover/${kind}`, {
      page: 1,
      sort_by: 'popularity.desc',
      watch_region: region,
      with_watch_providers: pid,
      with_watch_monetization_types: 'flatrate',
      'vote_count.gte': 50,
      include_adult: 'false',
    }).catch(() => ({ results: [] }));
    return (data.results || []).map((r) => {
      const m = normalize(r, kind === 'tv' ? 'tv' : 'movie');
      m.where = [name];          // known from the query
      return m;
    });
  }

  // The full catalog we load into the app: popular movies + popular TV,
  // plus movies & series from Netflix / Max / Apple TV+ / Disney+.
  async function library({ region = 'US' } = {}) {
    const tasks = [
      call('/movie/popular', { page: 1 })
        .then((d) => (d.results || []).map((r) => normalize(r, 'movie'))).catch(() => []),
      call('/tv/popular', { page: 1 })
        .then((d) => (d.results || []).map((r) => normalize(r, 'tv'))).catch(() => []),
    ];
    for (const name of Object.keys(PROVIDER_IDS)) {
      tasks.push(byProvider(name, 'movie', region));
      tasks.push(byProvider(name, 'tv', region));
    }
    const lists = await Promise.all(tasks);
    // merge + dedupe by id, and drop non-narrative noise (talk/reality/news)
    // and anything without poster art so the deck stays clean.
    const NOISE = new Set(['Talk', 'Reality', 'News']);
    const seen = new Set();
    const out = [];
    for (const list of lists) {
      for (const m of list) {
        if (seen.has(m.id)) continue;
        if (!m.posterUrl) continue;
        if (m.genres.length && m.genres.every((g) => NOISE.has(g))) continue;
        seen.add(m.id); out.push(m);
      }
    }
    // light shuffle so services/types interleave in the deck
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  // Enrich a movie with runtime + streaming providers (one extra round-trip each)
  async function enrich(movie, region = 'US') {
    if (!movie?.tmdbId || movie._detailFetched) return movie;
    const seg = movie.mediaType === 'tv' ? 'tv' : 'movie';
    try {
      const [detail, providers] = await Promise.all([
        call(`/${seg}/${movie.tmdbId}`),
        call(`/${seg}/${movie.tmdbId}/watch/providers`).catch(() => null),
      ]);
      const flat = providers?.results?.[region]?.flatrate || [];
      const where = Array.from(new Set(
        flat.map((p) => cleanProvider(p.provider_name))
      )).slice(0, 4);
      if (seg === 'tv') {
        movie.seasons = detail.number_of_seasons || movie.seasons || 1;
        movie.episodes = detail.number_of_episodes || movie.episodes;
        movie.runtime = (detail.episode_run_time && detail.episode_run_time[0]) || movie.runtime;
      } else {
        movie.runtime = detail.runtime || movie.runtime;
      }
      // don't clobber a provider we already know (from discover) with an empty result
      if (where.length) movie.where = where;
      movie.synopsis = detail.overview || movie.synopsis;
      movie._detailFetched = true;
    } catch (e) {
      // soft-fail
      movie._detailFetched = true;
    }
    return movie;
  }

  window.TMDB = {
    getKey, setKey, clearKey,
    popular, discover, byProvider, library, enrich,
    GENRES,
    posterUrl: (path, size = 'w500') => path ? `${IMG}/${size}${path}` : null,
    backdropUrl: (path, size = 'w1280') => path ? `${IMG}/${size}${path}` : null,
  };
})();
