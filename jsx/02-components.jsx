// components.jsx — Shared atoms for Match Doo
// Poster, Avatar, Icon, ServiceChip, etc.

// ─── Icons ──────────────────────────────────────────────────────────
function Icon({ name, size = 20, color = 'currentColor', stroke = 1.6 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    heart:    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
    x:        <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>,
    eye:      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    star:     <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>,
    starf:    <path fill={color} stroke="none" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>,
    play:     <path fill={color} stroke="none" d="M8 5v14l11-7z"/>,
    cards:    <><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18"/></>,
    users:    <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    user:     <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    plus:     <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    chev:     <path d="M9 18l6-6-6-6"/>,
    chevdn:   <path d="M6 9l6 6 6-6"/>,
    chevup:   <path d="M18 15l-6-6-6 6"/>,
    chevl:    <path d="M15 18l-6-6 6-6"/>,
    search:   <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></>,
    qr:       <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3h-3z"/><path d="M20.5 14v3M14 20.5h3M19 19.5h2.5"/></>,
    phone:    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>,
    mail:     <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    clock:    <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    check:    <path d="M20 6L9 17l-5-5"/>,
    arrow:    <><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></>,
    undo:     <><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-4"/></>,
    bell:     <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    sparkle:  <path fill={color} stroke="none" d="M12 2l1.8 6.5L20 10l-6.2 1.5L12 18l-1.8-6.5L4 10l6.2-1.5L12 2z"/>,
    bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>,
    link:     <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
    copy:     <><rect x="9" y="9" width="13" height="13" rx="2.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    share:    <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98"/><path d="M15.41 6.51l-6.82 3.98"/></>,
    contacts: <><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></>,
    film:     <><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/></>,
    home:     <><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></>,
    sofa:     <><path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><rect x="3" y="11" width="18" height="6.5" rx="2.4"/><path d="M3 14.5h18"/><path d="M6.5 17.5v2.2M17.5 17.5v2.2"/></>,
  };
  return <svg {...p}>{paths[name]}</svg>;
}

// ─── IconBadge ──────────────────────────────────────────────────────
// Circular tonal icon badge: soft radial glow + ring + icon, in the
// "system icon" style — one accent hue, glass-tinted, gradient glow.
function IconBadge({ icon, size = 40, tone = '#FD8973', style = {} }) {
  const rgba = (a) => {
    if (typeof tone === 'string' && tone[0] === '#' && tone.length === 7) {
      const r = parseInt(tone.slice(1,3),16), g = parseInt(tone.slice(3,5),16), b = parseInt(tone.slice(5,7),16);
      return `rgba(${r},${g},${b},${a})`;
    }
    return tone;
  };
  const iconSize = Math.round(size * 0.42);
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0, ...style }}>
      <div style={{
        position:'absolute', inset:0, borderRadius:'50%',
        background:`radial-gradient(circle at 32% 26%, ${rgba(0.22)}, ${rgba(0.03)} 68%, transparent 100%)`,
      }}/>
      <div style={{
        position:'absolute', inset:0, borderRadius:'50%',
        border:`1px solid ${rgba(0.55)}`,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon name={icon} size={iconSize} color={tone} stroke={1.6}/>
      </div>
    </div>
  );
}

// ─── Poster ─────────────────────────────────────────────────────────
// Each movie gets a curated abstract poster from its bg/fg palette + an art ID.
function Poster({ movie, size = 'lg', className = '', style = {}, hideTitle = false }) {
  if (!movie) return null;
  // hash id -> art style 0..3
  const art = (parseInt(String(movie.id || '').replace(/\D/g, ''), 10) || 0) % 4;
  const realPoster = !!movie.posterUrl;
  const dims = size === 'lg' ? { w: '100%', h: '100%' }
             : size === 'md' ? { w: 120, h: 180 }
             : size === 'sm' ? { w: 64,  h: 96  }
             : { w: 44, h: 66 };
  const small = size === 'sm' || size === 'xs';
  const titleSize = size === 'lg' ? 56 : size === 'md' ? 22 : size === 'sm' ? 13 : 10;
  const meta = size === 'lg' ? 11 : 9;

  return (
    <div className={`poster ${className}`} style={{
      width: dims.w, height: dims.h, aspectRatio: '2/3',
      background: movie.bg || '#13181B', color: movie.fg || '#F0EEEB', ...style,
    }}>
      {realPoster ? (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block'}}
          onError={(e)=>{ e.currentTarget.style.display='none'; }}
        />
      ) : (
        <PosterArt art={art} fg={movie.fg || '#F0EEEB'} bg={movie.bg || '#13181B'} small={small} />
      )}

      {/* grain */}
      <div style={{
        position:'absolute', inset:0, mixBlendMode:'overlay', opacity: small ? 0.2 : (realPoster ? 0.25 : 0.55),
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='u%72l(%23n)' opacity='0.7'/%3E%3C/svg%3E")`,
      }}/>

      {/* top meta — abstract posters only */}
      {!small && !realPoster && (
        <div style={{
          position:'absolute', top: size==='lg'? 22:14, left: size==='lg'? 24:14, right: size==='lg'? 24:14,
          display:'flex', justifyContent:'space-between', alignItems:'baseline',
          fontFamily:'var(--sans)', fontSize: meta, letterSpacing:'0.18em', textTransform:'uppercase',
          opacity: 0.7,
        }}>
          <span>{movie.year}</span>
          <span>{genreLabel(movie.genres?.[0])}</span>
        </div>
      )}

      {/* title — abstract posters get a serif title; real posters skip it */}
      {!hideTitle && !realPoster && (
        <div style={{
          position:'absolute', left: small? 8: (size==='lg'? 26:16), right: small? 8: (size==='lg'? 26:16),
          bottom: small? 8 : (size==='lg'? 32 : 18),
          fontFamily:'var(--serif)', fontWeight: 400,
          fontSize: titleSize, lineHeight: 0.92, letterSpacing: '-0.01em',
        }}>
          {movie.title}
        </div>
      )}
    </div>
  );
}

// poster art styles — each is an abstract editorial element
function PosterArt({ art, fg, bg, small }) {
  const op = small ? 0.18 : 0.22;
  const s = { position:'absolute', inset:0 };
  if (art === 0) {
    // big circle (sun/moon)
    return (
      <div style={s}>
        <div style={{
          position:'absolute', left:'50%', top:'38%', transform:'translate(-50%,-50%)',
          width:'62%', aspectRatio:'1', borderRadius:'50%',
          background: fg, opacity: op,
        }}/>
      </div>
    );
  }
  if (art === 1) {
    // horizon line + tiny dot
    return (
      <div style={s}>
        <div style={{position:'absolute', left:0, right:0, top:'55%', height:0.6, background: fg, opacity: op*1.5}}/>
        <div style={{position:'absolute', left:'18%', top:'40%', width:'10%', aspectRatio:'1', borderRadius:'50%', background: fg, opacity: op*1.8}}/>
      </div>
    );
  }
  if (art === 2) {
    // vertical stripes
    return (
      <div style={{...s, display:'flex', gap:'2.5%', padding:'0 14%'}}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{flex:1, background: fg, opacity: op*(0.5 + i*0.15), marginTop:'18%', marginBottom: '38%'}}/>
        ))}
      </div>
    );
  }
  // art === 3 — concentric rings
  return (
    <div style={s}>
      {[0.85,0.6,0.35].map((r,i)=>(
        <div key={i} style={{
          position:'absolute', left:'50%', top:'42%', transform:'translate(-50%,-50%)',
          width: `${r*70}%`, aspectRatio:'1', borderRadius:'50%',
          border: `${small? 0.6:1.2}px solid ${fg}`, opacity: op*1.6,
        }}/>
      ))}
    </div>
  );
}

// ─── Avatar ─────────────────────────────────────────────────────────
// Glass-gradient profile pictures live in assets/Profiles. Each person
// gets a stable one (by id hash) unless a specific `photo` is provided.
// ─── Avatar pool — colourful gradient images (assets/Profiles) ──────
const AVATAR_POOL = Array.from({ length: 11 }, (_, i) => `assets/Profiles/avatar-${i + 1}.png`);
window.AVATAR_POOL = AVATAR_POOL;
function pickAvatar(person) {
  const key = String(person.id || person.initials || person.name || '');
  let h = 0;
  for (let i = 0; i < key.length; i++) h = ((h << 5) - h + key.charCodeAt(i)) | 0;
  return AVATAR_POOL[Math.abs(h) % AVATAR_POOL.length];
}

function Avatar({ person, size = 44, ring = false, ringColor = '#FD8973' }) {
  if (!person) return null;
  const photo = person.photo || (person.noPhoto ? null : pickAvatar(person));
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: person.tone || '#6F93E0',
      backgroundImage: photo ? `url("${photo}")` : 'none',
      backgroundSize: 'cover', backgroundPosition: 'center',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:'var(--sans)', fontWeight:700, color: photo ? 'rgba(20,24,36,0.72)' : 'var(--ink)',
      fontSize: size * 0.36, letterSpacing:'-0.02em', flexShrink:0,
      boxShadow: ring ? `0 0 0 2px ${ringColor}, 0 0 0 4.5px var(--ink)` : 'none',
      position:'relative',
    }}>
      {person.initials}
      {person.online && (
        <span style={{
          position:'absolute', right: -1, bottom: 1,
          width: size*0.26, height: size*0.26, borderRadius:'50%',
          background:'#FFBF65', border:'2px solid var(--ink)',
        }}/>
      )}
    </div>
  );
}

// ─── Service chip ───────────────────────────────────────────────────
// Maps a service name to a logo file slug in assets/logos/.
// Drop real logos there (e.g. assets/logos/netflix.svg) and they render
// automatically; until then it falls back to the tinted letter mark.
const SERVICE_SLUGS = {
  'Netflix':   'netflix',
  'Prime':     'prime-video',
  'Hulu':      'hulu',
  'Max':       'max',
  'Apple TV+': 'apple-tv',
  'Disney+':   'disney-plus',
  'MUBI':      'mubi',
  'Viu':       'viu',
  'iQIYI':     'iqiyi',
  'WeTV':      'wetv',
};

function ServiceChip({ name, size = 22 }) {
  const s = window.SERVICES[name] || { color:'#333', short: name[0] };
  const slug = SERVICE_SLUGS[name] || name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  // try svg → png → tinted-letter fallback
  const [stage, setStage] = React.useState('svg');
  const src = stage === 'svg' ? `assets/logos/${slug}.svg`
            : stage === 'png' ? `assets/logos/${slug}.png`
            : null;

  if (src) {
    // App-icon style: square 1:1 logo filling a rounded tile
    return (
      <div title={name} style={{
        width: size, height: size, borderRadius: Math.round(size * 0.26),
        overflow:'hidden', flexShrink: 0,
        boxShadow:'inset 0 0 0 0.5px rgba(var(--fg-rgb),0.16)',
      }}>
        <img
          src={src}
          alt={name}
          onError={()=> setStage(stage === 'svg' ? 'png' : 'fallback')}
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
        />
      </div>
    );
  }

  // fallback — tinted letter mark (used until a logo file exists)
  return (
    <div title={name} style={{
      width: size, height: size, borderRadius: 6,
      background: s.color, color:'#fff',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:'var(--sans)', fontSize: size*0.42, fontWeight:700, letterSpacing:'-0.02em',
      boxShadow:'inset 0 0 0 0.5px rgba(255,255,255,0.15)',
    }}>{s.short}</div>
  );
}

// ─── Tab bar (bottom nav) ───────────────────────────────────────────
function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'rooms',   icon: 'sofa',  label: window.tr ? tr('nav.rooms','Rooms') : 'Rooms' },
    { id: 'swipe',   icon: 'cards', label: 'MatchDoo', center: true },
    { id: 'profile', icon: 'user',  label: window.tr ? tr('nav.profile','Profile') : 'Profile' },
  ];
  const ACCENT = '#FD8973';

  const renderTab = (t) => {
    const on = active === t.id;
    // Center brand tab — a prominent circular logo icon (no text)
    if (t.center) {
      return (
        <button key={t.id} onClick={()=>onChange(t.id)} aria-label={t.label} style={{
          appearance:'none', cursor:'pointer', padding: 0, flexShrink: 0,
          width: 56, height: 56, borderRadius: '50%',
          border: '2px solid rgba(240,238,235,0.92)',
          backgroundImage: 'url("assets/logo-app.png?v=175")',
          backgroundSize: '116%', backgroundPosition: 'center 47%',
          backgroundRepeat: 'no-repeat', backgroundColor: '#13181B',
          boxShadow: on
            ? '0 6px 24px rgba(253,137,115,0.55), 0 0 0 3px rgba(253,137,115,0.45)'
            : '0 4px 16px rgba(0,0,0,0.40)',
          transform: on ? 'translateY(-2px) scale(1.05)' : 'scale(1)',
          transition: 'transform .28s cubic-bezier(.4,0,.2,1), box-shadow .28s ease',
        }}/>
      );
    }
    // Side tabs — always icon + text; active vs inactive shown by colour
    const col = on ? ACCENT : 'rgba(240,238,235,0.5)';
    return (
      <button key={t.id} onClick={()=>onChange(t.id)} aria-label={t.label} style={{
        appearance:'none', border:0, cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
        gap: 7, height: 46,
        padding: '0 16px', borderRadius: 999,
        background: on ? 'rgba(253,137,115,0.16)' : 'transparent',
        overflow:'hidden', flexShrink: 0, maxWidth:'100%',
        transition: 'background .3s cubic-bezier(.4,0,.2,1)',
      }}>
        <Icon name={t.icon} size={27} stroke={on ? 2.1 : 1.8} color={col}/>
        <span style={{
          whiteSpace:'nowrap',
          fontFamily:'var(--sans)', fontWeight: on ? 700 : 600, fontSize: 13, letterSpacing:'-0.01em',
          color: col,
          transition: 'color .3s ease',
        }}>{t.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* mood-tone scrim behind the bar so it reads over any content */}
      <div aria-hidden="true" style={{
        position:'absolute', left: 0, right: 0, bottom: 0, height: 160, zIndex: 39,
        pointerEvents:'none',
        background:'linear-gradient(180deg, transparent 0%, rgba(var(--bg-rgb),0.5) 42%, rgba(var(--bg-rgb),0.94) 100%)',
      }}/>
      <div data-coach="nav" style={{
        // Below the modal/sheet layer (sheets are zIndex 200) so a bottom sheet
        // covers the tab bar instead of the bar bleeding over the sheet's content;
        // still above regular screen content and the swipe deck.
        position:'absolute', left: 14, right: 14, bottom: 12, zIndex: 150,
        display:'flex', alignItems:'center',
        padding: '10px 12px',
        // dark glass + a diagonal mood gradient tint — stays a dark bar in
        // both themes, so icons/rim are kept fixed-light.
        background:'linear-gradient(135deg, rgba(253,137,115,0.20) 0%, rgba(253,137,115,0.16) 55%, rgba(19,24,27,0.30) 100%), rgba(15,20,26,0.78)',
        backdropFilter:'blur(30px) saturate(180%)',
        WebkitBackdropFilter:'blur(30px) saturate(180%)',
        borderRadius: 32,
        border:'0.5px solid rgba(240,238,235,0.16)',
        boxShadow:'0 16px 46px rgba(0,0,0,0.55), inset 0 0.5px 0 rgba(240,238,235,0.14)',
      }}>
        {/* Equal-width side rails keep the centre logo locked dead-centre
            no matter which side tab expands. */}
        <div style={{flex:1, minWidth:0, display:'flex', justifyContent:'flex-start'}}>{renderTab(tabs[0])}</div>
        {renderTab(tabs[1])}
        <div style={{flex:1, minWidth:0, display:'flex', justifyContent:'flex-end'}}>{renderTab(tabs[2])}</div>
      </div>
    </>
  );
}

// ─── Generic top bar with title + optional back ─────────────────────
function TopBar({ title, onBack, right, subtitle, large=false }) {
  return (
    <div style={{
      padding: '14px 18px 8px',
      display:'flex', alignItems:'center', justifyContent:'space-between', gap: 8,
    }}>
      <div style={{display:'flex', alignItems:'center', gap: 10, minWidth:0, flex:1}}>
        {onBack && (
          <button onClick={onBack} style={{
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.09)',
            width: 36, height: 36, borderRadius: 999,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'var(--cream)', flexShrink:0,
          }}>
            <Icon name="chevl" size={18} />
          </button>
        )}
        <div style={{minWidth:0}}>
          <div style={{
            fontFamily: large ? 'var(--serif)' : 'var(--sans)',
            fontSize: large ? 30 : 18,
            fontWeight: large ? 400 : 500,
            letterSpacing: large ? '-0.01em' : '-0.01em',
            lineHeight: 1.1,
            color:'var(--cream)',
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
          }}>{title}</div>
          {subtitle && (
            <div style={{
              fontSize:12, color:'var(--muted)', marginTop: 2,
            }}>{subtitle}</div>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}

// ─── Primary button ─────────────────────────────────────────────────
function PrimaryBtn({ children, onClick, full=false, secondary=false, disabled=false, style={} }) {
  return (
    <button onClick={disabled? undefined : onClick} className={disabled ? undefined : 'press'} style={{
      appearance:'none', border:0,
      background: secondary ? 'rgba(var(--fg-rgb),0.08)' : 'var(--cream)',
      color: secondary ? 'var(--cream)' : 'var(--ink)',
      padding:'14px 22px', borderRadius: 999,
      fontFamily:'var(--sans)', fontWeight: 500, fontSize: 15, letterSpacing:'0.01em',
      width: full? '100%' : 'auto',
      opacity: disabled? 0.4 : 1,
      transition: 'transform .12s ease, opacity .18s ease',
      ...style,
    }}>{children}</button>
  );
}

Object.assign(window, { Icon, IconBadge, Poster, PosterArt, Avatar, ServiceChip, TabBar, TopBar, PrimaryBtn });
