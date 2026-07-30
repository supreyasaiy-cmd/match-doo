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
    if (drag.locked === 'h') { translateY = dy * 0.2; rotate = dx * 0.05; }
    else if (drag.locked === 'v') { translateX = dx * 0.2; rotate = 0; }
    else { rotate = dx * 0.04; }
  }

  // Decide label
  let activeLabel = null;
  if (isTop && drag && !drag.releasing) {
    if (drag.locked === 'h') activeLabel = dx > 30 ? 'right' : dx < -30 ? 'left' : null;
    else if (drag.locked === 'v') activeLabel = dy < -30 ? 'up' : dy > 30 ? 'down' : null;
  } else if (drag?.releasing && drag.releasing !== 'snap') {
    activeLabel = drag.releasing;
  }
  const labelOpacity = activeLabel ? Math.min(1, (Math.abs(drag.locked==='h'? dx : dy)) / 90) : 0;

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

        {/* swipe label */}
        {activeLabel && (
          <div style={{
            position:'absolute',
            top: activeLabel === 'up' ? 38 : (activeLabel === 'down' ? 'auto' : 60),
            bottom: activeLabel === 'down' ? 38 : 'auto',
            left: activeLabel === 'left' ? 30 : (activeLabel === 'right' ? 'auto' : '50%'),
            right: activeLabel === 'right' ? 30 : 'auto',
            transform: `${activeLabel === 'up' || activeLabel === 'down' ? 'translateX(-50%)' : ''} rotate(${SWIPE_LABELS[activeLabel].rot}deg)`,
            opacity: labelOpacity,
            padding:'10px 18px', borderRadius: 8,
            border: `1.5px solid ${SWIPE_LABELS[activeLabel].color}`,
            color: SWIPE_LABELS[activeLabel].color,
            fontFamily:'var(--sans)', fontWeight: 600, fontSize: 17, letterSpacing:'0.1em',
            background:'rgba(0,0,0,0.45)',
            backdropFilter:'blur(4px)',
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
      <div style={{
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
        <div style={{
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
function SwipeCoach({ onDone }) {
  const TIPS = [
    { icon:'heart',  color:'#FF6D29', label:'Like', desc:'Swipe right — add to your list' },
    { icon:'x',      color:'#CC8050', label:'Pass', desc:'Swipe left — not for you' },
    { icon:'chevup', color:'#FDA65A', label:'More', desc:'Swipe up — see the details' },
    { icon:'eye',    color:'#E0955E', label:'Seen', desc:'Swipe down — already watched' },
  ];
  return (
    <div className="fade-in" style={{
      position:'absolute', inset:0, zIndex: 250,
      background:'rgba(var(--bg-rgb),0.88)',
      backdropFilter:'blur(18px) saturate(140%)', WebkitBackdropFilter:'blur(18px) saturate(140%)',
      display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',
      padding:'0 28px', textAlign:'center',
    }}>
      <div className="rise" style={{width:'100%', maxWidth: 340}}>
        <div style={{
          fontSize: 11, letterSpacing:'0.22em', textTransform:'uppercase',
          color:'var(--red)', marginBottom: 10,
        }}>How it works</div>
        <div style={{
          fontFamily:'var(--serif)', fontSize: 34, lineHeight: 1.05,
          color:'var(--cream)', letterSpacing:'-0.01em', marginBottom: 8,
        }}>Swipe or tap<br/>to react.</div>
        <div style={{fontSize: 13.5, color:'var(--muted)', marginBottom: 26, lineHeight: 1.5}}>
          Use the buttons on the card, or swipe in any direction.
        </div>

        <div style={{
          display:'flex', flexDirection:'column', gap: 12,
          background:'rgba(var(--fg-rgb),0.05)',
          border:'0.5px solid rgba(var(--fg-rgb),0.10)',
          borderRadius: 18, padding:'16px 16px', marginBottom: 24, textAlign:'left',
        }}>
          {TIPS.map(t => (
            <div key={t.label} style={{display:'flex', alignItems:'center', gap: 14}}>
              <IconBadge icon={t.icon} size={38} tone={t.color}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize: 14.5, fontWeight: 700, color:'var(--cream)'}}>{t.label}</div>
                <div style={{fontSize: 12, color:'var(--muted)', marginTop: 1}}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <PrimaryBtn full onClick={onDone}>Got it</PrimaryBtn>
      </div>
    </div>
  );
}

Object.assign(window, { SwipeDeck, SwipeCard, SwipeCoach });
