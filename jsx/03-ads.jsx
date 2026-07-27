// ads.jsx — Banner / Swipe / Popup ad rendering + scheduling helpers
// Reads campaign data from window.ADS (see data.js). Admin CMS lives in Admin.html.

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
  const campaign = pickBannerCampaign(placement);
  if (!campaign) return null;
  return (
    <button onClick={() => onOpenCTA?.(campaign)} style={{
      appearance: 'none', border: '0.5px solid rgba(var(--fg-rgb),0.14)',
      background: 'rgba(var(--fg-rgb),0.05)', width: '100%', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px', borderRadius: 16, color: 'var(--cream)',
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
        width: '100%', maxWidth: 320, background: '#131a26', borderRadius: 26,
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

Object.assign(window, {
  isAdLive, pickBannerCampaign, activeSwipeAdCampaigns, activePopupAdCampaign,
  AdTag, BannerAd, AdCardContent, PopupAdInterstitial,
});
