// add-flow.jsx — Category picker for adding friends + Add room members sheet

// ─── Category picker bottom-sheet ───────────────────────────────────
function CategoryPickerSheet({ person, onClose, onPick }) {
  if (!person) return null;
  const OPTIONS = [
    { id:'friends', label:'Friend',  desc:"Casual movie nights, weekend hangs.", tone:'#E0955E', icon:'users' },
    { id:'family',  label:'Family',  desc:"Parents, siblings, cousins.",          tone:'#FDA65A', icon:'home' },
    { id:'couple',  label:'Partner', desc:"Just the two of you.",                 tone:'#FF6D29', icon:'heart' },
  ];

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
        border:'0.5px solid rgba(var(--fg-rgb),0.10)',
        borderBottom: 0,
      }}>
        <div style={{
          width: 42, height: 4, borderRadius: 2,
          background:'rgba(var(--fg-rgb),0.25)', margin:'0 auto 14px',
        }}/>

        <div style={{display:'flex', alignItems:'center', gap: 12, marginBottom: 6}}>
          <Avatar person={person} size={48}/>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontFamily:'var(--serif)', fontSize: 22, lineHeight: 1.1, color:'var(--cream)'}}>{person.name}</div>
            <div style={{fontSize: 12, color:'var(--muted)', marginTop: 2}}>{person.handle || person.phone}</div>
          </div>
        </div>

        <div style={{
          fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase',
          color:'var(--muted)', margin:'18px 0 10px',
        }}>Add as…</div>

        <div style={{display:'flex', flexDirection:'column', gap: 8}}>
          {OPTIONS.map(o => (
            <button key={o.id} onClick={()=>onPick(o.id)} style={{
              appearance:'none', border:`0.5px solid ${hexA(o.tone, 0.35)}`,
              background: hexA(o.tone, 0.10),
              padding:'14px 14px', borderRadius: 14, textAlign:'left',
              display:'flex', alignItems:'center', gap: 12,
              color:'var(--cream)',
            }}>
              <IconBadge icon={o.icon} size={38} tone={o.tone}/>
              <div style={{flex:1, minWidth: 0}}>
                <div style={{fontFamily:'var(--sans)', fontWeight: 600, fontSize: 15, color: o.tone}}>{o.label}</div>
                <div style={{fontSize: 12, color:'var(--muted)', marginTop: 2}}>{o.desc}</div>
              </div>
              <Icon name="chev" size={14} color="var(--muted-2)"/>
            </button>
          ))}
        </div>

        <button onClick={onClose} style={{
          appearance:'none', border:0, background:'transparent',
          marginTop: 14, width:'100%', padding:'10px',
          color:'var(--muted)', fontFamily:'var(--sans)', fontSize: 14,
        }}>Cancel</button>
      </div>
    </div>
  );
}

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
            <div style={{fontFamily:'var(--serif)', fontSize: 24, color:'var(--cream)', lineHeight: 1.1}}>Add to {room.name}</div>
            <div style={{fontSize: 12, color:'var(--muted)', marginTop: 4}}>{selected.size} selected</div>
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
              placeholder="Search friends"
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
                ? "Everyone you know is already in this room."
                : "No friends match your search."}
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

        <div style={{padding:'10px 20px 6px', display:'flex', gap: 8}}>
          <PrimaryBtn full disabled={selected.size === 0} onClick={()=> onAdd(Array.from(selected))}>
            Add {selected.size > 0 ? `(${selected.size})` : ''}
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

Object.assign(window, { CategoryPickerSheet, AddRoomMembersSheet });
