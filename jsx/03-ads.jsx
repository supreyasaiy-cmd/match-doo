// ads.jsx — Banner / Swipe / Popup ad rendering + scheduling helpers
// Reads campaign data from window.ADS (see data.js). Admin CMS lives in Admin.html.

// Master switch for banner-style ad placements (the Rooms sponsored carousel
// and the top-of-tab / sticky BannerAd). Hidden for now — flip to true to
// bring the banner inventory back. Swipe/popup ads are unaffected.
const BANNER_ADS_ENABLED = false;

function adParseDT(dateStr, timeStr) {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T${timeStr || '00:00'}:00`);
  return isNaN(d.getTime()) ? null : d;
}

function isAdLive(c, now = new Date()) {
  if (!c || !c.enabled) return false;
  const start = adParseDT(c.startDate, c.startTime);
  const end = adParseDT(c.endDate, c.endTime);
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

function pickBannerCampaign(placement, now = new Date()) {
  const cands = ((window.ADS && window.ADS.banners) || [])
    .filter(b => b.placement === placement && isAdLive(b, now));
  cands.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  return cands[0] || null;
}

function activeSwipeAdCampaigns(now = new Date()) {
  return ((window.ADS && window.ADS.swipeAds) || [])
    .filter(a => isAdLive(a, now))
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

function activePopupAdCampaign(now = new Date()) {
  const cands = ((window.ADS && window.ADS.popupAds) || []).filter(p => isAdLive(p, now));
  cands.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  return cands[0] || null;
}

// ─── Sponsored tag ───────────────────────────────────────────────────
function AdTag({ style = {} }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase',
      fontWeight: 700, color: 'rgba(255,255,255,0.92)',
      background: 'rgba(0,0,0,0.45)', border: '0.5px solid rgba(255,255,255,0.25)',
      padding: '4px 9px', borderRadius: 999, backdropFilter: 'blur(6px)',
      ...style,
    }}>Sponsored</span>
  );
}

// ─── Banner ad (top-of-tab or sticky-above-tabbar) ──────────────────
function BannerAd({ placement, onOpenCTA, style = {} }) {
  if (!BANNER_ADS_ENABLED) return null;
  const campaign = pickBannerCampaign(placement);
  if (!campaign) return null;
  return (
    <button onClick={() => onOpenCTA?.(campaign)} style={{
      appearance: 'none', border: '0.5px solid rgba(var(--fg-rgb),0.14)',
      background: 'rgba(var(--fg-rgb),0.05)', width: '100%', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px', borderRadius: 'var(--r-md)', color: 'var(--cream)',
      ...style,
    }}>
      <image-slot id={`banner-logo-${campaign.id}`} shape="rounded" radius="8"
        style={{ width: 34, height: 34, flexShrink: 0 }} placeholder="Logo"></image-slot>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--gold)', fontWeight: 700, marginBottom: 2,
        }}>Sponsored · {campaign.advertiser}</div>
        <div style={{
          fontSize: 13, fontWeight: 600, letterSpacing: '-0.005em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{campaign.headline}</div>
      </div>
      <div style={{
        fontSize: 11, fontWeight: 600, color: 'var(--ink)', background: 'var(--cream)',
        padding: '6px 11px', borderRadius: 999, flexShrink: 0, whiteSpace: 'nowrap',
      }}>{campaign.ctaText}</div>
    </button>
  );
}

// ─── Sponsored card content — swapped into SwipeCard when movie.__ad ──
function AdCardContent({ campaign, onOpenCTA }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: campaign.bg || '#11121c' }}>
      <image-slot id={`swipead-${campaign.id}`} shape="rect"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        placeholder="Drop ad creative (portrait)"></image-slot>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.10) 30%, rgba(0,0,0,0.72) 88%, rgba(0,0,0,0.88) 100%)',
      }} />

      <div style={{
        position: 'absolute', top: 22, left: 22, right: 22, zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <AdTag />
        <image-slot id={`swipead-logo-${campaign.id}`} shape="circle"
          style={{ width: 30, height: 30, flexShrink: 0 }} placeholder="Logo"></image-slot>
      </div>

      <div style={{
        position: 'absolute', left: 22, right: 22, bottom: 22, zIndex: 1,
        color: 'var(--cream)', pointerEvents: 'auto',
      }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
          opacity: 0.75, marginBottom: 8,
        }}>{campaign.advertiser}</div>
        <div style={{
          fontFamily: 'var(--serif)', fontSize: 40, lineHeight: 0.96, letterSpacing: '-0.01em',
          marginBottom: 10, textWrap: 'pretty',
        }}>{campaign.headline}</div>
        {campaign.tag && (
          <div style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15,
            opacity: 0.85, marginBottom: 16, lineHeight: 1.3,
          }}>{campaign.tag}</div>
        )}
        <button onClick={(e) => { e.stopPropagation(); onOpenCTA?.(campaign); }} style={{
          appearance: 'none', border: 0, background: 'var(--cream)', color: 'var(--ink)',
          padding: '12px 20px', borderRadius: 999, fontFamily: 'var(--sans)',
          fontWeight: 600, fontSize: 14, letterSpacing: '-0.005em',
        }}>{campaign.ctaText} →</button>
      </div>
    </div>
  );
}

// ─── Popup ad — center modal interstitial ───────────────────────────
function PopupAdInterstitial({ campaign, onClose, onOpenCTA }) {
  if (!campaign) return null;
  return (
    <div className="fade-in" style={{
      position: 'absolute', inset: 0, zIndex: 900,
      background: 'rgba(7,10,17,0.86)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 22px',
    }}>
      <div className="pop" style={{
        width: '100%', maxWidth: 320, background: '#241813', borderRadius: 'var(--r-lg)',
        border: '0.5px solid rgba(var(--fg-rgb),0.12)', overflow: 'hidden', position: 'relative',
        boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
      }}>
        <button onClick={onClose} aria-label="Close ad" style={{
          appearance: 'none', border: 0, position: 'absolute', top: 12, right: 12, zIndex: 2,
          width: 32, height: 32, borderRadius: 999, background: 'rgba(0,0,0,0.55)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="x" size={15} />
        </button>
        <span style={{
          position: 'absolute', top: 14, left: 14, zIndex: 2,
          fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700,
          color: '#fff', background: 'rgba(0,0,0,0.55)', padding: '4px 9px', borderRadius: 999,
        }}>Ad</span>

        <image-slot id={`popupad-${campaign.id}`} shape="rect"
          style={{ width: '100%', height: 168, display: 'block' }}
          placeholder="Drop ad creative (16:9)"></image-slot>

        <div style={{ padding: '18px 22px 24px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
          }}>
            <image-slot id={`popupad-logo-${campaign.id}`} shape="rounded" radius="7"
              style={{ width: 24, height: 24, flexShrink: 0 }} placeholder="Logo"></image-slot>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>{campaign.advertiser}</div>
          </div>
          <div style={{
            fontFamily: 'var(--serif)', fontSize: 25, lineHeight: 1.08,
            color: 'var(--cream)', marginBottom: 9, letterSpacing: '-0.01em', textWrap: 'pretty',
          }}>{campaign.headline}</div>
          <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.55, marginBottom: 20 }}>
            {campaign.body}
          </div>
          <button onClick={() => onOpenCTA?.(campaign)} style={{
            appearance: 'none', border: 0, width: '100%', padding: '13px',
            borderRadius: 999, background: 'var(--cream)', color: 'var(--ink)',
            fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 14.5,
          }}>{campaign.ctaText}</button>
        </div>
      </div>
    </div>
  );
}


// ─── 16:9 auto-sliding ad carousel ──────────────────────────────────
// Sample house ads (fictional brands) themed around movie-watching:
// streaming, cinema tickets, and snack delivery. Auto-advances, pauses
// while pressed, and can be tapped through with the dots.
function AdCarousel16({ interval = 4200, onOpenCTA, style = {} }) {
  if (!BANNER_ADS_ENABLED) return null;
  const ADS = [
    { id:'stream', brand:'StreamMax', title:'First month, on us', sub:'4K movies & series, zero ads',
      cta:'Start free', bg:'radial-gradient(120% 120% at 12% 15%, #3a1420, #0c0507)', accent:'#ff5a7a', emoji:'📺' },
    { id:'cinema', brand:'Cineo', title:'2 seats, 1 price', sub:'Book tonight’s showing near you',
      cta:'Get tickets', bg:'radial-gradient(120% 120% at 85% 10%, #241a3a, #08060f)', accent:'#b79cff', emoji:'🎬' },
    { id:'food',   brand:'QuickBite', title:'Snacks in 20 min', sub:'Popcorn & drinks to your couch',
      cta:'Order now', bg:'radial-gradient(120% 120% at 15% 85%, #123018, #060d08)', accent:'#5fd98c', emoji:'🍿' },
  ];
  const [i, setI] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI(n => (n + 1) % ADS.length), interval);
    return () => clearInterval(t);
  }, [paused, interval, ADS.length]);

  return (
    <div
      onPointerDown={()=>setPaused(true)} onPointerUp={()=>setPaused(false)} onPointerLeave={()=>setPaused(false)}
      style={{
        position:'relative', width:'100%', aspectRatio:'16 / 9', borderRadius:'var(--r-md)', overflow:'hidden',
        border:'0.5px solid rgba(var(--fg-rgb),0.14)', ...style,
      }}>
      <div style={{
        display:'flex', width:'100%', height:'100%',
        transform:`translateX(-${i*100}%)`, transition:'transform .6s cubic-bezier(.4,0,.2,1)',
      }}>
        {ADS.map(ad => (
          <button key={ad.id} onClick={()=> onOpenCTA?.(ad)} style={{
            appearance:'none', border:0, cursor:'pointer', flex:'0 0 100%', height:'100%',
            position:'relative', background:ad.bg, color:'#fff', textAlign:'left', padding:0, overflow:'hidden',
          }}>
            <div style={{position:'absolute', right:-8, bottom:-16, fontSize:118, lineHeight:1, opacity:0.92,
              filter:'drop-shadow(0 8px 18px rgba(0,0,0,0.55))', transform:'rotate(-8deg)'}}>{ad.emoji}</div>
            <div style={{position:'absolute', inset:0, background:`radial-gradient(75% 95% at 10% 20%, ${ad.accent}26, transparent 62%)`}}/>
            <span style={{position:'absolute', top:10, left:12, fontSize:9, fontWeight:700, letterSpacing:'0.1em',
              textTransform:'uppercase', color:'#fff', background:'rgba(0,0,0,0.42)',
              backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)', padding:'3px 8px', borderRadius:999}}>
              Sponsored · {ad.brand}
            </span>
            <div style={{position:'absolute', left:14, bottom:13, right:104}}>
              <div style={{fontSize:19, fontWeight:800, letterSpacing:'-0.02em', lineHeight:1.05, textShadow:'0 2px 8px rgba(0,0,0,0.55)'}}>{ad.title}</div>
              <div style={{fontSize:12, opacity:0.85, marginTop:3, marginBottom:10, textShadow:'0 1px 4px rgba(0,0,0,0.5)'}}>{ad.sub}</div>
              <span style={{display:'inline-block', fontSize:12, fontWeight:700, color:'#0c0507',
                background:ad.accent, padding:'7px 15px', borderRadius:999}}>{ad.cta}</span>
            </div>
          </button>
        ))}
      </div>
      <div style={{position:'absolute', bottom:9, right:12, display:'flex', gap:5, zIndex:3}}>
        {ADS.map((_, k) => (
          <span key={k} onClick={()=>setI(k)} style={{
            width: k === i ? 16 : 6, height: 6, borderRadius: 999, cursor:'pointer',
            background: k === i ? '#fff' : 'rgba(255,255,255,0.45)', transition:'all .3s ease',
          }}/>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  BANNER_ADS_ENABLED,
  isAdLive, pickBannerCampaign, activeSwipeAdCampaigns, activePopupAdCampaign,
  AdTag, BannerAd, AdCarousel16, AdCardContent, PopupAdInterstitial,
});
