// search-readmore.jsx — Search screen + Read More sheet

// ─── Read More sheet (swipe up) ─────────────────────────────────────
function ReadMoreSheet({ movie, onClose, onLike, onPass }) {
  if (!movie) return null;

  // Mock cast — in production fetched from TMDB /movie/{id}/credits
  const CAST = [
    { name: 'Lena Ortiz',  role: 'Maya' },
    { name: 'Daniel Cole', role: 'Theo' },
    { name: 'Aiko Mori',   role: 'June' },
    { name: 'Marcus Webb', role: 'Mr. Cole' },
  ];

  const posterSrc = movie.posterUrl || movie.backdropUrl || null;
  const isSeries = movie.type === 'series';
  const lengthText = isSeries
    ? `${movie.seasons || 1} season${(movie.seasons || 1) > 1 ? 's' : ''}${movie.episodes ? ` · ${movie.episodes} episodes` : ''}`
    : `${Math.floor((movie.runtime || 120) / 60)}h ${(movie.runtime || 120) % 60}m`;
  // Only show streaming services we have a logo/chip for.
  const knownWhere = (movie.where || []).filter(n => window.SERVICES && window.SERVICES[n]);

  // Movie-night booking — pick a date to watch this title (persisted per movie).
  const schedKey = `matchdoo.schedule.${movie.id}`;
  const [sched, setSched] = React.useState(() => { try { return localStorage.getItem(schedKey) || ''; } catch { return ''; } });
  const saveSched = (v) => { setSched(v); try { v ? localStorage.setItem(schedKey, v) : localStorage.removeItem(schedKey); } catch {} };
  const schedLabel = sched ? new Date(sched + 'T00:00:00').toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' }) : '';

  // ── Draggable bottom-sheet with 3 snap points ────────────────────
  //   full  : sheet expanded near the top for long reading
  //   half  : initial state (~60% — poster stays visible above)
  //   closed: swiped down past half → dismiss
  const wrapRef   = React.useRef(null);   // measures the device viewport height
  const panelRef  = React.useRef(null);   // the sheet panel (also captures the pointer)
  const scrollRef = React.useRef(null);   // inner scroll container
  const drag      = React.useRef(null);   // live gesture bookkeeping
  const yRef      = React.useRef(3000);   // live translateY (synchronous — read on release)
  const [H, setH] = React.useState(0);    // viewport height in px
  const [y, setYState] = React.useState(3000); // panel translateY (starts off-screen for the entry slide)
  const [snap, setSnap]         = React.useState('half');
  const [dragging, setDragging] = React.useState(false);
  // Keep the ref and the state in lock-step so a fast flick (where pointerup
  // fires before React re-renders) still reads the true resting position.
  const setY = (v) => { yRef.current = v; setYState(v); };

  // Snap positions expressed as the panel's translateY (0 = fully raised).
  const posFull = Math.round(H * 0.06);   // leaves the status bar + a sliver of poster
  const posHalf = Math.round(H * 0.42);   // initial — poster visible above
  const EASE    = 'transform 0.44s cubic-bezier(0.22, 1, 0.36, 1)';

  // Measure the viewport once mounted (and on resize).
  React.useLayoutEffect(() => {
    const measure = () => { const h = wrapRef.current?.clientHeight || 0; if (h) setH(h); };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Entry: slide up from off-screen to the half snap once we know the height.
  React.useEffect(() => {
    if (!H) return;
    const id = requestAnimationFrame(() => setY(Math.round(H * 0.42)));
    return () => cancelAnimationFrame(id);
  }, [H]);

  // Animate down, then unmount.
  const close = React.useCallback(() => {
    setDragging(false);
    setY(H ? H + 40 : 3000);
    const t = setTimeout(onClose, 320);
    return () => clearTimeout(t);
  }, [H, onClose]);

  const snapTo = (target, name) => { setDragging(false); setSnap(name); setY(target); };

  const onDown = (e, fromHandle) => {
    drag.current = {
      py: e.clientY, ty: yRef.current,
      scroll: scrollRef.current?.scrollTop || 0,
      active: !!fromHandle, id: e.pointerId,
    };
    if (fromHandle) {
      setDragging(true);
      try { panelRef.current?.setPointerCapture(e.pointerId); } catch {}
    }
  };
  const onMove = (e) => {
    const d = drag.current; if (!d) return;
    const dy = e.clientY - d.py;
    if (!d.active) {
      // Started on the scrollable content — only steal the gesture for the
      // sheet when the user pulls DOWN while the scroll is already at the top.
      if (snap === 'full') {
        if (d.scroll <= 0 && dy > 4) {
          d.active = true; setDragging(true);
          try { panelRef.current?.setPointerCapture(e.pointerId); } catch {}
        } else return; // let the ScrollView scroll natively
      } else {
        // At half the content isn't scrollable → any drag moves the sheet.
        if (Math.abs(dy) > 4) {
          d.active = true; setDragging(true);
          try { panelRef.current?.setPointerCapture(e.pointerId); } catch {}
        } else return;
      }
    }
    e.preventDefault();
    setY(Math.min(H + 40, Math.max(posFull, d.ty + dy)));
  };
  const onUp = () => {
    const d = drag.current; drag.current = null;
    if (!d || !d.active) return;
    // Decide the resting snap from the live release position (ref, not state).
    const ny = yRef.current;
    if (ny > posHalf + Math.round(H * 0.13)) { close(); return; }
    const mid = (posFull + posHalf) / 2;
    if (ny < mid) snapTo(posFull, 'full');
    else { if (scrollRef.current) scrollRef.current.scrollTop = 0; snapTo(posHalf, 'half'); }
  };

  return (
    <div ref={wrapRef} className="fade-in" onClick={close} style={{
      position:'absolute', inset: 0, zIndex: 250,
    }}>
      {/* The movie poster stays visible above the sheet */}
      <div style={{position:'absolute', inset: 0, overflow:'hidden'}}>
        {posterSrc ? (
          <img src={posterSrc} alt={movie.title} style={{
            position:'absolute', inset:0, width:'100%', height:'100%',
            objectFit:'cover', objectPosition:'center 18%',
          }}/>
        ) : (
          <div style={{position:'absolute', inset:0}}>
            <Poster movie={movie} size="lg" hideTitle/>
          </div>
        )}
        {/* light dim on the poster + blend the bottom into the sheet */}
        <div style={{
          position:'absolute', inset: 0,
          background:'linear-gradient(180deg, rgba(var(--bg-rgb),0.28) 0%, rgba(var(--bg-rgb),0.08) 22%, rgba(var(--bg-rgb),0.5) 66%, var(--ink) 100%)',
          pointerEvents:'none',
        }}/>
      </div>

      {/* Close button, floating over the poster */}
      <button onClick={close} style={{
        appearance:'none', border:0, zIndex: 8,
        position:'absolute', top: 18, right: 18,
        background:'rgba(var(--bg-rgb),0.7)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
        color:'var(--cream)', width: 38, height: 38, borderRadius: 999,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon name="x" size={18}/>
      </button>

      {/* Bottom sheet — drag the handle (or pull down from the top of the
          content) to move between snap points. */}
      <div
        ref={panelRef}
        onClick={e=>e.stopPropagation()}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{
          position:'absolute', left: 0, right: 0, top: 0, height: H || '100%',
          transform:`translateY(${y}px)`,
          transition: dragging ? 'none' : EASE,
          background:'var(--ink)', borderRadius:'26px 26px 0 0',
          overflow:'hidden', display:'flex', flexDirection:'column',
          boxShadow:'0 -24px 60px rgba(0,0,0,0.6)',
          border:'0.5px solid rgba(var(--fg-rgb),0.12)', borderBottom: 0,
          willChange:'transform',
        }}>
      {/* grab handle — dedicated drag hit area */}
      <div
        onPointerDown={(e)=>onDown(e, true)}
        style={{
          flexShrink: 0, padding:'8px 0 6px', cursor:'grab',
          touchAction:'none', display:'flex', justifyContent:'center',
        }}>
        <div style={{
          width: 42, height: 4, borderRadius: 2,
          background:'rgba(var(--fg-rgb),0.35)',
        }}/>
      </div>

      <div
        ref={scrollRef}
        onPointerDown={(e)=>onDown(e, false)}
        className="phone-scroll"
        style={{
          flex:1, overflowY: snap==='full' ? 'auto' : 'hidden',
          touchAction: snap==='full' ? 'pan-y' : 'none',
          padding:'6px 24px 132px', position:'relative', zIndex: 2,
        }}>
        <div style={{
          fontFamily:'var(--serif)', fontSize: 38, lineHeight: 0.96,
          color:'var(--cream)', letterSpacing:'-0.02em',
        }}>{movie.title}</div>

        <div style={{
          display:'flex', alignItems:'center', gap: 8, marginTop: 8,
          fontSize: 12, color:'var(--muted)', letterSpacing:'0.06em', textTransform:'uppercase',
        }}>
          <span style={{
            padding:'2px 8px', borderRadius: 5,
            background: isSeries ? 'rgba(224,149,94,0.18)' : 'rgba(253,166,90,0.18)',
            border:`0.5px solid ${isSeries ? 'rgba(224,149,94,0.4)' : 'rgba(253,166,90,0.4)'}`,
            color: isSeries ? '#E0955E' : '#FDA65A',
            fontSize: 10, fontWeight: 700, letterSpacing:'0.08em',
          }}>{isSeries ? 'SERIES' : 'MOVIE'}</span>
          <span>{movie.year}</span><span>·</span>
          <span>{lengthText}</span><span>·</span>
          <span>{movie.genres?.join(', ')}</span>
        </div>

        {/* Streaming tag — where to watch, right up top for easy reading */}
        <div style={{display:'flex', alignItems:'center', gap: 8, marginTop: 14, flexWrap:'wrap'}}>
          {knownWhere.length > 0 ? (
            knownWhere.map(s => (
              <div key={s} style={{
                display:'inline-flex', alignItems:'center', gap: 8,
                padding:'6px 13px 6px 6px', borderRadius: 999,
                background:'rgba(240,178,74,0.10)',
                border:'0.5px solid rgba(240,178,74,0.30)',
              }}>
                <ServiceChip name={s} size={20}/>
                <span style={{fontSize: 12.5, fontWeight: 600, color:'var(--cream)'}}>{s}</span>
              </div>
            ))
          ) : (
            <div style={{
              display:'inline-flex', alignItems:'center', gap: 8,
              padding:'6px 13px', borderRadius: 999,
              background:'rgba(var(--fg-rgb),0.05)',
              border:'0.5px solid rgba(var(--fg-rgb),0.12)',
              fontSize: 12, color:'var(--muted)',
            }}>
              Not on your streaming services
            </div>
          )}
        </div>

        {/* Ratings */}
        <div style={{display:'flex', gap: 10, marginTop: 18}}>
          <RatingCard label="Rotten Tomatoes" value={`${movie.rt}%`} color="#fa320a"/>
          <RatingCard label="IMDb" value={(movie.imdb||7.5).toFixed(1)} color="#f5c518" sub="/ 10"/>
        </div>

        {/* Movie night — pick a date to watch */}
        <Section title="Movie night">
          <div style={{display:'flex', alignItems:'center', gap: 10}}>
            <label style={{
              position:'relative', flex: 1, cursor:'pointer',
              display:'flex', alignItems:'center', gap: 10,
              padding:'13px 14px', borderRadius: 14,
              background: sched ? 'rgba(240,178,74,0.10)' : 'rgba(var(--fg-rgb),0.06)',
              border:`0.5px solid ${sched ? 'rgba(240,178,74,0.35)' : 'rgba(var(--fg-rgb),0.14)'}`,
            }}>
              <Icon name="clock" size={18} color={sched ? 'var(--green)' : 'var(--muted)'}/>
              <span style={{flex:1, fontSize: 14, fontWeight: 600, color: sched ? 'var(--cream)' : 'var(--muted)'}}>
                {sched ? `Watching · ${schedLabel}` : 'Schedule a date to watch'}
              </span>
              {!sched && <Icon name="chev" size={14} color="var(--muted-2)"/>}
              <input
                type="date"
                value={sched}
                onChange={e => saveSched(e.target.value)}
                style={{position:'absolute', inset:0, opacity:0, cursor:'pointer', width:'100%', height:'100%'}}
              />
            </label>
            {sched && (
              <button onClick={()=> saveSched('')} aria-label="Clear date" style={{
                appearance:'none', border:'0.5px solid rgba(var(--fg-rgb),0.14)',
                background:'rgba(var(--fg-rgb),0.07)', color:'var(--muted)',
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon name="x" size={16}/>
              </button>
            )}
          </div>
        </Section>

        {/* Synopsis */}
        <Section title="Synopsis">
          <p style={{
            margin: 0, fontSize: 14.5, lineHeight: 1.55, color:'var(--cream-2)',
            textWrap:'pretty',
          }}>
            {movie.synopsis || `${movie.tag} A patient, beautifully shot story about chance encounters and the small choices that change everything. Quietly devastating, full of warmth.`}
          </p>
        </Section>

        {/* Trailer */}
        <Section title="Trailer">
          <div style={{
            position:'relative', borderRadius: 16, overflow:'hidden',
            aspectRatio:'16/9', background:'#000',
          }}>
            {movie.backdropUrl ? (
              <img src={movie.backdropUrl} alt="" style={{
                position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity: 0.7,
              }}/>
            ) : (
              <Poster movie={movie} size="lg" hideTitle/>
            )}
            <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.5))'}}/>
            <button style={{
              appearance:'none', border:0, position:'absolute', top:'50%', left:'50%',
              transform:'translate(-50%,-50%)',
              width: 64, height: 64, borderRadius:'50%',
              background:'rgba(255,255,255,0.92)', color:'#17100f',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 12px 30px rgba(0,0,0,0.5)',
            }}>
              <Icon name="play" size={22} color="#17100f"/>
            </button>
            <div style={{
              position:'absolute', left: 14, bottom: 12,
              fontSize: 11, color:'#fff', opacity: 0.85,
              letterSpacing:'0.08em', textTransform:'uppercase',
            }}>2:31 · Official trailer</div>
          </div>
        </Section>

        {/* Cast */}
        <Section title="Cast">
          <div style={{
            display:'flex', gap: 12, overflowX:'auto',
            marginLeft: -24, marginRight: -24, padding:'0 24px 4px',
          }} className="phone-scroll">
            {CAST.map((c,i)=>(
              <div key={i} style={{flexShrink:0, width: 80, textAlign:'center'}}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: `hsl(${16 + i*9}, 46%, ${22 + (i%2)*5}%)`,
                  marginBottom: 8,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'var(--serif)', fontSize: 28, color:'var(--cream)',
                  border:'0.5px solid rgba(var(--fg-rgb),0.10)',
                }}>{c.name.split(' ').map(n=>n[0]).join('')}</div>
                <div style={{fontSize: 12, fontWeight: 600, color:'var(--cream)', lineHeight: 1.2}}>{c.name}</div>
                <div style={{fontSize: 11, color:'var(--muted)', marginTop: 2, lineHeight: 1.2}}>{c.role}</div>
              </div>
            ))}
          </div>
        </Section>

      </div>
      </div>{/* /sheet panel */}

      {/* Sticky bottom CTAs — pinned to the viewport so they stay visible
          at every snap point (a persistent action bar). */}
      <div onClick={e=>e.stopPropagation()} style={{
        position:'absolute', left: 0, right: 0, bottom: 0, zIndex: 12,
        padding:'22px 16px 26px',
        background:'linear-gradient(180deg, rgba(var(--bg-rgb),0) 0%, var(--ink) 42%)',
        display:'flex', gap: 10, pointerEvents:'none',
      }}>
        <button onClick={onPass} style={{
          appearance:'none', flex: 1, height: 52, borderRadius: 999, pointerEvents:'auto',
          background:'rgba(var(--fg-rgb),0.10)', color:'var(--cream)',
          border:'0.5px solid rgba(var(--fg-rgb),0.16)',
          backdropFilter:'blur(20px) saturate(160%)',
          WebkitBackdropFilter:'blur(20px) saturate(160%)',
          fontFamily:'var(--sans)', fontWeight: 600, fontSize: 15,
          display:'inline-flex', alignItems:'center', justifyContent:'center', gap: 8,
        }}>
          <Icon name="x" size={16}/> Pass
        </button>
        <button onClick={onLike} style={{
          appearance:'none', flex: 1, height: 52, borderRadius: 999, pointerEvents:'auto',
          background:'var(--red)', color:'#fff',
          border:0, fontFamily:'var(--sans)', fontWeight: 600, fontSize: 15,
          display:'inline-flex', alignItems:'center', justifyContent:'center', gap: 8,
          boxShadow:'0 8px 24px rgba(255,109,41,0.45)',
        }}>
          <Icon name="heart" size={16} color="#fff"/> Like
        </button>
      </div>
    </div>
  );
}


// ─── Search overlay ─────────────────────────────────────────────────
function SearchOverlay({ onClose, onPick }) {
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef(null);
  React.useEffect(() => { const t = setTimeout(() => inputRef.current?.focus(), 60); return () => clearTimeout(t); }, []);

  const all = window.MOVIES || [];
  const q = query.trim().toLowerCase();
  const results = q
    ? all.filter(m => (m.title || '').toLowerCase().includes(q) || (m.genres || []).some(g => g.toLowerCase().includes(q))).slice(0, 40)
    : all.slice(0, 8);

  return (
    <div className="fade-in" style={{
      position:'absolute', inset:0, zIndex: 300,
      background:'rgba(var(--bg-rgb),0.92)',
      backdropFilter:'blur(28px) saturate(150%)', WebkitBackdropFilter:'blur(28px) saturate(150%)',
      display:'flex', flexDirection:'column',
    }}>
      {/* Close (X) top-right */}
      <div style={{display:'flex', justifyContent:'flex-end', padding:'16px 18px 0'}}>
        <button onClick={onClose} aria-label="Close search" style={{
          appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.09)',
          width: 40, height: 40, borderRadius: 999, color:'var(--cream)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Icon name="x" size={20}/>
        </button>
      </div>

      {/* Big centered input */}
      <div style={{padding:'18px 24px 10px'}}>
        <div style={{fontSize: 11, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--muted)', marginBottom: 12}}>Search</div>
        <div style={{
          display:'flex', alignItems:'center', gap: 12,
          borderBottom:'2px solid var(--red)', paddingBottom: 12,
        }}>
          <Icon name="search" size={26} color="var(--red)"/>
          <input
            ref={inputRef}
            placeholder="Films & series…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex:1, background:'transparent', border:0, outline:0,
              color:'var(--cream)', fontFamily:'var(--serif)', fontSize: 30,
              letterSpacing:'-0.02em',
            }}
          />
          {query && (
            <button onClick={()=> setQuery('')} style={{
              appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.1)',
              width: 28, height: 28, borderRadius: 999, color:'var(--muted)',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0,
            }}>
              <Icon name="x" size={14}/>
            </button>
          )}
        </div>
      </div>

      <div className="phone-scroll" style={{flex:1, overflowY:'auto', padding:'8px 18px 40px'}}>
        <div style={{fontSize: 12, color:'var(--muted)', padding:'6px 6px 12px'}}>
          {q ? `${results.length} result${results.length===1?'':'s'}` : 'Popular right now'}
        </div>
        <div style={{display:'flex', flexDirection:'column', gap: 8}}>
          {results.map(m => (
            <button key={m.id} onClick={()=> onPick(m)} style={{
              appearance:'none', border:0, background:'linear-gradient(160deg, rgba(var(--fg-rgb),0.10), rgba(var(--fg-rgb),0.035))', backdropFilter:'blur(18px) saturate(150%)', WebkitBackdropFilter:'blur(18px) saturate(150%)',
              borderRadius: 14, padding:'8px 10px', textAlign:'left',
              display:'flex', alignItems:'center', gap: 12, width:'100%', color:'var(--cream)', cursor:'pointer',
            }}>
              <div style={{width: 52, height: 78, borderRadius: 9, overflow:'hidden', flexShrink:0}}>
                <Poster movie={m} size="sm" hideTitle style={{width:'100%', height:'100%'}}/>
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontFamily:'var(--serif)', fontSize: 19, lineHeight: 1.05, letterSpacing:'-0.01em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{m.title}</div>
                <div style={{fontSize: 11, color:'var(--muted)', marginTop: 4, letterSpacing:'0.05em', textTransform:'uppercase'}}>
                  {m.year} · {m.type === 'series' ? `${m.seasons||1} seasons` : (m.genres?.[0] || 'Film')} · {m.rt}% RT
                </div>
              </div>
              <Icon name="chev" size={14} color="var(--muted-2)"/>
            </button>
          ))}
        </div>
        {q && results.length === 0 && (
          <div style={{textAlign:'center', padding:'40px 20px', color:'var(--muted)', fontSize: 13}}>
            No results for "<span style={{color:'var(--cream)'}}>{query}</span>". Try another title or genre.
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ReadMoreSheet, SearchOverlay });
