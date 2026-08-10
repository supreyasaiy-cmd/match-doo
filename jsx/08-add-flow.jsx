// add-flow.jsx — Add room members sheet

// helper
function hexA(hex, a) {
  if (!hex || !hex.startsWith('#')) return hex;
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// ─── Add members to room sheet ──────────────────────────────────────
function AddRoomMembersSheet({ room, onClose, onAdd }) {
  const allFriends = ALL_FRIENDS_LIST_HELPER();
  // Exclude existing room members
  const eligible = allFriends.filter(f => !(room.members || []).includes(f.id));
  const [selected, setSelected] = React.useState(new Set());
  const [query, setQuery] = React.useState('');

  const filtered = eligible.filter(f =>
    !query || f.name.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  return (
    <div style={{
      position:'absolute', inset:0, zIndex: 200,
      background:'rgba(var(--bg-rgb),0.7)',
      backdropFilter:'blur(16px) saturate(140%)',
      WebkitBackdropFilter:'blur(16px) saturate(140%)',
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
    }}>
      <div className="rise" style={{
        background:'var(--ink)',
        borderRadius:'28px 28px 0 0',
        padding:'14px 0 20px',
        boxShadow:'0 -20px 40px rgba(0,0,0,0.5)',
        border:'0.5px solid rgba(var(--fg-rgb),0.10)', borderBottom: 0,
        display:'flex', flexDirection:'column',
        maxHeight:'80%',
      }}>
        <div style={{
          width: 42, height: 4, borderRadius: 2,
          background:'rgba(var(--fg-rgb),0.25)', margin:'0 auto 12px',
        }}/>

        <div style={{padding:'0 20px 6px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div>
            <div style={{fontFamily:'var(--serif)', fontSize: 24, color:'var(--cream)', lineHeight: 1.1}}>{tr("am.addTo","Add to")} {room.name}</div>
            <div style={{fontSize: 12, color:'var(--muted)', marginTop: 4}}>{selected.size} {tr("am.selected","selected")}</div>
          </div>
          <button onClick={onClose} style={{
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.09)',
            width: 34, height: 34, borderRadius: 999, color:'var(--muted)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name="x" size={16}/>
          </button>
        </div>

        <div style={{padding:'12px 20px 12px'}}>
          <div style={{
            display:'flex', alignItems:'center', gap: 10,
            background:'rgba(var(--fg-rgb),0.07)',
            border:'0.5px solid rgba(var(--fg-rgb),0.10)',
            borderRadius: 12, padding:'10px 14px',
          }}>
            <Icon name="search" size={16} color="var(--muted)"/>
            <input
              autoFocus
              placeholder={tr("am.searchFriends","Search friends")}
              value={query}
              onChange={e=>setQuery(e.target.value)}
              style={{
                flex:1, background:'transparent', border:0, outline:0,
                color:'var(--cream)', fontFamily:'var(--sans)', fontSize: 14,
              }}
            />
          </div>
        </div>

        <div className="phone-scroll" style={{flex:1, overflowY:'auto', padding:'0 20px 10px'}}>
          {filtered.length === 0 ? (
            <div style={{
              padding:'24px 20px', textAlign:'center', color:'var(--muted)', fontSize: 13, lineHeight: 1.5,
            }}>
              {eligible.length === 0
                ? tr("am.everyoneIn","Everyone you know is already in this room.")
                : tr("am.noMatch","No friends match your search.")}
            </div>
          ) : filtered.map(f => {
            const on = selected.has(f.id);
            return (
              <button key={f.id} onClick={()=>toggle(f.id)} style={{
                appearance:'none', border:0, background:'transparent',
                display:'flex', alignItems:'center', gap: 12, width:'100%',
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

        <div style={{padding:'10px 20px 6px', display:'flex', gap: 8}}>
          <PrimaryBtn full disabled={selected.size === 0} onClick={()=> onAdd(Array.from(selected))}>
            {tr("am.add","Add")} {selected.size > 0 ? `(${selected.size})` : ""}
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

// local helper — read at call time so it picks up freshly added friends
function ALL_FRIENDS_LIST_HELPER() {
  return [
    ...(window.FRIENDS.couple || []),
    ...(window.FRIENDS.family || []),
    ...(window.FRIENDS.friends || []),
  ];
}

Object.assign(window, { AddRoomMembersSheet });
