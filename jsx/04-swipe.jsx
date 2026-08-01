// swipe.jsx — Card stack with 4-direction gestures (right=want, left=pass, up=seen, down=super)

const SWIPE_LABELS = {
  right: { text: 'LIKE',       color: '#FF6D29', rot: -8 },
  left:  { text: 'PASS',       color: '#CC8050', rot:  8 },
  up:    { text: 'READ MORE',  color: '#FDA65A', rot:  0 },
  down:  { text: 'SEEN',       color: '#E0955E', rot:  0 },
};

function SwipeCard({ movie, isTop, onSwipe, onTap, drag, setDrag, depth=0, density='regular', onOpenAdCTA }) {
  const dragging = isTop && drag !== null;
  const dx = drag?.dx || 0;
  const dy = drag?.dy || 0;
  const releaseRef = React.useRef(null);
  // Only surface streaming services we actually have a logo/chip for.
  const knownWhere = (movie.where || []).filter(n => window.SERVICES && window.SERVICES[n]);

  // For non-top cards, slight scale + offset
  const baseScale = 1 - depth * 0.04;
  const baseY = depth * 8;

  // Drag handlers
  const startRef = React.useRef(null);
  const onStart = (e) => {
    if (!isTop) return;
    const t = e.touches ? e.touches[0] : e;
    startRef.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    setDrag({ dx:0, dy:0, locked: null, releasing: null });
  };
  const onMove = (e) => {
    if (!startRef.current) return;
    const t = e.touches ? e.touches[0] : e;
    const dx = t.clientX - startRef.current.x;
    const dy = t.clientY - startRef.current.y;
    // lock direction once decisive
    let locked = drag?.locked || null;
    if (!locked && (Math.abs(dx) > 12 || Math.abs(dy) > 12)) {
      locked = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
    }
    setDrag({ dx, dy, locked, releasing: null });
  };
  const onEnd = () => {
    if (!startRef.current || !drag) return;
    const { dx, dy } = drag;
    const TH = 90;
    let dir = null;
    if (drag.locked === 'h') {
      if (dx > TH) dir = 'right';
      else if (dx < -TH) dir = 'left';
    } else if (drag.locked === 'v') {
      if (dy < -TH) dir = 'up';
      else if (dy > TH) dir = 'down';
    } else {
      if (Math.abs(dx) > TH && Math.abs(dx) > Math.abs(dy)) dir = dx > 0 ? 'right' : 'left';
      else if (Math.abs(dy) > TH) dir = dy < 0 ? 'up' : 'down';
    }
    startRef.current = null;
    if (dir === 'up') {
      // Read More — bring up the detail popup, but DON'T fling the card
      // away or consume it: snap it back and let the parent open the sheet.
      setDrag({ dx:0, dy:0, locked:null, releasing:'snap' });
      setTimeout(() => setDrag(null), 240);
      onSwipe('up', movie);
    } else if (dir) {
      setDrag({ ...drag, releasing: dir });
      setTimeout(() => onSwipe(dir, movie), 280);
    } else {
      setDrag({ dx:0, dy:0, locked:null, releasing:'snap' });
      setTimeout(() => setDrag(null), 240);
    }
  };

  // compute transform
  let translateX = dx, translateY = dy, rotate = 0, opacity = 1;
  if (drag?.releasing === 'right') { translateX = 600; translateY = dy*1.5; rotate = 24; opacity = 0; }
  else if (drag?.releasing === 'left')  { translateX = -600; translateY = dy*1.5; rotate = -24; opacity = 0; }
  else if (drag?.releasing === 'up')    { translateY = -900; rotate = 0; opacity = 0; }
  else if (drag?.releasing === 'down')  { translateY = 900; rotate = 0; opacity = 0; }
  else if (drag?.releasing === 'snap')  { translateX = 0; translateY = 0; rotate = 0; }
  else if (drag) {
    if (drag.locked === 'h') { translateY = dy * 0.2; rotate = dx * 0.07; }
    else if (drag.locked === 'v') { translateX = dx * 0.2; rotate = 0; }
    else { rotate = dx * 0.05; }
  }

  // Decide label — kick in early so it's easy to read.
  let activeLabel = null;
  if (isTop && drag && !drag.releasing) {
    if (drag.locked === 'h') activeLabel = dx > 18 ? 'right' : dx < -18 ? 'left' : null;
    else if (drag.locked === 'v') activeLabel = dy < -18 ? 'up' : dy > 18 ? 'down' : null;
  } else if (drag?.releasing && drag.releasing !== 'snap') {
    activeLabel = drag.releasing;
  }
  const dragMag = drag ? Math.abs(drag.locked === 'h' ? dx : dy) : 0;
  // Ramp up fast — visible almost immediately, full by ~90px.
  const labelOpacity = activeLabel ? (drag?.releasing ? 1 : Math.min(1, 0.55 + dragMag / 80)) : 0;
  const labelScale   = activeLabel ? Math.min(1.1, 0.9 + dragMag / 240) : 0.9;

  const transition = drag?.releasing ? 'transform .28s cubic-bezier(.4,0,.2,1), opacity .28s ease' : (drag ? 'none' : 'transform .24s ease');

  return (
    <div
      onMouseDown={isTop ? onStart : undefined}
      onMouseMove={isTop && startRef.current ? onMove : undefined}
      onMouseUp={isTop ? onEnd : undefined}
      onMouseLeave={isTop && startRef.current ? onEnd : undefined}
      onTouchStart={isTop ? onStart : undefined}
      onTouchMove={isTop ? onMove : undefined}
      onTouchEnd={isTop ? onEnd : undefined}
      onClick={isTop && !movie.__ad && Math.abs(dx) < 4 && Math.abs(dy) < 4 ? () => onTap?.(movie) : undefined}
      style={{
        position:'absolute', left:0, right:0, top:0, bottom:0,
        transform: `translate(${translateX}px, ${translateY + baseY}px) rotate(${rotate}deg) scale(${baseScale})`,
        transformOrigin: '50% 100%',
        opacity, transition,
        zIndex: 100 - depth,
        cursor: isTop ? 'grab' : 'default',
        willChange: 'transform',
      }}
    >
      <div style={{position:'relative', width:'100%', height:'100%'}}>
        {movie.__ad ? (
          <AdCardContent campaign={movie} onOpenCTA={onOpenAdCTA}/>
        ) : (
        <>
        <Poster movie={movie} size="lg" hideTitle/>
        {/* frosted blur toward the bottom so the info + buttons read clearly */}
        <div style={{
          position:'absolute', left:0, right:0, bottom:0, height: 330,
          backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
          WebkitMaskImage:'linear-gradient(to top, #000 58%, transparent 100%)',
          maskImage:'linear-gradient(to top, #000 58%, transparent 100%)',
          pointerEvents:'none',
        }}/>
        {/* gradient + meta */}
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(180deg, transparent 42%, rgba(0,0,0,0.55) 82%, rgba(0,0,0,0.8) 100%)',
          pointerEvents:'none',
        }}/>
        <div style={{
          position:'absolute', left: 22, right: 22, bottom: 118,
          color: '#f4f1ea', pointerEvents:'none',
        }}>
          <div style={{
            display:'flex', alignItems:'center', gap:8, marginBottom: 6, opacity:0.85,
            fontSize:11, letterSpacing:'0.16em', textTransform:'uppercase',
          }}>
            <span>{movie.year}</span>
            <span style={{opacity:0.5}}>·</span>
            <span>{movie.type === 'series'
              ? `${movie.seasons} Season${movie.seasons > 1 ? 's' : ''}`
              : `${Math.floor(movie.runtime/60)}h ${movie.runtime%60}m`}</span>
            <span style={{opacity:0.5}}>·</span>
            <span>{movie.rt}% RT</span>
          </div>
          {/* Movie title */}
          <div style={{
            fontFamily:'var(--serif)', fontSize: 30, lineHeight: 1.0, letterSpacing:'-0.01em',
            marginBottom: 4, textWrap:'pretty', textShadow:'0 2px 14px rgba(0,0,0,0.55)',
          }}>{movie.title}</div>
          <div style={{
            display:'flex', alignItems:'center', gap: 10, marginTop: 12,
          }}>
            <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
              {movie.genres.map(g=>(
                <span key={g} style={{
                  fontSize:11, padding:'4px 10px',
                  background:'rgba(244,241,234,0.14)',
                  border:'0.5px solid rgba(244,241,234,0.2)',
                  borderRadius:999, letterSpacing:'-0.01em', fontWeight:500,
                }}>{g}</span>
              ))}
            </div>
            <div style={{flex:1}}/>
            {knownWhere.length > 0 && (
              <div style={{
                display:'inline-flex', alignItems:'center', gap: 7,
                padding:'5px 11px 5px 6px', borderRadius: 999,
                background:'rgba(0,0,0,0.42)',
                border:'0.5px solid rgba(244,241,234,0.22)',
                backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)',
                flexShrink: 0,
              }}>
                <ServiceChip name={knownWhere[0]} size={18}/>
                <span style={{fontSize: 11.5, fontWeight: 600, letterSpacing:'-0.01em'}}>
                  {knownWhere[0]}{knownWhere.length > 1 ? ` +${knownWhere.length - 1}` : ''}
                </span>
              </div>
            )}
          </div>
        </div>
        </>
        )}

        {/* directional glow ring — grows with the swipe for motion feedback */}
        {activeLabel && (
          <div style={{
            position:'absolute', inset:0, borderRadius:24, pointerEvents:'none',
            boxShadow:`inset 0 0 0 3px ${SWIPE_LABELS[activeLabel].color}, inset 0 0 55px ${SWIPE_LABELS[activeLabel].color}66`,
            opacity: labelOpacity,
            transition: drag?.releasing ? 'opacity .28s ease' : 'none',
          }}/>
        )}

        {/* swipe stamp — bold, filled, glowing so the action is unmistakable */}
        {activeLabel && (
          <div style={{
            position:'absolute',
            top: activeLabel === 'up' ? 42 : (activeLabel === 'down' ? 'auto' : 66),
            bottom: activeLabel === 'down' ? 42 : 'auto',
            // Stamp sits on the side that stays on-screen as the card slides
            // away: LIKE on the left (swipe right), PASS on the right (swipe left).
            left: activeLabel === 'right' ? 28 : (activeLabel === 'left' ? 'auto' : '50%'),
            right: activeLabel === 'left' ? 28 : 'auto',
            transform: `${activeLabel === 'up' || activeLabel === 'down' ? 'translateX(-50%)' : ''} rotate(${SWIPE_LABELS[activeLabel].rot}deg) scale(${labelScale})`,
            transformOrigin:'center',
            opacity: labelOpacity,
            padding:'12px 22px', borderRadius: 12, whiteSpace:'nowrap',
            border:'2px solid rgba(255,255,255,0.92)',
            color:'#fff', background: SWIPE_LABELS[activeLabel].color,
            fontFamily:'var(--sans)', fontWeight: 800, fontSize: 22, letterSpacing:'0.06em',
            boxShadow:`0 0 30px ${SWIPE_LABELS[activeLabel].color}cc, 0 8px 22px rgba(0,0,0,0.45)`,
            transition: drag?.releasing ? 'opacity .28s ease, transform .28s ease' : 'none',
            pointerEvents:'none',
          }}>
            {SWIPE_LABELS[activeLabel].text}
          </div>
        )}
      </div>
    </div>
  );
}

function SwipeDeck({ movies, onSwipe, onTap, density='regular', ads=[], adCadence=0, onOpenAdCTA }) {
  const [drag, setDrag] = React.useState(null);
  const [swipeCount, setSwipeCount] = React.useState(0);
  const [pendingAd, setPendingAd] = React.useState(null);
  const adRotationRef = React.useRef(0);

  // The deck is driven purely by `movies` (the parent removes liked/passed/
  // seen titles) — no internal index, so nothing gets skipped and Undo can
  // simply re-add a title to bring it back to the top.
  const maybeQueueAd = (nextCount) => {
    if (adCadence > 0 && ads.length > 0 && nextCount >= adCadence) {
      const ad = ads[adRotationRef.current % ads.length];
      adRotationRef.current += 1;
      setPendingAd({ ...ad, id: `ad-${ad.id}-${Date.now()}`, __ad: true });
      return 0;
    }
    return nextCount;
  };

  const handleSwipe = (dir, item) => {
    if (item?.__ad) {
      setPendingAd(null);
      setDrag(null);
      return;
    }
    if (dir === 'up') {
      // Read More — open the detail popup, keep the card on top (non-consuming)
      onSwipe?.('up', item);
      return;
    }
    onSwipe?.(dir, item);
    setDrag(null);
    setSwipeCount(c => maybeQueueAd(c + 1));
  };

  // Programmatic swipe from buttons
  const programmatic = (dir) => {
    if (drag?.releasing) return;
    const current = pendingAd || movies[0];
    if (dir === 'up') {
      // Read More button — open detail without consuming the card
      handleSwipe('up', current);
      return;
    }
    setDrag({ dx:0, dy:0, locked:null, releasing: dir });
    setTimeout(() => { handleSwipe(dir, current); }, 280);
  };

  const visible = pendingAd
    ? [pendingAd, ...movies.slice(0, 2)]
    : movies.slice(0, 3);

  return (
    <div style={{position:'relative', height:'100%'}}>
      {/* Card stack — fills the area down to just above the nav bar */}
      <div data-coach="card" style={{
        position:'absolute', top: 4, left: 22, right: 22, bottom: 108,
      }}>
        {visible.length === 0 ? (
          <EmptyDeck/>
        ) : visible.slice().reverse().map((m, i) => {
          const depth = visible.length - 1 - i;
          const isTop = depth === 0;
          return (
            <SwipeCard
              key={m.id}
              movie={m}
              isTop={isTop}
              depth={depth}
              drag={isTop ? drag : null}
              setDrag={isTop ? setDrag : null}
              onSwipe={handleSwipe}
              onTap={onTap}
              density={density}
              onOpenAdCTA={onOpenAdCTA}
            />
          );
        })}
      </div>

      {/* Action buttons — overlaid on the bottom of the poster.
          Wrapper is click-through so drags in the gaps still reach the card. */}
      {visible.length > 0 && (
        <div data-coach="actions" style={{
          position:'absolute', left: 0, right: 0, bottom: 122, zIndex: 110,
          display:'flex', justifyContent:'center', alignItems:'flex-end', gap: 16,
          pointerEvents:'none',
        }}>
          <ActionBtn label="Pass" icon="x"      color="#CC8050" size={60} onClick={()=>programmatic('left')} />
          <ActionBtn label="More" icon="chevup" color="#FDA65A" size={48} onClick={()=>programmatic('up')} />
          <ActionBtn label="Seen" icon="eye"    color="#E0955E" size={48} onClick={()=>programmatic('down')} />
          <ActionBtn label="Like" icon="heart"  color="#FF6D29" size={60} onClick={()=>programmatic('right')} filled/>
        </div>
      )}
    </div>
  );
}

function ActionBtn({ icon, color, size, onClick, filled=false, label }) {
  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center', gap: 7,
      pointerEvents:'auto',
    }}>
      <button onClick={onClick} aria-label={label} title={label} style={{
        appearance:'none', border:`1.2px solid ${color}`,
        width: size, height: size, borderRadius:'50%',
        background: filled ? color : 'rgba(0,0,0,0.32)',
        backdropFilter: filled ? 'none' : 'blur(10px) saturate(140%)',
        WebkitBackdropFilter: filled ? 'none' : 'blur(10px) saturate(140%)',
        color: filled ? '#17100f' : color,
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'transform .14s ease',
        boxShadow: filled ? `0 8px 22px ${color}66` : '0 6px 18px rgba(0,0,0,0.45)',
      }}>
        <Icon name={icon} size={size*0.42} stroke={filled? 2.2:1.8} color={filled? '#17100f' : color}/>
      </button>
      <span style={{
        fontSize: 10.5, fontWeight: 600, color:'rgba(255,255,255,0.92)', letterSpacing:'0.02em',
        textShadow:'0 1px 4px rgba(0,0,0,0.6)',
      }}>{label}</span>
    </div>
  );
}

function EmptyDeck() {
  return (
    <div style={{
      position:'absolute', inset:0,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      gap: 14, color:'var(--muted)', textAlign:'center', padding: '0 28px',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius:'50%',
        background:'rgba(var(--fg-rgb),0.07)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon name="film" size={28} color="var(--cream)"/>
      </div>
      <div style={{fontFamily:'var(--serif)', fontSize: 28, color:'var(--cream)', lineHeight:1.1}}>
        That's the reel, friend.
      </div>
      <div style={{fontSize: 13, lineHeight:1.5}}>
        We're loading more films you might love. Check back in a bit.
      </div>
    </div>
  );
}

// ─── First-run coach overlay (shown once) ──────────────────────────
// First-run coach-mark tour: dim overlay + spotlight cut-out on the real
// element being explained, a pointer arrow, an instruction card, swipe-gesture
// arrows, and Next / "Got it!" CTAs.
function SwipeCoach({ onDone }) {
  const STEPS = [
    { sel:'[data-coach="card"]',    pad: 6, radius: 22, place:'bottom',
      kicker:'How it works', title:'Swipe to pick',
      text:'Swipe a card whichever way feels right — right to like, left to pass, up for details, and down if you’ve already seen it.',
      gestures: true },
    { sel:'[data-coach="actions"]', pad: 12, radius: 40, place:'above',
      kicker:'Or just tap', title:'Same thing, one tap',
      text:'Not a swiper? These buttons do exactly the same — Pass, More, Seen, and Like.' },
    { sel:'[data-coach="nav"]',     pad: 8, radius: 34, place:'above',
      kicker:'The fun part', title:'Watch together',
      text:'Create a Room to match with friends or family, then find everything you liked over in Profile.' },
  ];

  const [i, setI] = React.useState(0);
  const [rect, setRect] = React.useState(null);
  const rootRef = React.useRef(null);
  const step = STEPS[i];
  const last = i === STEPS.length - 1;

  const measure = React.useCallback(() => {
    const root = rootRef.current;
    const el = root && document.querySelector(STEPS[i].sel);
    if (!root || !el) { setRect(null); return; }
    const rr = root.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const sx = rr.width / (root.offsetWidth || rr.width) || 1;
    const sy = rr.height / (root.offsetHeight || rr.height) || 1;
    const p = STEPS[i].pad || 6;
    setRect({
      left: (er.left - rr.left) / sx - p,
      top:  (er.top  - rr.top ) / sy - p,
      width:  er.width  / sx + p * 2,
      height: er.height / sy + p * 2,
    });
  }, [i]);

  React.useLayoutEffect(() => {
    const id = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', measure); };
  }, [measure]);

  const next = () => { if (last) onDone(); else setI(n => n + 1); };
  const rootH = rootRef.current?.offsetHeight || 800;
  const rootW = rootRef.current?.offsetWidth || 380;

  // Tooltip position by declared placement.
  let box = { left: 20, right: 20, bottom: 128 };
  if (rect && step.place === 'below') box = { left: 20, right: 20, top: rect.top + rect.height + 16 };
  else if (rect && step.place === 'above') box = { left: 20, right: 20, bottom: (rootH - rect.top) + 16 };
  const showCaret = rect && (step.place === 'above' || step.place === 'below');
  const caretLeft = rect ? Math.min(Math.max((rect.left + rect.width/2) - 20 - 7, 16), (rootW - 40) - 30) : 0;

  const arrows = [
    { d:'right',  label:'Like', color:'#FF6D29', rot: 0,   pos:{ right:12, top:'50%',  ty:'translateY(-50%)' } },
    { d:'left',   label:'Pass', color:'#CC8050', rot: 180, pos:{ left:12,  top:'50%',  ty:'translateY(-50%)' } },
    { d:'up',     label:'More', color:'#FDA65A', rot: -90, pos:{ top:14,   left:'50%', ty:'translateX(-50%)' } },
    { d:'down',   label:'Seen', color:'#E0955E', rot: 90,  pos:{ bottom:14,left:'50%', ty:'translateX(-50%)' } },
  ];

  return (
    <div ref={rootRef} className="fade-in" style={{
      position:'absolute', inset:0, zIndex: 500, overflow:'hidden', pointerEvents:'auto',
    }}>
      {/* Dim + spotlight cut-out */}
      {rect ? (
        <div style={{
          position:'absolute', left: rect.left, top: rect.top, width: rect.width, height: rect.height,
          borderRadius: step.radius, pointerEvents:'none',
          boxShadow:'0 0 0 9999px rgba(8,5,4,0.76)',
          border:'1.5px solid rgba(255,109,41,0.9)',
          transition:'left .34s cubic-bezier(.4,0,.2,1), top .34s cubic-bezier(.4,0,.2,1), width .34s cubic-bezier(.4,0,.2,1), height .34s cubic-bezier(.4,0,.2,1)',
        }}/>
      ) : (
        <div style={{position:'absolute', inset:0, background:'rgba(8,5,4,0.76)'}}/>
      )}

      {/* Swipe-gesture arrows around the card */}
      {rect && step.gestures && (
        <div style={{position:'absolute', left: rect.left, top: rect.top, width: rect.width, height: rect.height, pointerEvents:'none'}}>
          {arrows.map(g => {
            const { ty, ...anchor } = g.pos;
            return (
              <div key={g.d} style={{
                position:'absolute', ...anchor, transform: ty,
                display:'flex', flexDirection:'column', alignItems:'center', gap: 3,
                animation:'mm-coach-pulse 1.3s ease-in-out infinite',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 999, background: g.color,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:`0 4px 14px ${g.color}88`, transform:`rotate(${g.rot}deg)`,
                }}>
                  <Icon name="arrow" size={17} color="#fff" stroke={2.4}/>
                </div>
                <span style={{fontSize: 10, fontWeight: 700, color: g.color, letterSpacing:'0.02em'}}>{g.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Instruction card */}
      {rect && (
        <div className="rise" style={{ position:'absolute', ...box, pointerEvents:'auto' }}>
          {showCaret && (
            <div style={{
              position:'absolute', left: caretLeft, width: 14, height: 14,
              ...(step.place === 'below' ? { top: -7 } : { bottom: -7 }),
              background:'var(--ink)', transform:'rotate(45deg)',
              borderTop:  step.place === 'below' ? '0.5px solid rgba(var(--fg-rgb),0.12)' : 0,
              borderLeft: step.place === 'below' ? '0.5px solid rgba(var(--fg-rgb),0.12)' : 0,
              borderRight:  step.place === 'above' ? '0.5px solid rgba(var(--fg-rgb),0.12)' : 0,
              borderBottom: step.place === 'above' ? '0.5px solid rgba(var(--fg-rgb),0.12)' : 0,
            }}/>
          )}
          <div style={{
            background:'var(--ink)', border:'0.5px solid rgba(var(--fg-rgb),0.12)',
            borderRadius: 18, padding:'16px 16px 14px', boxShadow:'0 20px 50px rgba(0,0,0,0.55)',
          }}>
            <div style={{fontSize: 10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--red)', marginBottom: 6}}>{step.kicker}</div>
            <div style={{fontFamily:'var(--serif)', fontSize: 22, color:'var(--cream)', lineHeight: 1.1, marginBottom: 6}}>{step.title}</div>
            <div style={{fontSize: 13, color:'var(--muted)', lineHeight: 1.5, marginBottom: 14}}>{step.text}</div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <div style={{display:'flex', gap: 6}}>
                {STEPS.map((_, k) => (
                  <span key={k} style={{
                    width: k === i ? 18 : 6, height: 6, borderRadius: 999,
                    background: k === i ? 'var(--red)' : 'rgba(var(--fg-rgb),0.22)', transition:'all .25s ease',
                  }}/>
                ))}
              </div>
              <div style={{display:'flex', alignItems:'center', gap: 8}}>
                {!last && (
                  <button onClick={onDone} style={{
                    appearance:'none', border:0, background:'transparent', color:'var(--muted)',
                    fontSize: 13, fontWeight: 600, padding:'8px 6px', cursor:'pointer',
                  }}>Skip</button>
                )}
                <button onClick={next} style={{
                  appearance:'none', border:0, background:'var(--red)', color:'#fff',
                  fontFamily:'var(--sans)', fontWeight: 600, fontSize: 14, padding:'9px 18px', borderRadius: 999,
                  boxShadow:'0 6px 18px rgba(255,109,41,0.4)', cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 6,
                }}>
                  {last ? 'Got it!' : 'Next'}
                  {!last && <Icon name="arrow" size={14} color="#fff" stroke={2.4}/>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { SwipeDeck, SwipeCard, SwipeCoach });
