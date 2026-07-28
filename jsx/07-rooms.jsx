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
      tone: '#E17F5C', matchCount: 5, watchDate: _isoSeed(_seedSat),
    },
    {
      id: 'r2', name: 'Family Night', emoji: '🍿',
      type: 'family', members: ['f2','f3','f4'], lastActivity: '2h ago',
      tone: '#F0AC72', matchCount: 3, watchDate: _isoSeed(_seedFri),
    },
    {
      id: 'r3', name: 'Friday Crew', emoji: '🎬',
      type: 'friends', members: ['f5','f6','f7'], lastActivity: 'Yesterday',
      tone: '#93A8E8', matchCount: 11,
    },
    {
      id: 'r4', name: 'Owen & Mira', emoji: '✨',
      type: 'friends', members: ['f5','f6'], lastActivity: '3d ago',
      tone: '#86A6DD', matchCount: 7,
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
    if (d) out.push({ date: d, kind: 'room', room: r, tone: r.tone || '#E17F5C', title: r.name, sub: 'Movie night', emoji: r.emoji || '🎬' });
  }
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || k.indexOf('matchdoo.schedule.') !== 0) continue;
      const d = localStorage.getItem(k);
      if (!d) continue;
      const id = k.slice('matchdoo.schedule.'.length);
      const m = (window.MOVIES || []).find(x => x.id === id);
      out.push({ date: d, kind: 'movie', movie: m, tone: '#7ED9B4', title: m ? m.title : 'A film', sub: 'Watching solo', emoji: '🎬' });
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
      background:'rgba(var(--fg-rgb),0.04)',
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
          appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.06)',
          width: 28, height: 28, borderRadius: 999, color:'var(--cream)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}><Icon name="chevl" size={14}/></button>
        <div style={{fontSize: 12.5, fontWeight: 600, color:'var(--cream)', minWidth: 104, textAlign:'center'}}>{monthLabel}</div>
        <button onClick={()=>shift(1)} aria-label="Next month" style={{
          appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.06)',
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
              background: isSel ? hexA('#E17F5C', 0.14) : 'transparent',
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
            background:'rgba(var(--fg-rgb),0.08)', color:'var(--cream)',
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
function RoomsScreen({ onOpenRoom, onCreateRoom, onAddFriend, onOpenCalendar, banner }) {
  const [query, setQuery] = React.useState('');
  const rooms = window.ROOMS.filter(r =>
    !query || r.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <TopBar
        title="Rooms" large
        subtitle="Group your people, swipe together"
      />

      {/* Primary actions — both clearly clickable up top */}
      <div style={{padding:'2px 18px 12px', display:'flex', gap: 8}}>
        <button onClick={onCreateRoom} style={{
          appearance:'none', border:0, flex: 1.4,
          background:'var(--red)', color:'#fff',
          padding:'12px 14px', borderRadius: 999,
          fontFamily:'var(--sans)', fontWeight: 600, fontSize: 14,
          display:'inline-flex', alignItems:'center', justifyContent:'center', gap: 8,
          boxShadow:'0 6px 18px rgba(225,127,92,0.35)',
        }}>
          <Icon name="plus" size={16} stroke={2.4} color="#fff"/>
          Create room
        </button>
        <button onClick={onOpenCalendar} aria-label="Movie nights calendar" style={{
          appearance:'none', border:'0.5px solid rgba(var(--fg-rgb),0.18)',
          width: 48, flexShrink: 0, background:'rgba(var(--fg-rgb),0.06)', color:'var(--cream)',
          borderRadius: 999, padding: 0, lineHeight: 0,
          display:'inline-flex', alignItems:'center', justifyContent:'center',
        }}>
          {/* 1px optical nudge: the calendar glyph's top tabs read top-heavy */}
          <span style={{display:'flex', transform:'translateY(1px)'}}>
            <Icon name="calendar" size={19}/>
          </span>
        </button>
        <button onClick={onAddFriend} style={{
          appearance:'none', border:'0.5px solid rgba(var(--fg-rgb),0.18)',
          flex: 1, background:'rgba(var(--fg-rgb),0.06)', color:'var(--cream)',
          padding:'12px 14px', borderRadius: 999,
          fontFamily:'var(--sans)', fontWeight: 600, fontSize: 14,
          display:'inline-flex', alignItems:'center', justifyContent:'center', gap: 8,
        }}>
          <Icon name="user" size={15}/>
          Add friend
        </button>
      </div>

      {banner && <div style={{padding:'0 18px 12px'}}>{banner}</div>}

      <div style={{padding:'0 18px 12px'}}>
        <div style={{
          display:'flex', alignItems:'center', gap: 10,
          background:'rgba(var(--fg-rgb),0.06)',
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

      <div className="phone-scroll" style={{flex:1, overflowY:'auto', padding:'4px 18px 130px'}}>
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
      background:'rgba(var(--fg-rgb),0.04)',
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
          <span style={{textTransform:'capitalize'}}>{room.type === 'couple' ? 'Partner' : room.type}</span>
          <span>·</span>
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
function RoomDetailScreen({ room: initialRoom, onBack, onOpenMovie }) {
  const [room, setRoom] = React.useState(initialRoom);
  const [showAddMembers, setShowAddMembers] = React.useState(false);
  const [showShare, setShowShare] = React.useState(false);
  const [memberToast, setMemberToast] = React.useState('');

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

  // Compute room mutual likes = intersection across all members + me
  const myLikes = new Set(['m1','m2','m9','m11']); // hardcoded sample; in app comes from state
  const allLikes = members.map(m => new Set(window.MATCHES[m.id]?.movieIds || []));
  const intersect = (window.MOVIES || []).filter(mov =>
    myLikes.has(mov.id) && allLikes.every(s => s.has(mov.id))
  );
  // Things some but not all liked → "almost a match"
  const partial = (window.MOVIES || []).filter(mov => {
    if (intersect.find(i=>i.id===mov.id)) return false;
    const count = (myLikes.has(mov.id)?1:0) + allLikes.filter(s => s.has(mov.id)).length;
    return count >= 2 && count < members.length + 1;
  }).slice(0, 8);

  return (
    <div className="fade-in" style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <TopBar title="" onBack={onBack} right={
        <div style={{display:'flex', alignItems:'center', gap: 8}}>
          <button onClick={()=> setShowShare(true)} aria-label="Share room" style={{
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.08)',
            width: 36, height: 36, borderRadius: 999, color:'var(--cream)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name="share" size={16}/>
          </button>
          <button style={{
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.08)',
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
          {room.type === 'couple' ? 'Partner' : room.type} · {members.length} {members.length===1?'member':'members'} · {room.lastActivity}
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
          background:'rgba(var(--fg-rgb),0.04)',
          border:'0.5px solid rgba(var(--fg-rgb),0.08)',
          borderRadius: 16,
        }}>
          <Stat label="Group matches" value={intersect.length}/>
          <div style={{width:0.5, background:'var(--line)'}}/>
          <Stat label="Almost there" value={partial.length}/>
          <div style={{width:0.5, background:'var(--line)'}}/>
          <Stat label="Members" value={members.length}/>
        </div>
      </div>

      <div className="phone-scroll" style={{flex:1, overflowY:'auto', padding:'0 0 130px'}}>
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
                  appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.08)',
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
                background:'rgba(var(--fg-rgb),0.06)', color:'var(--cream)',
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

        <Section title="Group matches" caption={`Everyone in the room wants to watch these (${intersect.length})`}>
          {intersect.length === 0 ? (
            <EmptySectionRow text="No films yet — keep swiping. When everyone in the room likes the same title, it'll show up here."/>
          ) : (
            <PosterRow movies={intersect} onTap={(m)=>onOpenMovie(m, room)}/>
          )}
        </Section>

        <Section title="Almost a match" caption="Most of the room wants these — convince the holdouts">
          {partial.length === 0 ? (
            <EmptySectionRow text="Once 2+ members agree, picks land here."/>
          ) : (
            <PosterRow movies={partial} onTap={(m)=>onOpenMovie(m, room)} dim/>
          )}
        </Section>
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

      {memberToast && (
        <div className="rise" style={{
          position:'absolute', left:'50%', bottom: 30, transform:'translateX(-50%)',
          padding:'10px 16px', borderRadius: 999,
          background:'rgba(var(--bg-rgb),0.92)',
          backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
          border:'0.5px solid rgba(126,217,180,0.40)',
          color:'var(--cream)', fontSize: 12.5, fontWeight: 500,
          zIndex: 220, display:'inline-flex', alignItems:'center', gap: 8,
          boxShadow:'0 12px 30px rgba(0,0,0,0.4)',
        }}>
          <Icon name="check" size={14} color="#7ED9B4" stroke={2.6}/>
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
  const [type, setType] = React.useState('friends');
  const [selected, setSelected] = React.useState(new Set());
  const allFriends = ALL_FRIENDS();
  const EMOJI_OPTS = ['🎬','🍿','✨','🌸','🎟️','🎭','🌙','🍕','☕','🔥','🎉','💫'];

  const toggle = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const TONES = { couple:'#E17F5C', family:'#F0AC72', friends:'#93A8E8' };

  const canCreate = name.trim().length >= 2 && selected.size >= 1;

  return (
    <div className="fade-in" style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <TopBar title="New room" onBack={onBack}/>

      <div className="phone-scroll" style={{flex:1, overflowY:'auto', padding:'4px 18px 110px'}}>
        {/* Emoji + name */}
        <div style={{
          padding:'18px 16px', borderRadius: 18,
          background:'rgba(var(--fg-rgb),0.04)',
          border:'0.5px solid rgba(var(--fg-rgb),0.10)',
          display:'flex', alignItems:'center', gap: 12,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: `linear-gradient(135deg, ${hexA(TONES[type], 0.4)}, ${hexA(TONES[type], 0.1)})`,
            border: `0.5px solid ${hexA(TONES[type], 0.4)}`,
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

        {/* Type */}
        <div style={{marginTop: 22}}>
          <div style={{fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)', marginBottom: 10}}>
            Type
          </div>
          <div style={{display:'flex', gap: 6}}>
            {[
              { id:'friends', label:'Friends', tone:'#93A8E8'},
              { id:'family',  label:'Family',  tone:'#F0AC72'},
              { id:'couple',  label:'Partner', tone:'#E17F5C'},
            ].map(o=>{
              const on = type === o.id;
              return (
                <button key={o.id} onClick={()=>setType(o.id)} style={{
                  appearance:'none', border:`0.5px solid ${on? o.tone : 'rgba(var(--fg-rgb),0.12)'}`,
                  background: on ? hexA(o.tone, 0.12) : 'rgba(var(--fg-rgb),0.03)',
                  color: on ? o.tone : 'var(--cream)',
                  flex:1, padding:'12px 8px', borderRadius: 12,
                  fontFamily:'var(--sans)', fontWeight: 600, fontSize: 13,
                }}>{o.label}</button>
              );
            })}
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
                    <div style={{fontSize: 12, color:'var(--muted)', textTransform:'capitalize'}}>{f.rel}</div>
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
          const tone = TONES[type];
          const newRoom = {
            id: 'r' + Date.now(), name: name.trim(), emoji,
            type, members: Array.from(selected), lastActivity: 'Just now',
            tone, matchCount: 0,
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
  const tone = room.tone || '#E17F5C';

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
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.08)',
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
                color:'#0b0f18', textAlign:'center',
              }}>
                <Icon name="qr" size={64} color="#0b0f18" stroke={1.4}/>
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
            background:'rgba(var(--fg-rgb),0.06)', color:'var(--cream)',
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
            border:'0.5px solid rgba(126,217,180,0.40)',
            color:'var(--cream)', fontSize: 12.5, fontWeight: 500,
            zIndex: 220, display:'inline-flex', alignItems:'center', gap: 8,
            boxShadow:'0 12px 30px rgba(0,0,0,0.4)', whiteSpace:'nowrap',
          }}>
            <Icon name="check" size={14} color="#7ED9B4" stroke={2.6}/>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { RoomsScreen, RoomDetailScreen, CreateRoomScreen, ShareRoomSheet, RoomsCalendar, CalendarSheet, collectMovieNights, roomCode, roomLink });
