// rooms.jsx — Rooms (groups) screen + room detail + create-room flow

// ─── Seed Rooms data on first load ──────────────────────────────────
if (!window.ROOMS) {
  // A couple of demo movie-night dates so the calendar has content out of the
  // box — computed relative to today so they always read as "upcoming".
  const _isoSeed = (dt) => `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
  const _n = new Date();
  const _seedFri = new Date(_n); _seedFri.setDate(_n.getDate() + ((5 - _n.getDay() + 7) % 7 || 7)); // next Friday
  const _seedSat = new Date(_n); _seedSat.setDate(_n.getDate() + ((6 - _n.getDay() + 7) % 7 || 7)); // next Saturday
  window.ROOMS = [
    {
      id: 'r1', name: 'Sofia & me', emoji: '🌸',
      type: 'couple', members: ['f1'], lastActivity: 'Active now',
      tone: '#FF6D29', matchCount: 5, watchDate: _isoSeed(_seedSat),
      ownerId: 'me', votingDays: 2,
      filters: { services: ['Netflix','Prime','Max'], genres: ['Drama','Thriller','Sci-Fi','Romance'] },
    },
    {
      id: 'r2', name: 'Family Night', emoji: '🍿',
      type: 'family', members: ['f2','f3','f4'], lastActivity: '2h ago',
      tone: '#FDA65A', matchCount: 3, watchDate: _isoSeed(_seedFri),
      ownerId: 'me', votingDays: 3,
      filters: { services: ['Netflix','Max','Hulu'], genres: ['Drama','Sci-Fi','Adventure','Animation','Crime'] },
    },
    {
      id: 'r3', name: 'Friday Crew', emoji: '🎬',
      type: 'friends', members: ['f5','f6','f7'], lastActivity: 'Yesterday',
      tone: '#E0955E', matchCount: 11,
      ownerId: 'me', votingDays: 1,
      filters: { services: ['Netflix','Prime','Apple TV+'], genres: ['Sci-Fi','Comedy','Drama','Action','Thriller'] },
    },
    {
      id: 'r4', name: 'Owen & Mira', emoji: '✨',
      type: 'friends', members: ['f5','f6'], lastActivity: '3d ago',
      tone: '#CC8050', matchCount: 7,
      ownerId: 'me', votingDays: 2,
      filters: { services: ['Netflix','Prime'], genres: ['Drama','Sci-Fi','Comedy','Romance'] },
    },
  ];
}

const ALL_FRIENDS = () => [
  ...(window.FRIENDS.couple || []),
  ...(window.FRIENDS.family || []),
  ...(window.FRIENDS.friends || []),
];

// ─── Movie-night events ─────────────────────────────────────────────
// Gather every scheduled watch date across the app: per-room dates
// (matchdoo.roomdate.<id>, falling back to the room's seed watchDate) and
// per-movie dates (matchdoo.schedule.<id>). Returns [{date, kind, title, …}].
function collectMovieNights() {
  const out = [];
  for (const r of (window.ROOMS || [])) {
    let d = null;
    try { d = localStorage.getItem(`matchdoo.roomdate.${r.id}`); } catch {}
    if (!d) d = r.watchDate || null;
    if (d) out.push({ date: d, kind: 'room', room: r, tone: r.tone || '#FF6D29', title: r.name, sub: 'Movie night', emoji: r.emoji || '🎬' });
  }
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || k.indexOf('matchdoo.schedule.') !== 0) continue;
      const d = localStorage.getItem(k);
      if (!d) continue;
      const id = k.slice('matchdoo.schedule.'.length);
      const m = (window.MOVIES || []).find(x => x.id === id);
      out.push({ date: d, kind: 'movie', movie: m, tone: '#F0B24A', title: m ? m.title : 'A film', sub: 'Watching solo', emoji: '🎬' });
    }
  } catch {}
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

// ─── Movie-night calendar ───────────────────────────────────────────
// `bare` drops the card chrome (bg/border/padding) — used inside a sheet.
function RoomsCalendar({ onOpenRoom, bare }) {
  const WD = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
  const today = new Date();
  const todayIso = iso(today.getFullYear(), today.getMonth(), today.getDate());

  const events = collectMovieNights();
  const byDate = {};
  for (const e of events) (byDate[e.date] = byDate[e.date] || []).push(e);

  const [cur, setCur]   = React.useState({ y: today.getFullYear(), m: today.getMonth() });
  const [sel, setSel]   = React.useState(todayIso);

  const firstDow    = new Date(cur.y, cur.m, 1).getDay();
  const daysInMonth = new Date(cur.y, cur.m + 1, 0).getDate();
  const monthLabel  = new Date(cur.y, cur.m, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const shift = (delta) => setCur(({ y, m }) => {
    const d = new Date(y, m + delta, 1); return { y: d.getFullYear(), m: d.getMonth() };
  });

  const selEvents = byDate[sel] || [];
  const upcoming  = events.filter(e => e.date >= todayIso).slice(0, 3);
  const listTitle = selEvents.length
    ? new Date(sel + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
    : 'Upcoming';
  const list = selEvents.length ? selEvents : upcoming;
  const fmtRow = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={bare ? {} : {
      background:'linear-gradient(160deg, rgba(var(--fg-rgb),0.10), rgba(var(--fg-rgb),0.035))', backdropFilter:'blur(18px) saturate(150%)', WebkitBackdropFilter:'blur(18px) saturate(150%)',
      border:'0.5px solid rgba(var(--fg-rgb),0.10)',
      borderRadius: 18, padding:'14px 14px 12px', marginBottom: 14,
    }}>
      {/* header */}
      <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 12}}>
        <Icon name="calendar" size={16} color="var(--red)"/>
        <div style={{flex: 1, fontWeight: 600, fontSize: 14, letterSpacing:'-0.01em', color:'var(--cream)'}}>
          Movie nights
        </div>
        <button onClick={()=>shift(-1)} aria-label="Previous month" style={{
          appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.07)',
          width: 28, height: 28, borderRadius: 999, color:'var(--cream)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}><Icon name="chevl" size={14}/></button>
        <div style={{fontSize: 12.5, fontWeight: 600, color:'var(--cream)', minWidth: 104, textAlign:'center'}}>{monthLabel}</div>
        <button onClick={()=>shift(1)} aria-label="Next month" style={{
          appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.07)',
          width: 28, height: 28, borderRadius: 999, color:'var(--cream)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}><Icon name="chev" size={14}/></button>
      </div>

      {/* weekday labels */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap: 2, marginBottom: 2}}>
        {WD.map((w, i) => (
          <div key={i} style={{
            textAlign:'center', fontSize: 10, fontWeight: 600, color:'var(--muted-2)',
            letterSpacing:'0.04em', padding:'2px 0',
          }}>{w}</div>
        ))}
      </div>

      {/* day grid */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap: 2}}>
        {cells.map((d, i) => {
          if (d === null) return <div key={`b${i}`}/>;
          const dIso = iso(cur.y, cur.m, d);
          const evs = byDate[dIso] || [];
          const isToday = dIso === todayIso;
          const isSel = dIso === sel;
          const tones = Array.from(new Set(evs.map(e => e.tone))).slice(0, 3);
          return (
            <button key={dIso} onClick={()=>setSel(dIso)} style={{
              appearance:'none', border: isSel ? '0.5px solid var(--red)' : '0.5px solid transparent',
              background: isSel ? hexA('#FF6D29', 0.14) : 'transparent',
              height: 38, borderRadius: 10, cursor:'pointer', position:'relative',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap: 3,
            }}>
              <span style={{
                fontSize: 12.5, lineHeight: 1,
                fontWeight: isToday || evs.length ? 700 : 500,
                color: isToday ? 'var(--red)' : 'var(--cream)',
              }}>{d}</span>
              <div style={{display:'flex', gap: 2, height: 4, alignItems:'center'}}>
                {tones.map((t, j) => (
                  <span key={j} style={{width: 4, height: 4, borderRadius: 999, background: t}}/>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* event list for the selected day (or upcoming) */}
      <div style={{marginTop: 12, borderTop:'0.5px solid rgba(var(--fg-rgb),0.08)', paddingTop: 10}}>
        <div style={{
          fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase',
          color:'var(--muted)', marginBottom: 8,
        }}>{listTitle}</div>
        {list.length === 0 ? (
          <div style={{fontSize: 12.5, color:'var(--muted)', padding:'2px 2px 4px'}}>
            No movie nights scheduled — pick a date inside a room.
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap: 6}}>
            {list.map((e, i) => (
              <button key={i} onClick={()=> e.kind === 'room' && onOpenRoom && onOpenRoom(e.room)} style={{
                appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.05)',
                borderRadius: 12, padding:'8px 10px', width:'100%', textAlign:'left',
                display:'flex', alignItems:'center', gap: 10, color:'var(--cream)',
                cursor: e.kind === 'room' ? 'pointer' : 'default',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0, fontSize: 16,
                  background:`linear-gradient(135deg, ${hexA(e.tone,0.28)}, ${hexA(e.tone,0.08)})`,
                  border:`0.5px solid ${hexA(e.tone,0.32)}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>{e.emoji}</div>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 13.5, fontWeight: 600, letterSpacing:'-0.01em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{e.title}</div>
                  <div style={{fontSize: 11.5, color:'var(--muted)', marginTop: 1}}>{e.sub} · {fmtRow(e.date)}</div>
                </div>
                {e.kind === 'room' && <Icon name="chev" size={14} color="var(--muted-2)"/>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Calendar bottom sheet ──────────────────────────────────────────
function CalendarSheet({ onClose, onOpenRoom }) {
  return (
    <div className="fade-in" onClick={onClose} style={{
      position:'absolute', inset: 0, zIndex: 250,
      background:'rgba(var(--bg-rgb),0.55)',
      backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)',
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
    }}>
      <div className="rise" onClick={e=>e.stopPropagation()} style={{
        background:'var(--ink)', borderRadius:'26px 26px 0 0',
        padding:'10px 18px 26px', maxHeight:'88%', overflowY:'auto',
        boxShadow:'0 -24px 60px rgba(0,0,0,0.6)',
        border:'0.5px solid rgba(var(--fg-rgb),0.12)', borderBottom: 0,
      }}>
        {/* handle + close */}
        <div style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center', marginBottom: 12}}>
          <div style={{width: 42, height: 4, borderRadius: 2, background:'rgba(var(--fg-rgb),0.35)'}}/>
          <button onClick={onClose} aria-label="Close" style={{
            appearance:'none', border:0, position:'absolute', right: 0, top: -2,
            background:'rgba(var(--fg-rgb),0.09)', color:'var(--cream)',
            width: 32, height: 32, borderRadius: 999,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name="x" size={16}/>
          </button>
        </div>
        <RoomsCalendar bare onOpenRoom={onOpenRoom}/>
      </div>
    </div>
  );
}

// ─── Rooms list screen ──────────────────────────────────────────────
function RoomsScreen({ onOpenRoom, onCreateRoom, onAddFriend, onOpenCalendar, onNotif, notifCount = 0, onOpenAdCTA, banner }) {
  const [query, setQuery] = React.useState('');
  const [scrollY, setScrollY] = React.useState(0);
  const rooms = window.ROOMS.filter(r =>
    !query || r.name.toLowerCase().includes(query.toLowerCase())
  );
  // The sponsored ad fades out smoothly over the first ~130px of scroll.
  const adOpacity = Math.max(0, Math.min(1, 1 - scrollY / 130));

  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <TopBar
        title="Rooms" large
        subtitle="Group your people, swipe together"
        right={onNotif && (
          <button onClick={onNotif} aria-label="Notifications" style={{
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.07)',
            backdropFilter:'blur(10px) saturate(130%)', WebkitBackdropFilter:'blur(10px) saturate(130%)',
            width: 38, height: 38, borderRadius: 999, color:'var(--cream)', flexShrink: 0,
            display:'flex', alignItems:'center', justifyContent:'center', position:'relative',
          }}>
            <Icon name="bell" size={17}/>
            {notifCount > 0 && (
              <span style={{
                position:'absolute', top: 7, right: 7,
                width: 8, height: 8, borderRadius: 999,
                background:'var(--red)', border:'1.5px solid var(--ink)',
              }}/>
            )}
          </button>
        )}
      />

      {/* Pinned: primary actions (don't scroll) */}
      <div style={{padding:'2px 18px 12px', display:'flex', gap: 8}}>
        <button onClick={onCreateRoom} style={{
          appearance:'none', border:0, flex: 1,
          background:'var(--red)', color:'#fff',
          padding:'12px 14px', borderRadius: 999,
          fontFamily:'var(--sans)', fontWeight: 600, fontSize: 14,
          display:'inline-flex', alignItems:'center', justifyContent:'center', gap: 8,
          boxShadow:'0 6px 18px rgba(255,109,41,0.35)',
        }}>
          <Icon name="plus" size={16} stroke={2.4} color="#fff"/>
          Create room
        </button>
        <button onClick={onOpenCalendar} aria-label="Movie nights calendar" style={{
          appearance:'none', border:'0.5px solid rgba(var(--fg-rgb),0.18)',
          width: 48, flexShrink: 0, background:'rgba(var(--fg-rgb),0.07)', color:'var(--cream)',
          borderRadius: 999, padding: 0, lineHeight: 0,
          display:'inline-flex', alignItems:'center', justifyContent:'center',
        }}>
          <span style={{display:'flex', transform:'translateY(1px)'}}>
            <Icon name="calendar" size={19}/>
          </span>
        </button>
        <button onClick={onAddFriend} style={{
          appearance:'none', border:'0.5px solid rgba(var(--fg-rgb),0.18)',
          flex: 1, background:'rgba(var(--fg-rgb),0.07)', color:'var(--cream)',
          padding:'12px 14px', borderRadius: 999,
          fontFamily:'var(--sans)', fontWeight: 600, fontSize: 14,
          display:'inline-flex', alignItems:'center', justifyContent:'center', gap: 8,
        }}>
          <Icon name="user" size={15}/>
          Friends
        </button>
      </div>

      {banner && <div style={{padding:'0 18px 12px'}}>{banner}</div>}

      {/* Pinned: search (doesn't scroll) */}
      <div style={{padding:'0 18px 12px'}}>
        <div style={{
          display:'flex', alignItems:'center', gap: 10,
          background:'rgba(var(--fg-rgb),0.07)',
          border:'0.5px solid rgba(var(--fg-rgb),0.10)',
          borderRadius: 12, padding:'10px 14px',
        }}>
          <Icon name="search" size={16} color="var(--muted)"/>
          <input
            placeholder="Search rooms"
            value={query}
            onChange={e=>setQuery(e.target.value)}
            style={{
              flex:1, background:'transparent', border:0, outline:0,
              color:'var(--cream)', fontFamily:'var(--sans)', fontSize: 14, letterSpacing:'-0.01em',
            }}
          />
        </div>
      </div>

      {/* Scrollable area — the sponsored ad fades out as the room list scrolls */}
      <div className="phone-scroll" onScroll={e=> setScrollY(e.currentTarget.scrollTop)}
        style={{flex:1, overflowY:'auto', padding:'4px 18px 130px'}}>
        {!query && window.BANNER_ADS_ENABLED && (
          <div style={{
            marginBottom: 14, opacity: adOpacity, willChange:'opacity',
            pointerEvents: adOpacity < 0.15 ? 'none' : 'auto',
          }}>
            <AdCarousel16 onOpenCTA={onOpenAdCTA}/>
          </div>
        )}
        <div style={{display:'flex', flexDirection:'column', gap: 10}}>
          {rooms.map(r => <RoomCard key={r.id} room={r} onClick={()=>onOpenRoom(r)}/>)}
        </div>
        {rooms.length === 0 && (
          <div style={{textAlign:'center', padding:'40px 20px', color:'var(--muted)', fontSize: 13}}>
            No rooms match your search.
          </div>
        )}
      </div>
    </div>
  );
}

function RoomCard({ room, onClick }) {
  const members = (room.members || []).map(id => ALL_FRIENDS().find(f => f.id === id)).filter(Boolean);
  return (
    <button onClick={onClick} style={{
      appearance:'none', border:'0.5px solid rgba(var(--fg-rgb),0.10)',
      background:'linear-gradient(160deg, rgba(var(--fg-rgb),0.10), rgba(var(--fg-rgb),0.035))', backdropFilter:'blur(18px) saturate(150%)', WebkitBackdropFilter:'blur(18px) saturate(150%)',
      borderRadius: 18, padding:'14px 14px', width:'100%', textAlign:'left',
      display:'flex', alignItems:'center', gap: 14, color:'var(--cream)',
      position:'relative', overflow:'hidden',
    }}>
      {/* subtle tone accent on left */}
      <div style={{
        position:'absolute', left: 0, top: 14, bottom: 14, width: 3, borderRadius: 3,
        background: room.tone,
      }}/>

      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: `linear-gradient(135deg, ${hexA(room.tone, 0.25)}, ${hexA(room.tone, 0.08)})`,
        border: `0.5px solid ${hexA(room.tone, 0.35)}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize: 22, flexShrink: 0,
      }}>{room.emoji || '🎬'}</div>

      <div style={{flex:1, minWidth: 0}}>
        <div style={{
          fontWeight: 600, fontSize: 15.5, letterSpacing:'-0.01em',
          display:'flex', alignItems:'center', gap: 8,
        }}>
          {room.name}
          {room.matchCount > 0 && (
            <span style={{
              padding:'2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600,
              background: hexA(room.tone, 0.18), color: room.tone,
              border:`0.5px solid ${hexA(room.tone, 0.32)}`,
            }}>{room.matchCount}</span>
          )}
        </div>
        <div style={{fontSize: 12, color:'var(--muted)', marginTop: 3, display:'flex', alignItems:'center', gap: 6}}>
          {room.type && (<>
            <span style={{textTransform:'capitalize'}}>{room.type === 'couple' ? 'Partner' : room.type}</span>
            <span>·</span>
          </>)}
          <span>{members.length} {members.length===1?'member':'members'}</span>
          <span>·</span>
          <span>{room.lastActivity}</span>
        </div>
      </div>

      {/* member avatar stack */}
      <div style={{display:'flex', alignItems:'center', flexShrink: 0, marginLeft: 4}}>
        {members.slice(0, 3).map((m, i) => (
          <div key={m.id} style={{
            marginLeft: i === 0 ? 0 : -10,
            border:'2px solid var(--ink)', borderRadius:'50%',
          }}>
            <Avatar person={m} size={28}/>
          </div>
        ))}
        {members.length > 3 && (
          <div style={{
            marginLeft: -10,
            width: 28, height: 28, borderRadius:'50%',
            border:'2px solid var(--ink)',
            background:'rgba(var(--fg-rgb),0.10)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize: 10, fontWeight: 600, color:'var(--cream)',
          }}>+{members.length - 3}</div>
        )}
      </div>
    </button>
  );
}

function hexA(hex, a) {
  // Accept "#rrggbb" or "var(--x)" passthrough
  if (!hex || !hex.startsWith('#')) return hex;
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// ─── Room Detail (group profile) ────────────────────────────────────
function RoomDetailScreen({ room: initialRoom, onBack, onOpenMovie, onModal, onSwipeRoom }) {
  const [room, setRoom] = React.useState(initialRoom);
  const [showAddMembers, setShowAddMembers] = React.useState(false);
  const [showShare, setShowShare] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showGenreVote, setShowGenreVote] = React.useState(false);
  const [roundTick, setRoundTick] = React.useState(0);
  const [memberToast, setMemberToast] = React.useState('');

  // Tell the host to lift this overlay above the nav bar while any bottom
  // sheet is open, so the sheet's action button isn't hidden behind the nav.
  React.useEffect(() => {
    onModal?.(showAddMembers || showShare || showSettings || showGenreVote);
  }, [showAddMembers, showShare, showSettings, showGenreVote]);

  // Movie-night date for this room (persisted)
  const dateKey = `matchdoo.roomdate.${initialRoom.id}`;
  const [watchDate, setWatchDate] = React.useState(() => { try { return localStorage.getItem(dateKey) || initialRoom.watchDate || ''; } catch { return initialRoom.watchDate || ''; } });
  const saveWatchDate = (v) => { setWatchDate(v); try { v ? localStorage.setItem(dateKey, v) : localStorage.removeItem(dateKey); } catch {} };
  const isoLocal = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const fmtWatch = (v) => new Date(v + 'T00:00:00').toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' });
  const _tod = new Date(); const _tom = new Date(_tod); _tom.setDate(_tod.getDate()+1);
  const _sat = new Date(_tod); _sat.setDate(_tod.getDate() + ((6 - _tod.getDay() + 7) % 7));
  const QUICK_DATES = [
    { label:'Tonight',      value: isoLocal(_tod) },
    { label:'Tomorrow',     value: isoLocal(_tom) },
    { label:'This weekend', value: isoLocal(_sat) },
  ];

  const allFriends = ALL_FRIENDS();
  const members = (room.members || []).map(id => allFriends.find(f => f.id === id)).filter(Boolean);

  const handleAddMembers = (ids) => {
    const next = { ...room, members: [...(room.members||[]), ...ids], lastActivity: 'Just now' };
    // Sync to global ROOMS
    window.ROOMS = window.ROOMS.map(r => r.id === room.id ? next : r);
    setRoom(next);
    setShowAddMembers(false);
    setMemberToast(`Added ${ids.length} member${ids.length===1?'':'s'}`);
    setTimeout(()=> setMemberToast(''), 2000);
  };

  const syncRoom = (next) => { window.ROOMS = (window.ROOMS || []).map(r => r.id === room.id ? next : r); setRoom(next); };
  const applyRoomUpdate = (patch) => {
    syncRoom({ ...room, ...patch });
    setMemberToast('Room updated');
    setTimeout(()=> setMemberToast(''), 1800);
  };
  const removeMember = (id) => syncRoom({ ...room, members: (room.members || []).filter(x => x !== id) });
  const removeRoom = () => { window.ROOMS = (window.ROOMS || []).filter(r => r.id !== room.id); onBack(); };

  // ── Round data — the room's voting + swipe session (persisted) ──────
  const RR = window.RoomRounds;
  const roundResults = React.useMemo(() => RR.results(room), [room, roundTick]);
  const activeGenres = React.useMemo(() => RR.activeGenres(room), [room, roundTick]);
  const myVotes = (RR.ensure(room).myGenreVotes || []);
  const deckLeft = React.useMemo(() => RR.deck(room).length, [room, roundTick]);
  const totalVoters = members.length + 1;
  const groupMatches = roundResults.filter(r => r.everyone);
  const almost = roundResults.filter(r => !r.everyone && r.votes >= 2);
  const daysLeft = watchDate
    ? Math.ceil((new Date(watchDate + 'T00:00:00') - new Date(new Date().toDateString())) / 86400000)
    : null;

  return (
    <div className="fade-in" style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <TopBar title="" onBack={onBack} right={
        <div style={{display:'flex', alignItems:'center', gap: 8}}>
          <button onClick={()=> setShowShare(true)} aria-label="Share room" style={{
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.09)',
            width: 36, height: 36, borderRadius: 999, color:'var(--cream)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name="share" size={16}/>
          </button>
          <button onClick={()=> setShowSettings(true)} aria-label="Room settings" style={{
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.09)',
            width: 36, height: 36, borderRadius: 999, color:'var(--cream)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name="settings" size={16}/>
          </button>
        </div>
      }/>

      {/* Hero */}
      <div style={{
        padding:'4px 28px 22px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center',
      }}>
        <div style={{
          width: 90, height: 90, borderRadius: 26,
          background: `linear-gradient(135deg, ${hexA(room.tone, 0.4)}, ${hexA(room.tone, 0.1)})`,
          border: `0.5px solid ${hexA(room.tone, 0.4)}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize: 38, marginBottom: 14,
        }}>{room.emoji}</div>

        <div style={{
          fontFamily:'var(--serif)', fontSize: 32, lineHeight: 1.05,
          color:'var(--cream)', letterSpacing:'-0.01em',
        }}>{room.name}</div>
        <div style={{fontSize: 12.5, color:'var(--muted)', marginTop: 5, textTransform:'capitalize'}}>
          {room.type ? `${room.type === 'couple' ? 'Partner' : room.type} · ` : ''}{members.length} {members.length===1?'member':'members'} · {room.lastActivity}
        </div>

        {/* Member avatars in a row, with + Add */}
        <div style={{
          display:'flex', alignItems:'center', gap: 10, marginTop: 18,
          flexWrap:'wrap', justifyContent:'center', maxWidth: 320,
        }}>
          {members.map(m => (
            <div key={m.id} style={{display:'flex', flexDirection:'column', alignItems:'center', gap: 4}}>
              <Avatar person={m} size={44}/>
              <div style={{fontSize: 10, color:'var(--muted)'}}>{m.name.split(' ')[0]}</div>
            </div>
          ))}
          <button onClick={()=> setShowAddMembers(true)} style={{
            appearance:'none', border:'1px dashed rgba(var(--fg-rgb),0.24)',
            background:'rgba(var(--fg-rgb),0.03)',
            display:'flex', flexDirection:'column', alignItems:'center', gap: 4,
            padding: 0, color:'var(--muted)', width: 44,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 999,
              display:'flex', alignItems:'center', justifyContent:'center',
              background:'rgba(var(--fg-rgb),0.05)',
              border:'1px dashed rgba(var(--fg-rgb),0.24)',
            }}>
              <Icon name="plus" size={16}/>
            </div>
            <div style={{fontSize: 10, color:'var(--muted)'}}>Add</div>
          </button>
        </div>

        <div style={{
          display:'flex', gap: 22, marginTop: 22, padding:'14px 22px',
          background:'linear-gradient(160deg, rgba(var(--fg-rgb),0.10), rgba(var(--fg-rgb),0.035))', backdropFilter:'blur(18px) saturate(150%)', WebkitBackdropFilter:'blur(18px) saturate(150%)',
          border:'0.5px solid rgba(var(--fg-rgb),0.08)',
          borderRadius: 16,
        }}>
          <Stat label="Group matches" value={groupMatches.length}/>
          <div style={{width:0.5, background:'var(--line)'}}/>
          <Stat label="Almost there" value={almost.length}/>
          <div style={{width:0.5, background:'var(--line)'}}/>
          <Stat label="Members" value={members.length}/>
        </div>
      </div>

      <div className="phone-scroll" style={{flex:1, overflowY:'auto', padding:'0 0 130px'}}>
        {/* ── This round — the room's voting + swipe session ── */}
        <div style={{padding:'4px 18px 6px'}}>
          <div style={{
            borderRadius: 18, padding:'16px 16px 14px',
            background:'linear-gradient(160deg, rgba(var(--fg-rgb),0.10), rgba(var(--fg-rgb),0.035))',
            border:'0.5px solid rgba(var(--fg-rgb),0.10)',
          }}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12}}>
              <div style={{fontFamily:'var(--serif)', fontSize: 19, color:'var(--cream)'}}>This round</div>
              <div style={{
                display:'inline-flex', alignItems:'center', gap: 6,
                fontSize: 11, fontWeight: 700, padding:'5px 10px', borderRadius: 999,
                background: hexA(room.tone, 0.14), color: room.tone,
                border:`0.5px solid ${hexA(room.tone, 0.3)}`,
              }}>
                <Icon name="clock" size={12} color={room.tone}/>
                {daysLeft == null ? `${room.votingDays || 3}-day window`
                  : daysLeft > 0 ? `${daysLeft} day${daysLeft===1?'':'s'} to vote`
                  : 'Voting closed'}
              </div>
            </div>

            {/* Streaming scope */}
            {(room.filters?.services || []).length > 0 && (
              <div style={{display:'flex', alignItems:'center', gap: 6, marginBottom: 12, flexWrap:'wrap'}}>
                <span style={{fontSize: 11, color:'var(--muted)', marginRight: 2}}>On</span>
                {(room.filters.services).map(s => (
                  <span key={s} style={{display:'inline-flex', alignItems:'center', gap:5, fontSize:11.5, fontWeight:600, color:'var(--cream)', padding:'3px 9px 3px 4px', borderRadius:999, background:'rgba(var(--fg-rgb),0.06)', border:'0.5px solid rgba(var(--fg-rgb),0.10)'}}>
                    <ServiceChip name={s} size={14}/>{s}
                  </span>
                ))}
              </div>
            )}

            {/* Genre vote row */}
            <button onClick={()=> setShowGenreVote(true)} className="tap-row" style={{
              appearance:'none', border:'0.5px solid rgba(var(--fg-rgb),0.10)',
              background:'rgba(var(--fg-rgb),0.04)', width:'100%', textAlign:'left',
              borderRadius: 12, padding:'11px 12px', color:'var(--cream)',
              display:'flex', alignItems:'center', gap: 10, marginBottom: 12,
            }}>
              <IconBadge icon="sparkle" size={34} tone={room.tone}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize: 13.5, fontWeight: 700}}>Vote genres</div>
                <div style={{fontSize: 11.5, color:'var(--muted)', marginTop: 2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                  {myVotes.length ? `You voted: ${myVotes.join(', ')}` : `Pick from ${(room.filters?.genres||[]).length} genres the owner set`}
                </div>
              </div>
              <Icon name="chev" size={14} color="var(--muted-2)"/>
            </button>

            {/* Winning genres */}
            {activeGenres.length > 0 && (
              <div style={{display:'flex', gap: 6, flexWrap:'wrap', marginBottom: 14}}>
                {activeGenres.map(g => (
                  <span key={g} style={{
                    fontSize: 11.5, fontWeight: 600, padding:'5px 11px', borderRadius: 999,
                    background:'rgba(255,109,41,0.12)', color:'var(--red)',
                    border:'0.5px solid rgba(255,109,41,0.28)',
                  }}>{g}</span>
                ))}
              </div>
            )}

            {/* Swipe CTA */}
            <button onClick={()=> onSwipeRoom?.(room, ()=> setRoundTick(t=>t+1))} style={{
              appearance:'none', border:0, width:'100%',
              background:`linear-gradient(135deg, ${room.tone}, ${hexA(room.tone,0.75)})`,
              color:'#fff', borderRadius: 14, padding:'14px', cursor:'pointer',
              fontFamily:'var(--sans)', fontWeight: 700, fontSize: 15,
              display:'flex', alignItems:'center', justifyContent:'center', gap: 9,
              boxShadow:`0 10px 24px ${hexA(room.tone,0.4)}`,
            }}>
              <Icon name="cards" size={19} color="#fff" stroke={2.2}/>
              {deckLeft > 0 ? 'Swipe together' : 'Review picks'}
              <span style={{fontSize: 12, fontWeight: 600, opacity: 0.9}}>
                {deckLeft > 0 ? `· ${deckLeft} left` : '· deck done'}
              </span>
            </button>
          </div>
        </div>

        {/* Ranked round results — the movies everyone wants, most-wanted first */}
        <Section title="Top picks this round" caption={
          groupMatches.length
            ? `Ranked by how many of you want it (${groupMatches.length} everyone-match${groupMatches.length===1?'':'es'})`
            : 'Swipe together, then the most-wanted films rank here'
        }>
          {roundResults.length === 0 ? (
            <EmptySectionRow text="No likes yet — hit “Swipe together” to start voting with your swipes."/>
          ) : (
            <div style={{display:'flex', flexDirection:'column', gap: 8, padding:'0 18px'}}>
              {roundResults.slice(0, 8).map((r, i) => (
                <RoundResultRow key={r.movie.id} rank={i+1} result={r} total={totalVoters} tone={room.tone} onTap={()=> onOpenMovie(r.movie, room)}/>
              ))}
            </div>
          )}
        </Section>

        {/* Movie night — pick a day to watch together */}
        <div style={{padding:'4px 18px 6px'}}>
          <div style={{
            borderRadius: 18, padding:'14px 16px',
            background: `linear-gradient(135deg, ${hexA(room.tone, 0.14)}, rgba(var(--fg-rgb),0.04))`,
            border:`0.5px solid ${hexA(room.tone, 0.28)}`,
          }}>
            <div style={{display:'flex', alignItems:'center', gap: 12}}>
              <IconBadge icon="clock" size={40} tone={room.tone}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontWeight:700, fontSize:15, color:'var(--cream)'}}>Movie night</div>
                <div style={{
                  fontSize:12.5, marginTop:2,
                  color: watchDate ? room.tone : 'var(--muted)', fontWeight: watchDate ? 700 : 400,
                }}>
                  {watchDate ? fmtWatch(watchDate) : 'Pick a day to watch together'}
                </div>
              </div>
              {watchDate && (
                <button onClick={()=> saveWatchDate('')} aria-label="Clear date" style={{
                  appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.09)',
                  width: 32, height: 32, borderRadius: 999, color:'var(--muted)', flexShrink:0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <Icon name="x" size={15}/>
                </button>
              )}
            </div>
            <div style={{display:'flex', gap: 8, marginTop: 14, flexWrap:'wrap'}}>
              {QUICK_DATES.map(qd => {
                const on = watchDate === qd.value;
                return (
                  <button key={qd.label} onClick={()=> saveWatchDate(qd.value)} style={{
                    appearance:'none', cursor:'pointer',
                    padding:'9px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                    background: on ? room.tone : 'rgba(var(--fg-rgb),0.06)',
                    color: on ? '#fff' : 'var(--cream)',
                    border: `0.5px solid ${on ? room.tone : 'rgba(var(--fg-rgb),0.12)'}`,
                  }}>{qd.label}</button>
                );
              })}
              <label style={{
                position:'relative', cursor:'pointer',
                display:'inline-flex', alignItems:'center', gap: 6,
                padding:'9px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                background:'rgba(var(--fg-rgb),0.07)', color:'var(--cream)',
                border:'0.5px solid rgba(var(--fg-rgb),0.12)',
              }}>
                <Icon name="clock" size={14}/>
                Pick a date
                <input
                  type="date"
                  value={watchDate}
                  onChange={e => saveWatchDate(e.target.value)}
                  style={{position:'absolute', inset:0, opacity:0, cursor:'pointer', width:'100%', height:'100%'}}
                />
              </label>
            </div>
          </div>
        </div>

        {almost.length > 0 && (
          <Section title="Almost a match" caption="You want these — waiting on the rest of the room">
            <PosterRow movies={almost.map(a=>a.movie)} onTap={(m)=>onOpenMovie(m, room)} dim/>
          </Section>
        )}
      </div>

      {showAddMembers && (
        <AddRoomMembersSheet
          room={room}
          onClose={()=> setShowAddMembers(false)}
          onAdd={handleAddMembers}
        />
      )}

      {showShare && (
        <ShareRoomSheet room={room} onClose={()=> setShowShare(false)}/>
      )}

      {showGenreVote && (
        <RoomGenreVoteSheet
          room={room}
          onClose={()=> setShowGenreVote(false)}
          onSaved={()=>{ setShowGenreVote(false); setRoundTick(t=>t+1); }}
        />
      )}

      {showSettings && (
        <RoomSettingsSheet
          room={room}
          members={members}
          onClose={()=> setShowSettings(false)}
          onUpdate={applyRoomUpdate}
          onRemoveMember={removeMember}
          onAddMembers={()=>{ setShowSettings(false); setShowAddMembers(true); }}
          onShare={()=>{ setShowSettings(false); setShowShare(true); }}
          onLeave={()=>{ setShowSettings(false); removeRoom(); }}
          onDelete={()=>{ setShowSettings(false); removeRoom(); }}
        />
      )}

      {memberToast && (
        <div className="rise" style={{
          position:'absolute', left:'50%', bottom: 30, transform:'translateX(-50%)',
          padding:'10px 16px', borderRadius: 999,
          background:'rgba(var(--bg-rgb),0.92)',
          backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
          border:'0.5px solid rgba(240,178,74,0.40)',
          color:'var(--cream)', fontSize: 12.5, fontWeight: 500,
          zIndex: 220, display:'inline-flex', alignItems:'center', gap: 8,
          boxShadow:'0 12px 30px rgba(0,0,0,0.4)',
        }}>
          <Icon name="check" size={14} color="#F0B24A" stroke={2.6}/>
          {memberToast}
        </div>
      )}
    </div>
  );
}

// ─── Create Room ────────────────────────────────────────────────────
function CreateRoomScreen({ onBack, onCreate }) {
  const [name, setName] = React.useState('');
  const [emoji, setEmoji] = React.useState('🎬');
  const [selected, setSelected] = React.useState(new Set());
  const [services, setServices] = React.useState(new Set(['Netflix','Prime']));
  const [genres, setGenres] = React.useState(new Set());
  const [votingDays, setVotingDays] = React.useState(3);
  const allFriends = ALL_FRIENDS();
  const EMOJI_OPTS = ['🎬','🍿','✨','🌸','🎟️','🎭','🌙','🍕','☕','🔥','🎉','💫'];
  const SERVICE_OPTS = Object.keys(window.SERVICES || {});
  const GENRE_OPTS = window.ROOM_GENRES || [];

  const toggle = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const toggleService = (name) => {
    const next = new Set(services);
    next.has(name) ? next.delete(name) : next.add(name);
    setServices(next);
  };
  const toggleGenre = (g) => {
    const next = new Set(genres);
    if (next.has(g)) next.delete(g);
    else { if (next.size >= 5) return; next.add(g); }  // cap at 5
    setGenres(next);
  };

  const tone = '#FF6D29';  // rooms use the brand tone now that Type is gone

  const canCreate = name.trim().length >= 2 && selected.size >= 1
    && services.size >= 1 && genres.size >= 3 && genres.size <= 5;

  return (
    <div className="fade-in" style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <TopBar title="New room" onBack={onBack}/>

      <div className="phone-scroll" style={{flex:1, overflowY:'auto', padding:'4px 18px 110px'}}>
        {/* Emoji + name */}
        <div style={{
          padding:'18px 16px', borderRadius: 18,
          background:'linear-gradient(160deg, rgba(var(--fg-rgb),0.10), rgba(var(--fg-rgb),0.035))', backdropFilter:'blur(18px) saturate(150%)', WebkitBackdropFilter:'blur(18px) saturate(150%)',
          border:'0.5px solid rgba(var(--fg-rgb),0.10)',
          display:'flex', alignItems:'center', gap: 12,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: `linear-gradient(135deg, ${hexA(tone, 0.4)}, ${hexA(tone, 0.1)})`,
            border: `0.5px solid ${hexA(tone, 0.4)}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize: 28, flexShrink: 0,
          }}>{emoji}</div>
          <input
            placeholder="Room name"
            value={name} onChange={e=>setName(e.target.value)}
            style={{
              flex:1, background:'transparent', border:0, outline:0,
              color:'var(--cream)', fontFamily:'var(--serif)', fontSize: 24, letterSpacing:'-0.01em',
            }}
          />
        </div>

        {/* Emoji picker */}
        <div style={{
          marginTop: 14, padding:'12px 12px',
          background:'rgba(var(--fg-rgb),0.03)',
          border:'0.5px solid rgba(var(--fg-rgb),0.08)',
          borderRadius: 14,
          display:'flex', gap: 6, flexWrap:'wrap',
        }}>
          {EMOJI_OPTS.map(e=>(
            <button key={e} onClick={()=>setEmoji(e)} style={{
              appearance:'none', border:0,
              width: 36, height: 36, borderRadius: 10,
              background: emoji===e ? 'rgba(var(--fg-rgb),0.10)' : 'transparent',
              fontSize: 20,
              border: `0.5px solid ${emoji===e? 'rgba(var(--fg-rgb),0.25)':'transparent'}`,
            }}>{e}</button>
          ))}
        </div>


        {/* Streaming — the deck is drawn only from these services */}
        <div style={{marginTop: 22}}>
          <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', padding:'0 4px 10px'}}>
            <div style={{fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)'}}>
              Streaming
            </div>
            <div style={{fontSize: 11, color:'var(--muted-2)'}}>picks come from these</div>
          </div>
          <div style={{display:'flex', gap: 7, flexWrap:'wrap'}}>
            {SERVICE_OPTS.map(name=>{
              const on = services.has(name);
              const c = (window.SERVICES[name] || {}).color || '#888';
              return (
                <button key={name} onClick={()=>toggleService(name)} style={{
                  appearance:'none', cursor:'pointer',
                  display:'inline-flex', alignItems:'center', gap: 7,
                  padding:'8px 12px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
                  border:`0.5px solid ${on? hexA(c,0.6) : 'rgba(var(--fg-rgb),0.12)'}`,
                  background: on ? hexA(c, 0.16) : 'rgba(var(--fg-rgb),0.03)',
                  color: on ? 'var(--cream)' : 'var(--muted)',
                }}>
                  <ServiceChip name={name} size={16}/>
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Genre pool — owner nominates 3–5; members vote among these */}
        <div style={{marginTop: 22}}>
          <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', padding:'0 4px 10px'}}>
            <div style={{fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)'}}>
              Genre pool
            </div>
            <div style={{fontSize: 11, color: genres.size>=3 && genres.size<=5 ? 'var(--green)' : 'var(--muted-2)'}}>
              {genres.size}/5 · pick 3–5
            </div>
          </div>
          <div style={{display:'flex', gap: 7, flexWrap:'wrap'}}>
            {GENRE_OPTS.map(g=>{
              const on = genres.has(g);
              const dim = !on && genres.size >= 5;
              return (
                <button key={g} onClick={()=>toggleGenre(g)} style={{
                  appearance:'none', cursor: dim ? 'default' : 'pointer',
                  padding:'8px 13px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
                  border:`0.5px solid ${on? 'var(--red)' : 'rgba(var(--fg-rgb),0.12)'}`,
                  background: on ? 'rgba(255,109,41,0.14)' : 'rgba(var(--fg-rgb),0.03)',
                  color: on ? 'var(--red)' : (dim ? 'var(--muted-2)' : 'var(--cream)'),
                  opacity: dim ? 0.5 : 1,
                }}>{g}</button>
              );
            })}
          </div>
        </div>

        {/* Voting window — how long members have to vote + swipe */}
        <div style={{marginTop: 22}}>
          <div style={{fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)', marginBottom: 10}}>
            Voting window
          </div>
          <div style={{display:'flex', gap: 6}}>
            {[{d:1,l:'1 day'},{d:3,l:'3 days'},{d:7,l:'1 week'}].map(o=>{
              const on = votingDays === o.d;
              return (
                <button key={o.d} onClick={()=>setVotingDays(o.d)} style={{
                  appearance:'none', border:`0.5px solid ${on? 'var(--red)' : 'rgba(var(--fg-rgb),0.12)'}`,
                  background: on ? 'rgba(255,109,41,0.12)' : 'rgba(var(--fg-rgb),0.03)',
                  color: on ? 'var(--red)' : 'var(--cream)',
                  flex:1, padding:'12px 8px', borderRadius: 12,
                  fontFamily:'var(--sans)', fontWeight: 600, fontSize: 13,
                }}>{o.l}</button>
              );
            })}
          </div>
          <div style={{fontSize: 11.5, color:'var(--muted)', marginTop: 8, paddingLeft: 4}}>
            Members have this long to vote genres and swipe before the pick is locked.
          </div>
        </div>

        {/* Members picker */}
        <div style={{marginTop: 22}}>
          <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', padding:'0 4px 10px'}}>
            <div style={{fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)'}}>
              Add members
            </div>
            <div style={{fontSize: 11, color:'var(--muted-2)'}}>{selected.size} selected</div>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap: 4}}>
            {allFriends.map(f=>{
              const on = selected.has(f.id);
              return (
                <button key={f.id} onClick={()=>toggle(f.id)} style={{
                  appearance:'none', border:0, background:'transparent',
                  display:'flex', alignItems:'center', gap: 12,
                  padding:'10px 6px', textAlign:'left', color:'var(--cream)',
                }}>
                  <Avatar person={f} size={42}/>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontWeight: 600, fontSize: 14.5}}>{f.name}</div>
                    <div style={{fontSize: 12, color:'var(--muted)'}}>{f.handle}</div>
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    border: `1.5px solid ${on? 'var(--cream)':'rgba(var(--fg-rgb),0.22)'}`,
                    background: on ? 'var(--cream)' : 'transparent',
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0,
                  }}>
                    {on && <Icon name="check" size={12} color="var(--ink)" stroke={3}/>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{
        position:'absolute', left: 16, right: 16, bottom: 26, zIndex: 5,
      }}>
        <PrimaryBtn full disabled={!canCreate} onClick={()=>{
          const newRoom = {
            id: 'r' + Date.now(), name: name.trim(), emoji,
            members: Array.from(selected), lastActivity: 'Just now',
            tone, matchCount: 0,
            ownerId: 'me', votingDays,
            filters: { services: Array.from(services), genres: Array.from(genres) },
          };
          window.ROOMS = [newRoom, ...window.ROOMS];
          onCreate(newRoom);
        }}>
          Create room
        </PrimaryBtn>
      </div>
    </div>
  );
}

// ─── Share room helpers ─────────────────────────────────────────────
// Deterministic, human-readable join code derived from the room id.
// Uses an unambiguous alphabet (no 0/O/1/I) so it's easy to read aloud.
function roomCode(room) {
  const raw = String(room?.id || 'room');
  let h = 2166136261 >>> 0; // FNV-1a
  for (let i = 0; i < raw.length; i++) {
    h ^= raw.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) {
    s += A[h % A.length];
    h = Math.floor(h / A.length) + 0x9e3779b1;
    h = h >>> 0;
  }
  return s;
}

function roomLink(room) {
  return `https://matchdoo.app/j/${roomCode(room)}`;
}

// ─── Share Room bottom-sheet ────────────────────────────────────────
function ShareRoomSheet({ room, onClose }) {
  const [toast, setToast] = React.useState('');
  const [qrFailed, setQrFailed] = React.useState(false);
  const code = roomCode(room);
  const link = roomLink(room);
  const tone = room.tone || '#FF6D29';

  // QR of the join link — rendered on a light card (dark modules) so it
  // scans reliably. Image is fetched live from a public QR renderer.
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=1&qzone=1&color=0b0f18&bgcolor=ffffff&data=${encodeURIComponent(link)}`;

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  };

  const copy = async (text, label) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
      }
      flash(`${label} copied`);
    } catch (e) {
      flash("Couldn't copy");
    }
  };

  const share = async () => {
    const payload = {
      title: `Join "${room.name}" on Match Doo`,
      text: `Join my movie room "${room.name}" — let's find something we both want to watch.`,
      url: link,
    };
    if (navigator.share) {
      try { await navigator.share(payload); }
      catch (e) { /* user cancelled — no-op */ }
    } else {
      copy(link, 'Link');
    }
  };

  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0, zIndex: 200,
      background:'rgba(var(--bg-rgb),0.7)',
      backdropFilter:'blur(16px) saturate(140%)',
      WebkitBackdropFilter:'blur(16px) saturate(140%)',
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
    }}>
      <div onClick={e=>e.stopPropagation()} className="rise" style={{
        background:'var(--ink)',
        borderRadius:'28px 28px 0 0',
        padding:'14px 20px 26px',
        boxShadow:'0 -20px 40px rgba(0,0,0,0.5)',
        border:'0.5px solid rgba(var(--fg-rgb),0.10)', borderBottom: 0,
      }}>
        <div style={{
          width: 42, height: 4, borderRadius: 2,
          background:'rgba(var(--fg-rgb),0.25)', margin:'0 auto 14px',
        }}/>

        {/* Header */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap: 8}}>
          <div style={{display:'flex', alignItems:'center', gap: 12, minWidth: 0}}>
            <div style={{
              width: 46, height: 46, borderRadius: 13,
              background: `linear-gradient(135deg, ${hexA(tone, 0.35)}, ${hexA(tone, 0.1)})`,
              border: `0.5px solid ${hexA(tone, 0.4)}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize: 22, flexShrink: 0,
            }}>{room.emoji || '🎬'}</div>
            <div style={{minWidth: 0}}>
              <div style={{fontFamily:'var(--serif)', fontSize: 24, lineHeight: 1.1, color:'var(--cream)'}}>Invite to {room.name}</div>
              <div style={{fontSize: 12, color:'var(--muted)', marginTop: 2}}>Anyone with the code or link can join</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.09)',
            width: 34, height: 34, borderRadius: 999, color:'var(--muted)',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0,
          }}>
            <Icon name="x" size={16}/>
          </button>
        </div>

        {/* QR code on a light card */}
        <div style={{display:'flex', justifyContent:'center', margin:'20px 0 6px'}}>
          <div style={{
            width: 188, height: 188, borderRadius: 20, padding: 12,
            background:'#ffffff',
            border:'0.5px solid rgba(var(--fg-rgb),0.14)',
            boxShadow:'0 10px 30px rgba(0,0,0,0.35)',
            display:'flex', alignItems:'center', justifyContent:'center',
            position:'relative', overflow:'hidden',
          }}>
            {!qrFailed ? (
              <img
                src={qrSrc}
                alt={`QR code to join ${room.name}`}
                width={164} height={164}
                onError={()=>setQrFailed(true)}
                style={{display:'block', width: 164, height: 164, imageRendering:'pixelated'}}
              />
            ) : (
              <div style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap: 8,
                color:'#17100f', textAlign:'center',
              }}>
                <Icon name="qr" size={64} color="#17100f" stroke={1.4}/>
                <div style={{fontSize: 11, fontWeight: 600, letterSpacing:'0.02em'}}>{code}</div>
              </div>
            )}
          </div>
        </div>
        <div style={{textAlign:'center', fontSize: 11.5, color:'var(--muted)', marginBottom: 16}}>
          Scan to join the room
        </div>

        {/* Room code — tap to copy */}
        <button onClick={()=>copy(code, 'Code')} style={{
          appearance:'none', width:'100%', textAlign:'left',
          border:`0.5px solid ${hexA(tone, 0.3)}`,
          background: hexA(tone, 0.08),
          borderRadius: 14, padding:'12px 14px',
          display:'flex', alignItems:'center', gap: 12, color:'var(--cream)',
        }}>
          <IconBadge icon="qr" size={38} tone={tone}/>
          <div style={{flex:1, minWidth: 0}}>
            <div style={{fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)'}}>Room code</div>
            <div style={{
              fontFamily:'var(--sans)', fontWeight: 700, fontSize: 22,
              letterSpacing:'0.22em', color: tone, marginTop: 2,
            }}>{code}</div>
          </div>
          <Icon name="copy" size={17} color="var(--muted-2)"/>
        </button>

        {/* Copy link + Share */}
        <div style={{display:'flex', gap: 8, marginTop: 10}}>
          <button onClick={()=>copy(link, 'Link')} style={{
            appearance:'none', flex: 1, border:'0.5px solid rgba(var(--fg-rgb),0.14)',
            background:'rgba(var(--fg-rgb),0.07)', color:'var(--cream)',
            padding:'13px 14px', borderRadius: 14,
            display:'inline-flex', alignItems:'center', justifyContent:'center', gap: 8,
            fontFamily:'var(--sans)', fontWeight: 600, fontSize: 14,
          }}>
            <Icon name="link" size={16}/>
            Copy link
          </button>
          <button onClick={share} style={{
            appearance:'none', flex: 1, border:0,
            background:'var(--cream)', color:'var(--ink)',
            padding:'13px 14px', borderRadius: 14,
            display:'inline-flex', alignItems:'center', justifyContent:'center', gap: 8,
            fontFamily:'var(--sans)', fontWeight: 600, fontSize: 14,
          }}>
            <Icon name="share" size={16} color="var(--ink)"/>
            Share
          </button>
        </div>

        {toast && (
          <div className="rise" style={{
            position:'absolute', left:'50%', bottom: 30, transform:'translateX(-50%)',
            padding:'10px 16px', borderRadius: 999,
            background:'rgba(var(--bg-rgb),0.92)',
            backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
            border:'0.5px solid rgba(240,178,74,0.40)',
            color:'var(--cream)', fontSize: 12.5, fontWeight: 500,
            zIndex: 220, display:'inline-flex', alignItems:'center', gap: 8,
            boxShadow:'0 12px 30px rgba(0,0,0,0.4)', whiteSpace:'nowrap',
          }}>
            <Icon name="check" size={14} color="#F0B24A" stroke={2.6}/>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Room settings sheet ────────────────────────────────────────────
function RoomSettingsSheet({ room, members = [], onClose, onUpdate, onRemoveMember, onAddMembers, onShare, onLeave, onDelete }) {
  const EMOJIS = ['🌸','🍿','🎬','✨','🎥','🎭','🌙','🍕','☕','🔥','❤️','🎉'];
  const TONES  = ['#FF6D29','#FDA65A','#F0B24A','#E8846B','#D98B5A','#C77D52','#B32C1A','#8A5A3C'];
  const [name, setName]   = React.useState(room.name);
  const [emoji, setEmoji] = React.useState(room.emoji || '🎬');
  const [tone, setTone]   = React.useState(room.tone || '#FF6D29');
  const [muted, setMuted] = React.useState(!!room.muted);
  const [confirm, setConfirm] = React.useState(null); // 'leave' | 'delete'

  const dirty = name.trim() !== room.name || emoji !== (room.emoji || '🎬') || tone !== (room.tone || '#FF6D29') || muted !== !!room.muted;
  const label = { fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)', margin:'0 0 10px 2px' };
  const save = () => { onUpdate({ name: name.trim() || room.name, emoji, tone, muted }); onClose(); };

  return (
    <div onClick={onClose} className="fade-in" style={{
      position:'absolute', inset:0, zIndex: 200,
      background:'rgba(var(--bg-rgb),0.7)',
      backdropFilter:'blur(16px) saturate(140%)', WebkitBackdropFilter:'blur(16px) saturate(140%)',
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
    }}>
      <div onClick={e=>e.stopPropagation()} className="rise phone-scroll" style={{
        background:'var(--ink)', borderRadius:'28px 28px 0 0',
        padding:'14px 20px 96px', maxHeight:'90%', overflowY:'auto',
        border:'0.5px solid rgba(var(--fg-rgb),0.10)', borderBottom: 0,
        boxShadow:'0 -20px 40px rgba(0,0,0,0.5)',
      }}>
        <div style={{width:42, height:4, borderRadius:2, background:'rgba(var(--fg-rgb),0.25)', margin:'0 auto 14px'}}/>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18}}>
          <div style={{fontFamily:'var(--serif)', fontSize:24, color:'var(--cream)', lineHeight:1.1}}>Room settings</div>
          <button onClick={onClose} aria-label="Close" style={{appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.09)', width:34, height:34, borderRadius:999, color:'var(--muted)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Icon name="x" size={16}/>
          </button>
        </div>

        {/* preview + name */}
        <div style={{display:'flex', alignItems:'center', gap:14, marginBottom:22}}>
          <div style={{width:60, height:60, borderRadius:18, flexShrink:0, fontSize:28,
            background:`linear-gradient(135deg, ${hexA(tone,0.4)}, ${hexA(tone,0.1)})`,
            border:`0.5px solid ${hexA(tone,0.4)}`, display:'flex', alignItems:'center', justifyContent:'center'}}>{emoji}</div>
          <div style={{flex:1, minWidth:0}}>
            <div style={label}>Room name</div>
            <input value={name} onChange={e=>setName(e.target.value)} style={{width:'100%', background:'rgba(var(--fg-rgb),0.07)', border:'0.5px solid rgba(var(--fg-rgb),0.14)', borderRadius:12, padding:'11px 12px', color:'var(--cream)', fontFamily:'var(--sans)', fontSize:15, outline:0}}/>
          </div>
        </div>

        {/* icon */}
        <div style={label}>Icon</div>
        <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:20}}>
          {EMOJIS.map(e=>(
            <button key={e} onClick={()=>setEmoji(e)} style={{appearance:'none', width:40, height:40, borderRadius:12, fontSize:20,
              background: emoji===e ? hexA(tone,0.14) : 'rgba(var(--fg-rgb),0.05)',
              border:`0.5px solid ${emoji===e ? hexA(tone,0.5) : 'transparent'}`}}>{e}</button>
          ))}
        </div>

        {/* color */}
        <div style={label}>Color</div>
        <div style={{display:'flex', gap:10, marginBottom:22}}>
          {TONES.map(t=>(
            <button key={t} onClick={()=>setTone(t)} aria-label={`Color ${t}`} style={{appearance:'none', width:30, height:30, borderRadius:999, background:t, border:'0.5px solid rgba(0,0,0,0.2)',
              boxShadow: tone===t ? `0 0 0 2px var(--ink), 0 0 0 3.5px ${t}` : 'none', display:'flex', alignItems:'center', justifyContent:'center'}}>
              {tone===t && <Icon name="check" size={14} color="#fff" stroke={3}/>}
            </button>
          ))}
        </div>

        {/* mute toggle */}
        <button onClick={()=>setMuted(m=>!m)} style={{appearance:'none', border:'0.5px solid rgba(var(--fg-rgb),0.10)', background:'linear-gradient(160deg, rgba(var(--fg-rgb),0.10), rgba(var(--fg-rgb),0.035))', backdropFilter:'blur(18px) saturate(150%)', WebkitBackdropFilter:'blur(18px) saturate(150%)', borderRadius:14, padding:'12px 14px', width:'100%', display:'flex', alignItems:'center', gap:12, marginBottom:22, color:'var(--cream)'}}>
          <IconBadge icon="bell" size={34} tone="#E0955E"/>
          <div style={{flex:1, textAlign:'left'}}>
            <div style={{fontSize:14, fontWeight:600}}>Mute notifications</div>
            <div style={{fontSize:12, color:'var(--muted)', marginTop:1}}>{muted ? 'Room alerts are off' : 'Get alerts on new matches'}</div>
          </div>
          <div style={{width:44, height:26, borderRadius:999, flexShrink:0, position:'relative', transition:'background .2s', background: muted ? 'rgba(var(--fg-rgb),0.15)' : 'var(--green)'}}>
            <div style={{position:'absolute', top:3, left: muted ? 3 : 21, width:20, height:20, borderRadius:999, background:'#fff', transition:'left .2s'}}/>
          </div>
        </button>

        {/* members */}
        <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', margin:'0 2px 10px'}}>
          <div style={{fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)'}}>Members</div>
          <div style={{fontSize:11, color:'var(--muted-2)'}}>{members.length}</div>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:6, marginBottom:10}}>
          {members.length === 0 && <div style={{fontSize:12.5, color:'var(--muted)', padding:'6px 2px'}}>Just you so far.</div>}
          {members.map(m=>(
            <div key={m.id} style={{display:'flex', alignItems:'center', gap:12, padding:'8px 10px', borderRadius:12, background:'linear-gradient(160deg, rgba(var(--fg-rgb),0.10), rgba(var(--fg-rgb),0.035))', backdropFilter:'blur(18px) saturate(150%)', WebkitBackdropFilter:'blur(18px) saturate(150%)'}}>
              <Avatar person={m} size={34}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:14, fontWeight:600, color:'var(--cream)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{m.name}</div>
                <div style={{fontSize:11.5, color:'var(--muted)'}}>{m.handle || ''}</div>
              </div>
              <button onClick={()=>onRemoveMember(m.id)} aria-label={`Remove ${m.name}`} style={{appearance:'none', border:0, background:'transparent', color:'var(--muted-2)', width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Icon name="x" size={15}/>
              </button>
            </div>
          ))}
        </div>
        <button onClick={onAddMembers} style={{appearance:'none', border:'0.5px dashed rgba(var(--fg-rgb),0.22)', background:'transparent', borderRadius:12, padding:'11px', width:'100%', color:'var(--cream)', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, fontSize:13.5, fontWeight:600, marginBottom:14}}>
          <Icon name="plus" size={15} stroke={2.2}/> Add members
        </button>

        {/* share shortcut */}
        <button onClick={onShare} style={{appearance:'none', border:'0.5px solid rgba(var(--fg-rgb),0.10)', background:'linear-gradient(160deg, rgba(var(--fg-rgb),0.10), rgba(var(--fg-rgb),0.035))', backdropFilter:'blur(18px) saturate(150%)', WebkitBackdropFilter:'blur(18px) saturate(150%)', borderRadius:14, padding:'12px 14px', width:'100%', display:'flex', alignItems:'center', gap:12, marginBottom:22, color:'var(--cream)'}}>
          <IconBadge icon="share" size={34} tone="#F0B24A"/>
          <div style={{flex:1, textAlign:'left', fontSize:14, fontWeight:600}}>Invite / share room</div>
          <Icon name="chev" size={14} color="var(--muted-2)"/>
        </button>

        {/* save */}
        <PrimaryBtn full disabled={!dirty} onClick={save}>Save changes</PrimaryBtn>

        {/* danger zone */}
        <div style={{height:0.5, background:'var(--line)', margin:'20px 0 16px'}}/>
        {confirm ? (
          <div style={{background:'rgba(232,121,138,0.08)', border:'0.5px solid rgba(232,121,138,0.3)', borderRadius:14, padding:14}}>
            <div style={{fontSize:13.5, color:'var(--cream)', fontWeight:600, marginBottom:4}}>{confirm==='delete' ? 'Delete this room?' : 'Leave this room?'}</div>
            <div style={{fontSize:12.5, color:'var(--muted)', marginBottom:12}}>{confirm==='delete' ? "This removes the room for good. This can't be undone." : "It'll be removed from your rooms."}</div>
            <div style={{display:'flex', gap:8}}>
              <button onClick={()=>setConfirm(null)} style={{appearance:'none', flex:1, border:'0.5px solid rgba(var(--fg-rgb),0.16)', background:'rgba(var(--fg-rgb),0.07)', color:'var(--cream)', borderRadius:999, padding:11, fontWeight:600, fontSize:14}}>Cancel</button>
              <button onClick={()=> confirm==='delete' ? onDelete() : onLeave()} style={{appearance:'none', flex:1, border:0, background:'#E8798A', color:'#fff', borderRadius:999, padding:11, fontWeight:600, fontSize:14}}>{confirm==='delete' ? 'Delete' : 'Leave'}</button>
            </div>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:8}}>
            <button onClick={()=>setConfirm('leave')} style={{appearance:'none', border:'0.5px solid rgba(var(--fg-rgb),0.14)', background:'transparent', color:'var(--cream)', borderRadius:999, padding:12, fontWeight:600, fontSize:14, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8}}>
              <Icon name="arrow" size={15}/> Leave room
            </button>
            <button onClick={()=>setConfirm('delete')} style={{appearance:'none', border:'0.5px solid rgba(232,121,138,0.35)', background:'transparent', color:'#E8798A', borderRadius:999, padding:12, fontWeight:600, fontSize:14}}>
              Delete room
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Ranked round-result row ────────────────────────────────────────
// One line in "Top picks this round": rank, poster thumb, title, and how
// many of the room want it (with an "Everyone's in" badge for full matches).
function RoundResultRow({ rank, result, total, tone, onTap }) {
  const { movie, likers, votes, everyone } = result;
  return (
    <button onClick={onTap} className="tap-row" style={{
      appearance:'none', border:'0.5px solid rgba(var(--fg-rgb),0.08)',
      background: everyone ? hexA(tone, 0.10) : 'rgba(var(--fg-rgb),0.04)',
      borderRadius: 14, padding:'9px 12px 9px 9px', width:'100%', textAlign:'left',
      display:'flex', alignItems:'center', gap: 11, color:'var(--cream)',
    }}>
      <div style={{
        width: 22, textAlign:'center', flexShrink:0,
        fontFamily:'var(--serif)', fontSize: 17,
        color: rank === 1 ? tone : 'var(--muted)',
      }}>{rank}</div>
      <div style={{width: 40, height: 54, borderRadius: 8, overflow:'hidden', flexShrink:0, boxShadow:'0 4px 10px rgba(0,0,0,0.3)'}}>
        <Poster movie={movie} size="lg" hideTitle/>
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontWeight: 700, fontSize: 14, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{movie.title}</div>
        <div style={{fontSize: 11.5, color:'var(--muted)', marginTop: 3, display:'flex', alignItems:'center', gap: 6}}>
          {everyone
            ? <span style={{color: tone, fontWeight: 700}}>Everyone's in</span>
            : <span>{votes} of {total} want this</span>}
          <span style={{opacity:0.5}}>·</span>
          <span>{(movie.genres||[]).slice(0,2).join(', ')}</span>
        </div>
      </div>
      {/* vote meter */}
      <div style={{display:'flex', gap: 3, alignItems:'center', flexShrink:0}}>
        {Array.from({length: total}).map((_, i) => (
          <span key={i} style={{
            width: 6, height: 18, borderRadius: 2,
            background: i < votes ? tone : 'rgba(var(--fg-rgb),0.12)',
          }}/>
        ))}
      </div>
    </button>
  );
}

// ─── Genre vote sheet — vote among the owner's genre pool ────────────
function RoomGenreVoteSheet({ room, onClose, onSaved }) {
  const RR = window.RoomRounds;
  const pool = (room.filters && room.filters.genres) || [];
  const [picked, setPicked] = React.useState(() => new Set(RR.ensure(room).myGenreVotes || []));
  const tally = RR.genreTally(room);
  const tallyMap = Object.fromEntries(tally.map(t => [t.genre, t.votes]));
  const memberVotes = RR.memberGenreVotes(room);
  // Members who voted a genre (excludes me) for the little face-count.
  const votersFor = (g) => (room.members || []).filter(mid => (memberVotes[mid] || []).includes(g)).length;

  const toggle = (g) => {
    const next = new Set(picked);
    next.has(g) ? next.delete(g) : next.add(g);
    setPicked(next);
  };
  const save = () => { RR.setMyGenreVotes(room, Array.from(picked)); onSaved?.(); };

  return (
    <div style={{
      position:'absolute', inset:0, zIndex: 200,
      background:'rgba(var(--bg-rgb),0.7)',
      backdropFilter:'blur(16px) saturate(140%)', WebkitBackdropFilter:'blur(16px) saturate(140%)',
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
    }}>
      <div className="rise" style={{
        background:'var(--ink)', borderRadius:'28px 28px 0 0', padding:'14px 0 20px',
        boxShadow:'0 -20px 40px rgba(0,0,0,0.5)',
        border:'0.5px solid rgba(var(--fg-rgb),0.10)', borderBottom: 0,
        display:'flex', flexDirection:'column', maxHeight:'82%',
      }}>
        <div style={{width: 42, height: 4, borderRadius: 2, background:'rgba(var(--fg-rgb),0.25)', margin:'0 auto 12px'}}/>
        <div style={{padding:'0 20px 4px', display:'flex', alignItems:'flex-start', justifyContent:'space-between'}}>
          <div style={{minWidth:0}}>
            <div style={{fontFamily:'var(--serif)', fontSize: 24, color:'var(--cream)', lineHeight:1.1}}>Vote genres</div>
            <div style={{fontSize: 12, color:'var(--muted)', marginTop: 4}}>Pick what you're in the mood for — the top votes shape the deck.</div>
          </div>
          <button onClick={onClose} style={{
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.09)',
            width: 34, height: 34, borderRadius: 999, color:'var(--muted)', flexShrink:0,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name="x" size={16}/>
          </button>
        </div>

        <div className="phone-scroll" style={{flex:1, overflowY:'auto', padding:'14px 20px 8px', display:'flex', flexDirection:'column', gap: 8}}>
          {pool.map(g => {
            const on = picked.has(g);
            const others = votersFor(g);
            return (
              <button key={g} onClick={()=> toggle(g)} style={{
                appearance:'none', border:`0.5px solid ${on? 'var(--red)':'rgba(var(--fg-rgb),0.12)'}`,
                background: on ? 'rgba(255,109,41,0.12)' : 'rgba(var(--fg-rgb),0.04)',
                borderRadius: 14, padding:'13px 14px', width:'100%', textAlign:'left',
                display:'flex', alignItems:'center', gap: 12, color:'var(--cream)',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink:0,
                  border:`1.5px solid ${on? 'var(--red)':'rgba(var(--fg-rgb),0.22)'}`,
                  background: on ? 'var(--red)' : 'transparent',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {on && <Icon name="check" size={12} color="#fff" stroke={3}/>}
                </div>
                <div style={{flex:1, fontWeight: 600, fontSize: 15, color: on ? 'var(--red)' : 'var(--cream)'}}>{g}</div>
                <div style={{fontSize: 11.5, color:'var(--muted)'}}>
                  {(tallyMap[g] || 0)} vote{(tallyMap[g]||0)===1?'':'s'}
                  {others > 0 ? ` · ${others} member${others===1?'':'s'}` : ''}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{padding:'10px 20px 6px'}}>
          <PrimaryBtn full onClick={save}>Save my votes{picked.size ? ` (${picked.size})` : ''}</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

// ─── Room swipe — a room-scoped deck (owner's services ∩ voted genres) ─
// Separate from the Profile swipe: each room keeps its own likes/passes/seen
// (persisted). A like on a title a member also likes flashes a group-pick cue.
function RoomSwipeScreen({ room, onBack, onReadMore }) {
  const RR = window.RoomRounds;
  const [tick, setTick] = React.useState(0);
  const [flash, setFlash] = React.useState(null);
  const deck = RR.deck(room);
  const likedCount = (RR.ensure(room).likes || []).length;

  const onSwipe = (dir, movie) => {
    if (dir === 'up') { onReadMore?.(movie); return; }
    if (dir === 'right') {
      RR.like(room, movie.id);
      const likers = RR.memberLikers(room, movie.id);
      if (likers.length > 0) {
        const total = (room.members || []).length + 1;
        const everyone = likers.length + 1 >= total;
        setFlash({ movie, n: likers.length + 1, total, everyone });
        setTimeout(()=> setFlash(null), 1600);
      }
    } else if (dir === 'left') RR.pass(room, movie.id);
    else if (dir === 'down') RR.seen(room, movie.id);
    setTick(t => t + 1);
  };

  return (
    <div className="fade-in" style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <TopBar title={room.name} subtitle={`Room swipe · ${likedCount} liked`} onBack={onBack} right={
        <button onClick={()=>{ RR.undo(room); setTick(t=>t+1); }} aria-label="Undo" style={{
          appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.09)',
          width: 36, height: 36, borderRadius: 999, color:'var(--cream)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Icon name="undo" size={16}/>
        </button>
      }/>

      {/* winning-genre + service context strip */}
      <div style={{padding:'0 18px 8px', display:'flex', gap: 6, flexWrap:'wrap', alignItems:'center'}}>
        {RR.activeGenres(room).slice(0,4).map(g => (
          <span key={g} style={{fontSize: 11, fontWeight: 600, padding:'4px 10px', borderRadius: 999, background:'rgba(255,109,41,0.12)', color:'var(--red)', border:'0.5px solid rgba(255,109,41,0.26)'}}>{g}</span>
        ))}
      </div>

      <div style={{flex:1, position:'relative'}}>
        <SwipeDeck
          key={tick}
          movies={deck}
          onSwipe={onSwipe}
          onTap={(m)=> onReadMore?.(m)}
        />

        {/* group-pick flash */}
        {flash && (
          <div className="pop" style={{
            position:'absolute', left:'50%', top: 20, transform:'translateX(-50%)', zIndex: 300,
            display:'inline-flex', alignItems:'center', gap: 8,
            padding:'10px 16px', borderRadius: 999, whiteSpace:'nowrap',
            background: flash.everyone ? room.tone : 'rgba(var(--bg-rgb),0.92)',
            color: flash.everyone ? '#fff' : 'var(--cream)',
            border:`0.5px solid ${flash.everyone ? room.tone : hexA(room.tone, 0.4)}`,
            boxShadow:'0 12px 30px rgba(0,0,0,0.45)', fontSize: 13, fontWeight: 700,
          }}>
            <span style={{fontSize: 15}}>{flash.everyone ? '🎉' : '🍿'}</span>
            {flash.everyone ? "Everyone's in on this!" : `Group pick · ${flash.n} of ${flash.total} want it`}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { RoomsScreen, RoomDetailScreen, CreateRoomScreen, ShareRoomSheet, RoomSettingsSheet, RoomsCalendar, CalendarSheet, collectMovieNights, roomCode, roomLink, RoundResultRow, RoomGenreVoteSheet, RoomSwipeScreen });
