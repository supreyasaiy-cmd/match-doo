// screens.jsx — Auth, onboarding, matches, friends, profile, movie detail, match celebration

// ─── Liquid-glass animated background (used behind Welcome) ─────────
function LiquidGlassBG() {
  return (
    <div className="mm-liquid-bg grain" aria-hidden="true">
      {/* bright ember core, upper-left — the hot centre of the "On Fire" glow */}
      <div className="blob" style={{
        width: 520, height: 600, left: '-20%', top: '-18%',
        background: 'radial-gradient(circle at 32% 30%, rgba(255,236,150,0.92), rgba(255,109,41,0.62) 46%, transparent 72%)',
        borderRadius: '48% 52% 58% 42% / 55% 45% 55% 45%',
        animation: 'mm-blob-a 24s ease-in-out infinite',
      }}/>
      {/* deep-rust flare, upper-right */}
      <div className="blob" style={{
        width: 460, height: 560, right: '-24%', top: '-16%',
        background: 'radial-gradient(circle at 62% 34%, rgba(255,171,84,0.85), rgba(179,44,26,0.6) 52%, transparent 74%)',
        borderRadius: '55% 45% 42% 58% / 48% 55% 45% 52%',
        animation: 'mm-blob-b 28s ease-in-out infinite',
      }}/>
      {/* small bean-shaped blob, lower area */}
      <div className="blob" style={{
        width: 280, height: 220, left: '6%', bottom: '-8%',
        background: 'radial-gradient(circle at 40% 40%, rgba(255,109,41,0.55), rgba(179,44,26,0.35) 55%, transparent 75%)',
        borderRadius: '50% 50% 46% 54% / 54% 46% 54% 46%',
        animation: 'mm-blob-c 19s ease-in-out infinite',
      }}/>
      {/* thin warm sheen streak, like light through glass */}
      <div className="sheen" style={{
        width: 160, height: '180%', left: '52%', top: '-40%',
        background: 'linear-gradient(100deg, transparent 40%, rgba(255,244,225,0.38) 50%, transparent 60%)',
        animation: 'mm-sheen-drift 15s ease-in-out infinite',
      }}/>
      {/* darken toward the bottom so text stays legible */}
      <div style={{
        position:'absolute', inset:0,
        background:'linear-gradient(200deg, transparent 28%, rgba(var(--bg-rgb),0.55) 62%, rgba(var(--bg-rgb),0.9) 100%)',
      }}/>
    </div>
  );
}

// ─── Film-reel photo background, recolored to the app's tone ────────
// Takes a real cinematic photo (assets/film-reel.jpg) and pushes it
// through an SVG duotone filter that maps shadows → navy ink and
// highlights → coral, so it reads as part of the liquid-glass palette
// rather than a warm outside image. Falls back to nothing if missing.
function FilmReelBG() {
  const [ok, setOk] = React.useState(true);
  if (!ok) return null;
  return (
    <div aria-hidden="true" style={{position:'absolute', inset:0, overflow:'hidden', zIndex:0}}>
      {/* duotone filter def (navy shadows → coral highlights) */}
      <svg width="0" height="0" style={{position:'absolute'}}>
        <filter id="mm-duotone" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0"/>
          {/* shadows → warm near-black, highlights → ember amber */}
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.10 1.0"/>
            <feFuncG type="table" tableValues="0.06 0.635"/>
            <feFuncB type="table" tableValues="0.05 0.306"/>
          </feComponentTransfer>
        </filter>
      </svg>

      <img
        src="assets/film-reel.png"
        alt=""
        onError={()=> setOk(false)}
        style={{
          position:'absolute', inset:0, width:'100%', height:'100%',
          objectFit:'cover', objectPosition:'center 30%',
          filter:'url(#mm-duotone) contrast(1.04)',
          opacity:0.62,
        }}
      />
      {/* coral tie-in glow toward the top */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(92% 55% at 50% 6%, rgba(255,109,41,0.20), transparent 60%)',
      }}/>
      {/* periwinkle sliver, echoing the liquid-glass accent */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(60% 40% at 88% 4%, rgba(224,149,94,0.16), transparent 62%)',
      }}/>
      {/* legibility scrim — darken toward the bottom for the text/buttons */}
      <div style={{
        position:'absolute', inset:0,
        background:'linear-gradient(200deg, rgba(var(--bg-rgb),0.20) 0%, rgba(var(--bg-rgb),0.55) 52%, rgba(var(--bg-rgb),0.94) 100%)',
      }}/>
      {/* top-down fade so the wordmark + heading read clearly */}
      <div style={{
        position:'absolute', left:0, right:0, top:0, height:'58%',
        background:'linear-gradient(180deg, rgba(16,10,9,0.82) 0%, rgba(16,10,9,0.5) 32%, transparent 100%)',
        pointerEvents:'none',
      }}/>
    </div>
  );
}

// ─── Welcome (Sign in / Sign up) ────────────────────────────────────
function WelcomeScreen({ onSignIn, onSignUp }) {
  return (
    <div className="fade-in" style={{
      position:'relative', overflow:'hidden',
      display:'flex', flexDirection:'column', height:'100%',
      padding: '52px 28px 32px',
      background:'var(--ink)',
    }}>
      <LiquidGlassBG/>

      <div style={{position:'relative', zIndex:1, display:'flex', flexDirection:'column', height:'100%'}}>
        {/* Wordmark top-left */}
        <Wordmark/>

        <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'flex-start', paddingTop: 30}}>
          <div style={{
            fontFamily:'var(--serif)', fontSize: 46, lineHeight: 1.0,
            letterSpacing:'-0.025em', color:'var(--cream)', textWrap:'nowrap',
          }}>
            Match<br/>
            <em style={{
              fontStyle:'italic',
              background:'linear-gradient(95deg, #FF6D29 0%, #E0955E 80%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              backgroundClip:'text', color:'transparent',
            }}>a movie</em><br/>
            Make<br/>
            <em style={{
              fontStyle:'italic',
              background:'linear-gradient(95deg, #FF6D29 0%, #E0955E 80%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              backgroundClip:'text', color:'transparent',
            }}>a moment</em>
          </div>

          <div className="wl-badge" style={{
            marginTop: 22,
            display:'inline-flex', alignItems:'center', gap: 8,
            padding:'8px 14px', borderRadius: 999,
            border:'0.5px solid', fontSize: 12, fontWeight: 600,
            letterSpacing:'-0.005em',
          }}>
            <Icon name="film" size={14} color="currentColor"/>
            Less choosing. More watching together.
          </div>

          <div style={{
            marginTop: 18, color:'var(--muted)', fontSize: 15.5, lineHeight: 1.55, maxWidth: 320,
          }}>
            Discover movies and series together. Swipe, match, and turn your shared picks into your next movie night.
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap: 10}}>
          <PrimaryBtn full onClick={onSignIn} style={{height: 50, fontSize: 16}}>
            <span style={{display:'inline-flex', alignItems:'center', gap: 8}}>
              <Icon name="arrow" size={14} stroke={2.4} color="var(--ink)"/>
              Sign In
            </span>
          </PrimaryBtn>
          <PrimaryBtn full secondary onClick={onSignUp} style={{height: 50, fontSize: 16}}>
            Create account
          </PrimaryBtn>

          <div style={{
            textAlign:'center', marginTop: 12, fontSize: 11, color:'var(--muted-2)', lineHeight: 1.5,
          }}>
            By continuing you agree to our Terms<br/>and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sign-in / sign-up (SSO only) ───────────────────────────────────
function AuthScreen({ mode: initialMode = 'signin', onBack, onAuth }) {
  const [mode, setMode] = React.useState(initialMode);
  const [busy, setBusy] = React.useState(null); // 'google' | 'apple' | 'email'
  const [name, setName]   = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pw, setPw]       = React.useState('');
  const [showPw, setShowPw]   = React.useState(false);
  const [touched, setTouched] = React.useState(false);

  const isSignup = mode === 'signup';
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const pwOk    = pw.length >= 6;
  const nameOk  = name.trim().length >= 2;
  const canSubmit = emailOk && pwOk && (!isSignup || nameOk);

  const sso = (provider) => {
    if (busy) return;
    setBusy(provider);
    setTimeout(() => {
      const nm = provider === 'apple' ? 'Alex' : 'Alex Carter';
      onAuth?.({ provider, name: nm, email: provider === 'google' ? 'alex.carter@gmail.com' : 'alex@privaterelay.apple' }, mode);
    }, 1000);
  };
  const submitEmail = () => {
    setTouched(true);
    if (!canSubmit || busy) return;
    setBusy('email');
    setTimeout(() => {
      onAuth?.({ provider:'email', name: isSignup ? name.trim() : (email.split('@')[0] || 'You'), email: email.trim() }, mode);
    }, 950);
  };
  const swap = () => { setMode(isSignup ? 'signin' : 'signup'); setTouched(false); };

  const inputStyle = (invalid) => ({
    width:'100%', height: 50, background:'rgba(var(--fg-rgb),0.06)',
    backdropFilter:'blur(10px) saturate(130%)', WebkitBackdropFilter:'blur(10px) saturate(130%)',
    border:`0.5px solid ${invalid ? 'rgba(232,121,138,0.6)' : 'rgba(var(--fg-rgb),0.14)'}`,
    borderRadius: 14, padding:'0 14px', color:'var(--cream)', fontFamily:'var(--sans)', fontSize: 15, outline:0,
  });
  const fieldLabel = { fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)', margin:'0 0 7px 2px' };

  return (
    <div className="fade-in" style={{
      position:'relative', overflow:'hidden',
      display:'flex', flexDirection:'column', height:'100%',
      background:'radial-gradient(120% 60% at 50% 0%, rgba(255,109,41,0.16), transparent 55%), var(--ink)',
    }}>
      <FilmReelBG/>
      <div style={{position:'relative', zIndex:1, display:'flex', flexDirection:'column', height:'100%'}}>
        <div style={{padding:'52px 28px 0', flexShrink: 0}}>
          <button onClick={onBack} style={{
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.09)',
            width: 38, height: 38, borderRadius: 999,
            display:'flex', alignItems:'center', justifyContent:'center', color:'var(--cream)',
          }}>
            <Icon name="chevl" size={18}/>
          </button>
        </div>

        <div className="phone-scroll" style={{flex: 1, overflowY:'auto', padding:'18px 28px 36px'}}>
          <Wordmark/>
          <div style={{
            marginTop: 26,
            fontFamily:'var(--serif)', fontSize: 40, lineHeight: 0.98, letterSpacing:'-0.02em',
            color:'var(--cream)', textWrap:'pretty',
          }}>
            {isSignup ? <>Let's get<br/><em style={{fontStyle:'italic', color:'var(--gold)'}}>matched.</em></>
                      : <>Welcome<br/><em style={{fontStyle:'italic', color:'var(--gold)'}}>back.</em></>}
          </div>
          <div style={{marginTop: 12, color:'var(--muted)', fontSize: 14, lineHeight: 1.5, maxWidth: 320, marginBottom: 22}}>
            {isSignup
              ? 'Create your account to start matching movies with the people you actually watch with.'
              : 'Sign in to pick up right where you left off.'}
          </div>

          {/* One-tap SSO */}
          <div style={{display:'flex', flexDirection:'column', gap: 10}}>
            <SsoButton kind="google" loading={busy==='google'} disabled={!!busy && busy!=='google'} onClick={()=> sso('google')}/>
            <SsoButton kind="apple"  loading={busy==='apple'}  disabled={!!busy && busy!=='apple'}  onClick={()=> sso('apple')}/>
          </div>

          {/* divider */}
          <div style={{display:'flex', alignItems:'center', gap: 12, margin:'20px 0'}}>
            <div style={{flex:1, height:0.5, background:'rgba(var(--fg-rgb),0.14)'}}/>
            <div style={{fontSize: 11, color:'var(--muted-2)', letterSpacing:'0.06em'}}>or with email</div>
            <div style={{flex:1, height:0.5, background:'rgba(var(--fg-rgb),0.14)'}}/>
          </div>

          {/* Email registration / login form */}
          <div style={{display:'flex', flexDirection:'column', gap: 14}}>
            {isSignup && (
              <label style={{display:'block'}}>
                <div style={fieldLabel}>Full name</div>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Alex Carter" style={inputStyle(touched && !nameOk)}/>
              </label>
            )}
            <label style={{display:'block'}}>
              <div style={fieldLabel}>Email</div>
              <input type="email" inputMode="email" autoCapitalize="none" autoCorrect="off"
                value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" style={inputStyle(touched && !emailOk)}/>
            </label>
            <label style={{display:'block'}}>
              <div style={fieldLabel}>Password</div>
              <div style={{position:'relative'}}>
                <input type={showPw ? 'text' : 'password'} value={pw} onChange={e=>setPw(e.target.value)}
                  placeholder={isSignup ? 'At least 6 characters' : 'Your password'}
                  style={{...inputStyle(touched && !pwOk), paddingRight: 46}}/>
                <button type="button" onClick={()=>setShowPw(s=>!s)} aria-label="Toggle password visibility" style={{
                  position:'absolute', right: 6, top: 6, width: 38, height: 38, borderRadius: 999,
                  border:0, background:'transparent', color: showPw ? 'var(--red)' : 'var(--muted)',
                  display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
                }}>
                  <Icon name="eye" size={17}/>
                </button>
              </div>
            </label>
          </div>

          {isSignup && (
            <div style={{fontSize: 11.5, color:'var(--muted)', lineHeight: 1.5, margin:'14px 2px 0'}}>
              By creating an account you agree to our <span style={{color:'var(--cream)'}}>Terms</span> & <span style={{color:'var(--cream)'}}>Privacy Policy</span>.
            </div>
          )}

          <button onClick={submitEmail} disabled={busy==='email'} style={{
            appearance:'none', border:0, marginTop: 18, width:'100%', height: 52, borderRadius: 999,
            background: canSubmit ? 'var(--red)' : 'rgba(var(--fg-rgb),0.12)',
            color: canSubmit ? '#fff' : 'var(--muted)',
            fontFamily:'var(--sans)', fontWeight: 600, fontSize: 15.5, letterSpacing:'-0.01em',
            boxShadow: canSubmit ? '0 8px 24px rgba(255,109,41,0.40)' : 'none',
            display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
            cursor: canSubmit ? 'pointer' : 'default', transition:'background .2s ease, box-shadow .2s ease',
          }}>
            {busy==='email' ? (
              <span style={{
                width: 16, height: 16, borderRadius:'50%',
                border:'2px solid rgba(255,255,255,0.35)', borderTopColor:'#fff',
                animation:'mm-spin .8s linear infinite',
              }}/>
            ) : (isSignup ? 'Create account' : 'Sign in')}
          </button>

          <div style={{textAlign:'center', marginTop: 16, fontSize: 13, color:'var(--muted)'}}>
            {isSignup ? 'Already have an account?' : 'New here?'}{' '}
            <button onClick={swap} style={{
              appearance:'none', border:0, background:'transparent', color:'var(--cream)',
              fontWeight: 600, textDecoration:'underline', textUnderlineOffset: 3, fontSize: 13, cursor:'pointer',
            }}>
              {isSignup ? 'Sign in' : 'Create one'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SsoButton({ kind, loading, disabled, onClick }) {
  const isApple = kind === 'apple';
  return (
    <button onClick={onClick} disabled={disabled} style={{
      appearance:'none', border:'0.5px solid rgba(0,0,0,0.14)',
      background: isApple ? '#000' : '#f4f1ea',
      color: isApple ? '#fff' : '#17100f',
      height: 52, borderRadius: 999,
      display:'flex', alignItems:'center', justifyContent:'center', gap: 10,
      fontFamily:'var(--sans)', fontWeight: 600, fontSize: 15.5, letterSpacing:'-0.01em',
      opacity: disabled ? 0.5 : 1, transition:'opacity .18s ease',
    }}>
      {loading ? (
        <span style={{
          width: 16, height: 16, borderRadius:'50%',
          border:`2px solid ${isApple? 'rgba(255,255,255,0.3)':'rgba(0,0,0,0.2)'}`,
          borderTopColor: isApple ? '#fff' : '#17100f',
          animation:'mm-spin .8s linear infinite',
        }}/>
      ) : isApple ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
          <path d="M17.05 20.28c-.98.95-2.05.86-3.08.41-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.79.79-.05 1.85-.78 3.14-.84 1.51.13 2.65.74 3.39 1.83-3.06 1.85-2.34 5.99.39 7.32-.51 1.42-1.18 2.83-2 3.87zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )}
      Continue with {isApple ? 'Apple' : 'Google'}
    </button>
  );
}

function Wordmark({ small=false }) {
  return (
    <div style={{display:'flex', alignItems:'center', gap: 10}}>
      <Logomark size={small? 28:34}/>
      <div style={{
        fontFamily:'var(--serif)', fontSize: small? 21:26, color:'var(--cream)',
        letterSpacing:'-0.015em', lineHeight: 1,
      }}>
        Match<em style={{fontStyle:'italic', color:'var(--gold)', marginLeft: 4}}>Doo</em>
      </div>
    </div>
  );
}

// App logo — glowing glass "play × play" mark, rendered as a rounded app-icon
// tile (the artwork sits on its own dark ground, so it reads as a badge).
function Logomark({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      flexShrink: 0, overflow: 'hidden',
      backgroundImage: 'url("assets/logo-app.png?v=2")',
      backgroundSize: '132%', backgroundPosition: 'center 48%',
      backgroundRepeat: 'no-repeat', backgroundColor: '#161113',
      boxShadow: '0 2px 12px rgba(255,109,41,0.30)',
      border: '0.5px solid rgba(255,150,90,0.28)',
    }} aria-label="Match Doo logo"/>
  );
}

function FieldInput({ type, placeholder, value, onChange, icon }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap: 10,
      background:'rgba(var(--fg-rgb),0.07)',
      border:'0.5px solid rgba(var(--fg-rgb),0.12)',
      borderRadius: 14, padding:'14px 16px',
    }}>
      {icon && <Icon name={icon} size={18} color="var(--muted)"/>}
      <input
        type={type}
        autoFocus
        placeholder={placeholder}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        style={{
          flex:1, background:'transparent', border:0, outline:0,
          color:'var(--cream)', fontFamily:'var(--sans)', fontSize: 15, letterSpacing:'-0.01em',
        }}
      />
    </div>
  );
}

// ─── Onboarding (taste setup) ───────────────────────────────────────
function OnboardingScreen({ initialName = '', onDone }) {
  const [step, setStep] = React.useState(0);
  const [contentType, setContentType] = React.useState('both'); // 'movies' | 'series' | 'both'
  const [services, setServices] = React.useState(new Set(['Netflix','Prime']));
  const [genres, setGenres] = React.useState(new Set());

  const GENRES = ['Drama','Romance','Sci-Fi','Comedy','Thriller','Mystery','Animation','Music','Adventure','Crime','Fantasy','Family','History','Horror','Documentary'];
  const SERVICES = Object.keys(window.SERVICES);

  const toggle = (set, val) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    return next;
  };

  const steps = [
    {
      title: <>What are you<br/><em style={{fontStyle:'italic'}}>here for?</em></>,
      sub: 'Pick the one that fits — you can change it later.',
      can: !!contentType,
      body: (
        <div style={{display:'flex', flexDirection:'column', gap: 10}}>
          {[
            { id:'movies', label:'Movies',  desc:'Films only — feature-length picks.', icon:'film' },
            { id:'series', label:'Series',  desc:'Shows only — episodic stories.',     icon:'cards' },
            { id:'both',   label:'Both',    desc:'Mix it up. Show me everything.',     icon:'sparkle' },
          ].map(o => {
            const on = contentType === o.id;
            return (
              <button key={o.id} onClick={()=>setContentType(o.id)} style={{
                appearance:'none', width:'100%', textAlign:'left',
                background: on ? 'rgba(var(--fg-rgb),0.08)' : 'rgba(var(--fg-rgb),0.03)',
                border: `0.5px solid ${on? 'var(--cream)':'rgba(var(--fg-rgb),0.12)'}`,
                padding:'16px 16px', borderRadius: 16,
                display:'flex', alignItems:'center', gap: 14,
                color:'var(--cream)',
                transition:'all .14s ease',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: on ? 'var(--cream)' : 'rgba(var(--fg-rgb),0.08)',
                  color: on ? 'var(--ink)' : 'var(--cream)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink: 0,
                }}>
                  <Icon name={o.icon} size={18}/>
                </div>
                <div style={{flex:1, minWidth: 0}}>
                  <div style={{fontFamily:'var(--sans)', fontWeight: 600, fontSize: 16, letterSpacing:'-0.01em'}}>{o.label}</div>
                  <div style={{fontSize: 12.5, color:'var(--muted)', marginTop: 2}}>{o.desc}</div>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `1.5px solid ${on? 'var(--cream)':'rgba(var(--fg-rgb),0.20)'}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink: 0,
                }}>
                  {on && <span style={{width: 10, height: 10, borderRadius:'50%', background:'var(--cream)'}}/>}
                </div>
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: <>Where do you<br/><em style={{fontStyle:'italic'}}>stream?</em></>,
      sub: "We'll show titles you can actually watch tonight.",
      can: services.size >= 1,
      body: (
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10}}>
          {SERVICES.map(s=>{
            const on = services.has(s);
            return (
              <button key={s} onClick={()=>setServices(set=>toggle(set,s))} style={{
                appearance:'none', border:`0.5px solid ${on? 'var(--cream)' : 'rgba(var(--fg-rgb),0.12)'}`,
                padding:'14px 14px', borderRadius: 14, textAlign:'left',
                background: on ? 'rgba(var(--fg-rgb),0.08)' : 'rgba(var(--fg-rgb),0.03)',
                display:'flex', alignItems:'center', gap: 10,
                color:'var(--cream)', fontFamily:'var(--sans)', fontWeight:500, fontSize: 13,
                transition:'all .14s ease',
              }}>
                <ServiceChip name={s} size={26}/>
                <span style={{flex:1}}>{s}</span>
                {on && <Icon name="check" size={16} color="var(--cream)"/>}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: <>Pick a few<br/><em style={{fontStyle:'italic'}}>genres.</em></>,
      sub: `Pick at least 3 so we can learn your taste — ${genres.size} so far.`,
      can: genres.size >= 3,
      body: (
        <div style={{display:'flex', flexWrap:'wrap', gap: 8}}>
          {GENRES.map(g=>{
            const on = genres.has(g);
            return (
              <button key={g} onClick={()=>setGenres(s=>toggle(s,g))} style={{
                appearance:'none', border:0,
                padding:'10px 14px', borderRadius: 999,
                background: on ? 'var(--cream)' : 'rgba(var(--fg-rgb),0.06)',
                color: on ? 'var(--ink)' : 'var(--cream)',
                fontFamily:'var(--sans)', fontWeight: on? 600:500, fontSize: 13,
                border: `0.5px solid ${on? 'var(--cream)' : 'rgba(var(--fg-rgb),0.12)'}`,
                transition:'all .14s ease',
              }}>{g}</button>
            );
          })}
        </div>
      ),
    },
  ];

  const cur = steps[step];

  return (
    <div className="fade-in" style={{
      display:'flex', flexDirection:'column', height:'100%',
      padding: '48px 28px 28px',
      background:'radial-gradient(120% 50% at 50% 0%, rgba(253,166,90,0.10), transparent 60%), var(--ink)',
    }}>
      {/* progress */}
      <div style={{display:'flex', gap: 6, marginBottom: 28}}>
        {steps.map((_,i)=>(
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= step ? 'var(--cream)' : 'rgba(var(--fg-rgb),0.12)',
            transition:'background .25s ease',
          }}/>
        ))}
      </div>

      {/* Personalized hello */}
      {initialName && step === 0 && (
        <div style={{
          fontSize: 13, color:'var(--gold)', letterSpacing:'0.06em',
          textTransform:'uppercase', fontWeight: 600, marginBottom: 12,
        }}>
          Hi {initialName.split(' ')[0]}
        </div>
      )}

      <div key={step} className="fade-in">
        <div style={{
          fontFamily:'var(--serif)', fontSize: 40, lineHeight: 0.98, letterSpacing:'-0.02em',
          color:'var(--cream)', marginBottom: 12,
        }}>{cur.title}</div>
        <div style={{color:'var(--muted)', fontSize: 14, marginBottom: 28}}>{cur.sub}</div>
        {cur.body}
      </div>

      <div style={{marginTop:'auto', display:'flex', gap: 10}}>
        {step > 0 && (
          <PrimaryBtn secondary onClick={()=>setStep(s=>s-1)}>Back</PrimaryBtn>
        )}
        <PrimaryBtn full disabled={!cur.can} onClick={()=>{
          if (step < steps.length - 1) setStep(s=>s+1);
          else onDone({ contentType, services, genres });
        }}>
          {step < steps.length - 1 ? 'Continue' : 'Start matching'}
        </PrimaryBtn>
      </div>
    </div>
  );
}

// ─── Matches list ───────────────────────────────────────────────────
function MatchesScreen({ likes, onBack, onOpenMatch, onOpenMovie }) {
  // Collect every friend across all relationships
  const allFriends = [
    ...(window.FRIENDS.couple || []),
    ...(window.FRIENDS.family || []),
    ...(window.FRIENDS.friends || []),
  ];
  // Build matches per friend from the shared-match state: every film you
  // both want to watch (window.MATCHES seed + anything the user has liked).
  const matches = allFriends.map(f => {
    const friendLikes = new Set(window.MATCHES[f.id]?.movieIds || []);
    const watchedSet = new Set(window.MATCHES[f.id]?.watched || []);
    const matched = window.MOVIES.filter(m => friendLikes.has(m.id) && !watchedSet.has(m.id));
    const watched = window.MOVIES.filter(m => watchedSet.has(m.id));
    return { friend: f, matched, watched };
  }).filter(m => m.matched.length || m.watched.length)
    .sort((a,b) => b.matched.length - a.matched.length);

  const totalMatched = new Set(matches.flatMap(m => m.matched.map(x => x.id))).size;

  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <TopBar
        title="Matches"
        large
        onBack={onBack}
        subtitle={totalMatched ? `${totalMatched} films on your shared queue` : 'Films you both want to watch'}
      />

      <div className="phone-scroll" style={{flex:1, overflowY:'auto', paddingBottom: 120}}>
        {matches.length === 0 ? (
          <EmptyMatches/>
        ) : matches.map(({friend, matched, watched})=>(
          <FriendMatchSection
            key={friend.id}
            friend={friend}
            matched={matched}
            watched={watched}
            onOpen={()=> onOpenMatch(friend)}
            onOpenMovie={onOpenMovie}
          />
        ))}
      </div>
    </div>
  );
}

function FriendMatchSection({ friend, matched, watched, onOpen, onOpenMovie }) {
  // Subtle dot color per relationship
  const relTone = friend.rel === 'couple' ? 'var(--red)'
                : friend.rel === 'family' ? 'var(--gold)'
                : 'var(--cream)';
  return (
    <div style={{padding:'18px 18px 8px'}}>
      <button onClick={onOpen} style={{
        appearance:'none', border:0, background:'transparent', width:'100%',
        display:'flex', alignItems:'center', gap: 12, padding: 0, marginBottom: 14,
        color: 'var(--cream)',
      }}>
        <Avatar person={friend} size={42}/>
        <div style={{flex:1, textAlign:'left', minWidth:0}}>
          <div style={{
            fontFamily:'var(--sans)', fontSize: 15, fontWeight: 600,
            letterSpacing:'-0.01em',
            display:'flex', alignItems:'center', gap: 8,
          }}>
            {friend.name}
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: relTone, opacity: 0.8,
            }}/>
            <span style={{
              fontSize: 11, color:'var(--muted)', fontWeight: 500,
              padding:'2px 7px', borderRadius: 999,
              background:'rgba(var(--fg-rgb),0.07)',
            }}>{matched.length} match{matched.length===1?'':'es'}</span>
          </div>
          <div style={{fontSize: 12, color:'var(--muted)', marginTop: 2,
            textTransform:'capitalize',
          }}>
            {friend.rel === 'couple' ? 'Partner' : friend.rel === 'family' ? 'Family' : 'Friend'} · {friend.lastSeen}
          </div>
        </div>
        <Icon name="chev" size={16} color="var(--muted-2)"/>
      </button>

      {matched.length > 0 && (
        <div style={{
          display:'flex', gap: 10, overflowX:'auto', paddingBottom: 6,
          marginLeft: -18, marginRight: -18, padding:'0 18px 6px',
        }} className="phone-scroll">
          {matched.map(m => (
            <button key={m.id} onClick={()=>onOpenMovie(m, friend)} style={{
              appearance:'none', border:0, background:'transparent', padding:0,
              flexShrink: 0, position:'relative',
            }}>
              <Poster movie={m} size="md"/>
            </button>
          ))}
        </div>
      )}

      {watched.length > 0 && (
        <div style={{marginTop: 14}}>
          <div style={{
            fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase',
            color:'var(--muted)', marginBottom: 8, display:'flex', alignItems:'center', gap: 6,
          }}>
            <Icon name="check" size={11}/> Watched together
          </div>
          <div style={{display:'flex', gap: 8}}>
            {watched.map(m=> (
              <div key={m.id} style={{opacity: 0.65, filter:'saturate(.7)'}}>
                <Poster movie={m} size="sm"/>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{
        height: 0.5, background:'var(--line)', marginTop: 22,
      }}/>
    </div>
  );
}

function EmptyMatches() {
  return (
    <div style={{
      padding:'40px 32px', textAlign:'center', color:'var(--muted)',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius:'50%', margin:'0 auto 16px',
        background:'rgba(var(--fg-rgb),0.07)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Logomark size={36}/>
      </div>
      <div style={{fontFamily:'var(--serif)', fontSize: 22, color:'var(--cream)', lineHeight:1.1, marginBottom: 8}}>
        No matches yet.
      </div>
      <div style={{fontSize: 13, lineHeight:1.5}}>
        Keep swiping — once both of you<br/>want the same film, it'll show up here.
      </div>
    </div>
  );
}

// ─── Friends ────────────────────────────────────────────────────────
function FriendsScreen({ onBack, onOpenFriend, onOpenAdd }) {
  const [context, setContext] = React.useState('friends');
  const [query, setQuery] = React.useState('');

  const list = (window.FRIENDS[context] || []).filter(f =>
    !query || f.name.toLowerCase().includes(query.toLowerCase()) || f.handle.includes(query.toLowerCase())
  );

  return (
    <div className="fade-in" style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <TopBar
        title="Friends" large
        onBack={onBack}
        subtitle="Tap a friend to see your matches"
        right={
          <button onClick={onOpenAdd} style={{
            appearance:'none', border:0, background:'var(--red)',
            color:'#fff', width: 38, height: 38, borderRadius: 999,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 6px 16px rgba(255,109,41,0.35)',
          }}>
            <Icon name="plus" size={20} stroke={2.4}/>
          </button>
        }
      />

      <div style={{padding:'4px 18px 12px'}}>
        <ContextSwitcher value={context} onChange={setContext}/>
      </div>

      <div style={{padding:'0 18px 12px'}}>
        <div style={{
          display:'flex', alignItems:'center', gap: 10,
          background:'rgba(var(--fg-rgb),0.07)',
          border:'0.5px solid rgba(var(--fg-rgb),0.10)',
          borderRadius: 12, padding:'10px 14px',
        }}>
          <Icon name="search" size={16} color="var(--muted)"/>
          <input
            placeholder="Search friends"
            value={query}
            onChange={e=>setQuery(e.target.value)}
            style={{
              flex:1, background:'transparent', border:0, outline:0,
              color:'var(--cream)', fontFamily:'var(--sans)', fontSize: 14, letterSpacing:'-0.01em',
            }}
          />
        </div>
      </div>

      {/* Pending requests */}
      {window.PENDING.length > 0 && context==='friends' && (
        <div style={{padding:'4px 18px 16px'}}>
          <div style={{
            fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase',
            color:'var(--muted)', marginBottom: 10,
          }}>Wants to add you</div>
          <div style={{display:'flex', flexDirection:'column', gap: 8}}>
            {window.PENDING.map(p=>(
              <div key={p.id} style={{
                display:'flex', alignItems:'center', gap: 12,
                background:'linear-gradient(160deg, rgba(var(--fg-rgb),0.10), rgba(var(--fg-rgb),0.035))', backdropFilter:'blur(18px) saturate(150%)', WebkitBackdropFilter:'blur(18px) saturate(150%)',
                border:'0.5px solid rgba(var(--fg-rgb),0.08)',
                borderRadius: 16, padding:'10px 12px',
              }}>
                <Avatar person={p} size={40}/>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontWeight: 600, fontSize: 14, color:'var(--cream)'}}>{p.name}</div>
                  <div style={{fontSize: 12, color:'var(--muted)'}}>{p.mutual} mutual friends</div>
                </div>
                <button style={{
                  appearance:'none', border:0, padding:'8px 14px', borderRadius: 999,
                  background:'var(--cream)', color:'var(--ink)',
                  fontFamily:'var(--sans)', fontWeight: 600, fontSize: 12,
                }}>Accept</button>
                <button style={{
                  appearance:'none', border:0, padding:'8px 10px', borderRadius: 999,
                  background:'transparent', color:'var(--muted)',
                }}>
                  <Icon name="x" size={16}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List */}
      <div className="phone-scroll" style={{flex:1, overflowY:'auto', padding:'0 18px 120px'}}>
        <div style={{display:'flex', flexDirection:'column', gap: 4}}>
          {list.map(f=>(
            <FriendRow key={f.id} friend={f} onClick={()=>onOpenFriend(f)}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function FriendRow({ friend, onClick }) {
  const matchCount = window.MATCHES[friend.id]?.movieIds?.length || 0;
  return (
    <button onClick={onClick} style={{
      appearance:'none', border:0, background:'transparent',
      display:'flex', alignItems:'center', gap: 12,
      padding:'10px 6px', textAlign:'left',
      color: 'var(--cream)',
    }}>
      <Avatar person={friend} size={46}/>
      <div style={{flex:1, minWidth:0}}>
        <div style={{
          fontWeight: 600, fontSize: 15, letterSpacing:'-0.01em',
        }}>{friend.name}</div>
        <div style={{fontSize: 12, color:'var(--muted)', marginTop: 2}}>
          {matchCount > 0 ? `${matchCount} mutual film${matchCount===1?'':'s'}` : friend.lastSeen}
        </div>
      </div>
      {matchCount > 0 && (
        <div style={{
          padding:'4px 9px', borderRadius: 999, fontSize: 11, fontWeight: 600,
          background:'rgba(255,109,41,0.15)', color:'var(--red)',
          border:'0.5px solid rgba(255,109,41,0.3)',
        }}>
          {matchCount}
        </div>
      )}
      <Icon name="chev" size={14} color="var(--muted-2)"/>
    </button>
  );
}

// ─── Add Friend modal ───────────────────────────────────────────────
function AddFriendScreen({ onBack }) {
  const [method, setMethod] = React.useState('search');
  const [pickFor, setPickFor] = React.useState(null);   // person being added
  const [addedToast, setAddedToast] = React.useState('');

  const handleAdd = (person, category) => {
    // Push into the right relationship bucket
    const tones = { friends:'#E0955E', family:'#FDA65A', couple:'#FF6D29' };
    const id = 'fnew_' + Date.now();
    const newFriend = {
      id, name: person.name, handle: person.handle || `@${person.name.toLowerCase().replace(/\s+/g,'')}`,
      rel: category, initials: person.initials || person.name.split(' ').map(n=>n[0]).join('').slice(0,2),
      tone: person.tone || tones[category], online: false, lastSeen: 'Just added', mutual: person.mutual || 0,
    };
    if (!window.FRIENDS[category]) window.FRIENDS[category] = [];
    window.FRIENDS[category] = [newFriend, ...window.FRIENDS[category]];
    setPickFor(null);
    const labels = { friends:'Friend', family:'Family', couple:'Partner' };
    setAddedToast(`Added ${person.name} as ${labels[category]}`);
    setTimeout(()=> setAddedToast(''), 2000);
  };

  return (
    <div className="fade-in" style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <TopBar title="Add a friend" onBack={onBack}/>
      <div style={{padding:'8px 18px 14px'}}>
        <div style={{
          display:'flex', padding: 3, gap: 2,
          background:'rgba(var(--fg-rgb),0.07)', borderRadius: 12,
          border:'0.5px solid rgba(var(--fg-rgb),0.10)',
        }}>
          {[
            {id:'search', label:'Username'},
            {id:'contacts', label:'Contacts'},
            {id:'qr', label:'QR / Link'},
          ].map(o=>{
            const on = method===o.id;
            return (
              <button key={o.id} onClick={()=>setMethod(o.id)} style={{
                appearance:'none', border:0,
                flex:1, padding:'8px 6px', borderRadius: 9,
                background: on ? 'var(--cream)' : 'transparent',
                color: on ? 'var(--ink)' : 'var(--muted)',
                fontFamily:'var(--sans)', fontWeight: 600, fontSize: 12,
              }}>{o.label}</button>
            );
          })}
        </div>
      </div>

      <div className="phone-scroll" style={{flex:1, overflowY:'auto', padding:'4px 18px 120px'}}>
        {method === 'search' && <SearchUsername onAdd={(p)=> setPickFor(p)}/>}
        {method === 'contacts' && <ContactsList onAdd={(p)=> setPickFor(p)}/>}
        {method === 'qr' && <QRPanel/>}
      </div>

      {pickFor && (
        <CategoryPickerSheet
          person={pickFor}
          onClose={()=> setPickFor(null)}
          onPick={(cat)=> handleAdd(pickFor, cat)}
        />
      )}

      {addedToast && (
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
          {addedToast}
        </div>
      )}
    </div>
  );
}

function SearchUsername({ onAdd }) {
  const [q, setQ] = React.useState('');
  const candidates = [
    { name:'Iris Lane',  handle:'@iris',     initials:'IL', tone:'#E8945F', mutual: 3 },
    { name:'Marco Lin',  handle:'@marcol',   initials:'ML', tone:'#CC8050', mutual: 0 },
    { name:'Petra Vance',handle:'@petra.v',  initials:'PV', tone:'#E0955E', mutual: 1 },
  ];
  return (
    <div>
      <FieldInput type="text" placeholder="@username or name" value={q} onChange={setQ} icon="search"/>
      <div style={{marginTop: 16, display:'flex', flexDirection:'column', gap: 4}}>
        {candidates.map(p=>(
          <div key={p.handle} style={{display:'flex', alignItems:'center', gap: 12, padding:'10px 4px'}}>
            <Avatar person={p} size={42}/>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontWeight: 600, fontSize: 14, color:'var(--cream)'}}>{p.name}</div>
              <div style={{fontSize: 12, color:'var(--muted)'}}>{p.handle} · {p.mutual} mutual</div>
            </div>
            <button onClick={()=> onAdd(p)} style={{
              appearance:'none', border:'0.5px solid var(--cream)',
              background:'transparent', color:'var(--cream)',
              padding:'7px 14px', borderRadius: 999,
              fontFamily:'var(--sans)', fontWeight: 600, fontSize: 12,
            }}>Add</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactsList({ onAdd }) {
  const contacts = [
    { name:'Diego Marquez', initials:'DM', tone:'#FDA65A', phone:'(555) 010-1102', onApp:true },
    { name:'Yuki Sato',     initials:'YS', tone:'#E0955E', phone:'(555) 010-2208', onApp:true },
    { name:'Sam Reyes',     initials:'SR', tone:'#CC8050', phone:'(555) 010-3398', onApp:false },
    { name:'Nia Cole',      initials:'NC', tone:'#E8945F', phone:'(555) 010-4444', onApp:false },
  ];
  return (
    <div>
      <div style={{
        background:'rgba(253,166,90,0.08)',
        border:'0.5px solid rgba(253,166,90,0.18)',
        borderRadius: 14, padding:'12px 14px', marginBottom: 16,
        display:'flex', alignItems:'center', gap: 12,
        fontSize: 12.5, color:'var(--cream)', lineHeight: 1.45,
      }}>
        <Icon name="contacts" size={20} color="var(--gold)"/>
        Sync contacts to find people you already know on Match Doo.
      </div>
      <div style={{display:'flex', flexDirection:'column', gap: 4}}>
        {contacts.map(c=>(
          <div key={c.name} style={{display:'flex', alignItems:'center', gap: 12, padding:'10px 4px'}}>
            <Avatar person={c} size={42}/>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontWeight: 600, fontSize: 14, color:'var(--cream)'}}>{c.name}</div>
              <div style={{fontSize: 12, color:'var(--muted)'}}>{c.phone}</div>
            </div>
            <button onClick={c.onApp ? ()=> onAdd(c) : undefined} style={{
              appearance:'none', border: c.onApp ? '0' : '0.5px solid rgba(var(--fg-rgb),0.2)',
              background: c.onApp ? 'var(--cream)' : 'transparent',
              color: c.onApp ? 'var(--ink)' : 'var(--muted)',
              padding:'7px 12px', borderRadius: 999,
              fontFamily:'var(--sans)', fontWeight: 600, fontSize: 12,
            }}>{c.onApp ? 'Add' : 'Invite'}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function QRPanel() {
  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'20px 0 0'}}>
      <div style={{
        width: 220, height: 220, borderRadius: 24,
        background:'var(--cream)', padding: 18, boxSizing:'border-box',
        boxShadow:'0 24px 60px rgba(0,0,0,0.4)',
      }}>
        <QRArt/>
      </div>
      <div style={{
        fontFamily:'var(--serif)', fontSize: 24, color:'var(--cream)',
        marginTop: 24, lineHeight: 1.1,
      }}>Share your Match Doo</div>
      <div style={{fontSize: 13, color:'var(--muted)', marginTop: 8, maxWidth: 240, lineHeight:1.5}}>
        Friends can scan this — or use the link below — to add you instantly.
      </div>
      <div style={{
        marginTop: 22, padding:'12px 16px', borderRadius: 12,
        background:'rgba(var(--fg-rgb),0.07)',
        border:'0.5px solid rgba(var(--fg-rgb),0.10)',
        display:'flex', alignItems:'center', gap: 10,
        fontFamily:'var(--sans)', fontSize: 13, color:'var(--cream)',
      }}>
        <Icon name="link" size={14} color="var(--muted)"/>
        moviematch.app/u/alex
        <span style={{
          marginLeft: 8, fontSize: 11, color:'var(--gold)', fontWeight: 600,
        }}>COPY</span>
      </div>
    </div>
  );
}

function QRArt() {
  // procedural QR-ish pattern. Not a real QR.
  const cells = [];
  const seed = (i,j) => ((i*7 + j*11 + i*j) % 5) > 1;
  for (let i=0;i<11;i++) for (let j=0;j<11;j++) {
    if (seed(i,j)) cells.push(<rect key={i+'-'+j} x={j*16} y={i*16} width={14} height={14} rx={2} fill="#17100f"/>);
  }
  const corner = (cx, cy) => (
    <g key={cx+'-'+cy} transform={`translate(${cx},${cy})`}>
      <rect width="44" height="44" rx="8" fill="#17100f"/>
      <rect x="6" y="6" width="32" height="32" rx="4" fill="#f4f1ea"/>
      <rect x="12" y="12" width="20" height="20" rx="3" fill="#17100f"/>
    </g>
  );
  return (
    <svg viewBox="0 0 184 184" width="100%" height="100%">
      <rect width="184" height="184" fill="#f4f1ea"/>
      {cells}
      {corner(0,0)}
      {corner(140,0)}
      {corner(0,140)}
      {/* logo */}
      <g transform="translate(80,80)">
        <rect width="24" height="24" rx="6" fill="#FF6D29"/>
        <path d="M12 18 L7 13 a3 3 0 1 1 5 -3 a3 3 0 1 1 5 3 z" fill="#fff"/>
      </g>
    </svg>
  );
}

// ─── Friend profile ─────────────────────────────────────────────────
function FriendProfileScreen({ friend, onBack, onOpenMovie, onMarkWatched }) {
  const matches = window.MATCHES[friend.id] || { movieIds: [], watched: [] };
  const matchedSet = new Set(matches.movieIds);
  const watchedSet = new Set(matches.watched);
  const matched = window.MOVIES.filter(m => matchedSet.has(m.id) && !watchedSet.has(m.id));
  const watched = window.MOVIES.filter(m => watchedSet.has(m.id));

  return (
    <div className="fade-in" style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <TopBar title="" onBack={onBack}/>

      {/* Hero */}
      <div style={{
        padding:'4px 28px 24px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center',
      }}>
        <Avatar person={friend} size={92}/>
        <div style={{
          fontFamily:'var(--serif)', fontSize: 32, marginTop: 16, lineHeight: 1.05,
          color:'var(--cream)', letterSpacing:'-0.01em',
        }}>{friend.name}</div>
        <div style={{fontSize: 13, color:'var(--muted)', marginTop: 4}}>
          {friend.handle} · {friend.rel === 'couple' ? 'Partner' : friend.rel === 'family' ? 'Family' : 'Friend'}
        </div>

        <div style={{
          display:'flex', gap: 22, marginTop: 22, padding:'14px 22px',
          background:'linear-gradient(160deg, rgba(var(--fg-rgb),0.10), rgba(var(--fg-rgb),0.035))', backdropFilter:'blur(18px) saturate(150%)', WebkitBackdropFilter:'blur(18px) saturate(150%)',
          border:'0.5px solid rgba(var(--fg-rgb),0.08)',
          borderRadius: 16,
        }}>
          <Stat label="Matches" value={matched.length}/>
          <div style={{width:0.5, background:'var(--line)'}}/>
          <Stat label="Watched" value={watched.length}/>
          <div style={{width:0.5, background:'var(--line)'}}/>
          <Stat label="Mutual" value={friend.mutual}/>
        </div>
      </div>

      <div className="phone-scroll" style={{flex:1, overflowY:'auto', padding:'0 0 120px'}}>
        {/* Matched */}
        <Section title="On your shared queue" caption={`${matched.length} films you both want to watch`}>
          {matched.length === 0 ? (
            <EmptySectionRow text="No mutual films yet — keep swiping!"/>
          ) : (
            <PosterRow movies={matched} onTap={(m)=>onOpenMovie(m, friend)}/>
          )}
        </Section>

        {/* Watched */}
        <Section title="Watched together" caption={`${watched.length} films you've seen with ${friend.name.split(' ')[0]}`}>
          {watched.length === 0 ? (
            <EmptySectionRow text="Once you watch a match, tap “Watched” to log it here."/>
          ) : (
            <PosterRow movies={watched} dim onTap={(m)=>onOpenMovie(m, friend)}/>
          )}
        </Section>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{textAlign:'center'}}>
      <div style={{fontFamily:'var(--serif)', fontSize: 26, color:'var(--cream)', lineHeight: 1}}>{value}</div>
      <div style={{fontSize: 10, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--muted)', marginTop: 4}}>{label}</div>
    </div>
  );
}

function Section({ title, caption, children }) {
  return (
    <div style={{padding:'18px 18px 6px'}}>
      <div style={{
        fontFamily:'var(--sans)', fontWeight:600, fontSize: 13.5, color:'var(--cream)',
        letterSpacing:'-0.01em', marginBottom: 2,
      }}>{title}</div>
      {caption && <div style={{fontSize: 12, color:'var(--muted)', marginBottom: 12}}>{caption}</div>}
      {children}
    </div>
  );
}

function PosterRow({ movies, onTap, dim=false }) {
  return (
    <div style={{
      display:'flex', gap: 10, overflowX:'auto', padding:'2px 0 6px',
      marginLeft: -18, marginRight: -18, paddingLeft: 18, paddingRight: 18,
    }} className="phone-scroll">
      {movies.map(m=>(
        <button key={m.id} onClick={()=>onTap?.(m)} style={{
          appearance:'none', border:0, background:'transparent', padding:0,
          flexShrink:0, opacity: dim ? 0.65 : 1, filter: dim ? 'saturate(.7)' : 'none',
        }}>
          <Poster movie={m} size="md"/>
        </button>
      ))}
    </div>
  );
}

function EmptySectionRow({ text }) {
  return (
    <div style={{
      padding:'14px 16px', borderRadius: 14,
      background:'linear-gradient(160deg, rgba(var(--fg-rgb),0.10), rgba(var(--fg-rgb),0.035))', backdropFilter:'blur(18px) saturate(150%)', WebkitBackdropFilter:'blur(18px) saturate(150%)',
      border:'0.5px dashed rgba(var(--fg-rgb),0.12)',
      fontSize: 12.5, color:'var(--muted)', lineHeight: 1.5,
    }}>{text}</div>
  );
}

// ─── Profile / Settings ─────────────────────────────────────────────
function ProfileScreen({ user, onSignOut, onOpenTweaks, likedMovies = [], matchedMovies = [], seenMovies = [], onOpenMovie, onOpenMatches, theme = 'dark', onSetTheme, tmdbConnected, tmdbStatus, onOpenTmdb }) {
  const tmdbDetail = !tmdbConnected ? 'Not connected'
    : tmdbStatus === 'loading' ? 'Loading real posters…'
    : tmdbStatus === 'error' ? 'Connected · fetch failed'
    : 'Connected · real posters';

  // Editable profile settings (local prototype state)
  const [genres, setGenres] = React.useState(new Set(['Drama','Romance','Sci-Fi','Thriller','Mystery','Comedy']));
  const [services, setServices] = React.useState(new Set(['Netflix','Prime','Max']));
  const [runtime, setRuntime] = React.useState('90–150 min');
  const [email, setEmail] = React.useState('alex@cinema.com');
  const [phone, setPhone] = React.useState('+1 (555) 010-2025');
  const [notif, setNotif] = React.useState({ matches:true, newFriends:true, reminders:false });
  const [sheet, setSheet] = React.useState(null);
  const [toast, setToast] = React.useState('');

  const flash = (m) => { setToast(m); setTimeout(()=> setToast(''), 1600); };

  const svc = [...services];
  const servicesDetail = svc.length === 0 ? 'None'
    : svc.length <= 2 ? svc.join(', ')
    : `${svc[0]}, ${svc[1]}, +${svc.length - 2}`;
  const notifOn = Object.values(notif).filter(Boolean).length;

  // Tappable stat lists → poster grid. All three are real, derived from
  // the user's actual swipes (likes / matches / passes) — no mock numbers.
  const [listView, setListView] = React.useState(null);
  const [showTheme, setShowTheme] = React.useState(false);
  const [profileName, setProfileName] = React.useState(user.name || 'Alex Carter');
  const [handle, setHandle] = React.useState('alex');
  const [avatarSrc, setAvatarSrc] = React.useState((window.AVATAR_POOL || [])[0] || null);
  const [customPics, setCustomPics] = React.useState([]); // user-added photos (data URLs)
  const [showProfileEdit, setShowProfileEdit] = React.useState(false);
  const avatarPhoto = avatarSrc;
  // Which friends also want a given movie (for the Matches list)
  const allFriendsList = [...(window.FRIENDS?.couple||[]), ...(window.FRIENDS?.family||[]), ...(window.FRIENDS?.friends||[])];
  const friendsForMovie = (mid) => allFriendsList.filter(f => (window.MATCHES[f.id]?.movieIds||[]).includes(mid));

  const settingsState = { genres, setGenres, services, setServices, runtime, setRuntime,
    email, setEmail, phone, setPhone, notif, setNotif };

  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%', position:'relative'}}>
      <TopBar title="You" large/>

      <div style={{padding:'10px 18px 14px'}}>
        <button onClick={()=> setShowProfileEdit(true)} className="tap-row" style={{
          appearance:'none', width:'100%', textAlign:'left', cursor:'pointer',
          padding:'22px 22px', borderRadius: 22,
          background:'linear-gradient(160deg, rgba(255,109,41,0.18), rgba(253,166,90,0.06) 70%, transparent)',
          border:'0.5px solid rgba(var(--fg-rgb),0.10)',
          display:'flex', alignItems:'center', gap: 16, color:'var(--cream)',
        }}>
          <Avatar person={{initials: (profileName||'A').slice(0,2).toUpperCase(), photo: avatarPhoto}} size={62}/>
          <div style={{flex:1, minWidth:0}}>
            <div style={{
              fontFamily:'var(--serif)', fontSize: 26, color:'var(--cream)',
              lineHeight: 1.05, letterSpacing:'-0.01em',
            }}>{profileName || 'Alex Carter'}</div>
            <div style={{fontSize: 12, color:'var(--muted)', marginTop: 4}}>@{handle} · joined May 2026</div>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: 999, flexShrink: 0,
            background:'rgba(var(--fg-rgb),0.09)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name="settings" size={15} color="var(--muted)"/>
          </div>
        </button>
      </div>

      <div className="phone-scroll" style={{flex:1, overflowY:'auto', padding:'18px 0 130px'}}>
        <div style={{display:'flex', gap: 10, padding:'0 18px 18px'}}>
          <ProfileStatCard label="Want to watch" value={likedMovies.length} accent="var(--red)"
            onClick={()=> setListView({ title:'Want to watch', movies: likedMovies })}/>
          <ProfileStatCard label="Matches" value={matchedMovies.length} accent="var(--green)"
            onClick={()=> onOpenMatches && onOpenMatches()}/>
          <ProfileStatCard label="Seen" value={seenMovies.length} accent="var(--gold)"
            onClick={()=> setListView({ title:'Seen', movies: seenMovies })}/>
        </div>

        <SettingsGroup title="Taste">
          <SettingsRow icon="sparkle" label="Genres" detail={`${genres.size} selected`} onClick={()=> setSheet('genres')}/>
          <SettingsRow icon="film" label="Streaming services" detail={servicesDetail} onClick={()=> setSheet('services')}/>
          <SettingsRow icon="clock" label="Run time preference" detail={runtime} onClick={()=> setSheet('runtime')}/>
        </SettingsGroup>

        <SettingsGroup title="Account">
          <SettingsRow icon="mail" label="Email" detail={email} onClick={()=> setSheet('email')}/>
          <SettingsRow icon="phone" label="Phone" detail={phone} onClick={()=> setSheet('phone')}/>
          <SettingsRow icon="bell" label="Notifications" detail={`${notifOn} on`} onClick={()=> setSheet('notifications')}/>
        </SettingsGroup>

        <SettingsGroup title="Films">
          <SettingsRow icon="film" label="TMDB integration"
            detail={tmdbDetail}
            onClick={onOpenTmdb}/>
        </SettingsGroup>

        <SettingsGroup title="App">
          <SettingsRow icon="settings" label="Customize design" detail={theme === 'light' ? 'Light' : 'Dark'} onClick={()=> setShowTheme(true)}/>
          <SettingsRow icon="x" label="Sign out" onClick={onSignOut} danger/>
        </SettingsGroup>

        <div style={{
          textAlign:'center', padding:'24px 18px', fontSize: 11, color:'var(--muted-2)',
          fontFamily:'var(--serif)', fontStyle:'italic', fontSize: 14,
        }}>
          Match Doo · made for movie nights
        </div>
      </div>

      {sheet && (
        <ProfileSettingSheet
          kind={sheet}
          state={settingsState}
          onClose={()=> setSheet(null)}
          onSaved={flash}
        />
      )}

      {listView && (
        <MovieListSheet
          title={listView.title}
          movies={listView.movies}
          onClose={()=> setListView(null)}
          onOpenMovie={onOpenMovie}
          friendsFor={listView.friends ? friendsForMovie : null}
        />
      )}

      {showTheme && (
        <ThemePickerSheet
          theme={theme}
          onPick={(t)=> onSetTheme?.(t)}
          onClose={()=> setShowTheme(false)}
        />
      )}

      {showProfileEdit && (
        <ProfileEditSheet
          name={profileName} handle={handle}
          avatarSrc={avatarSrc}
          pool={window.AVATAR_POOL || []}
          customPics={customPics}
          onAddPic={(url)=> setCustomPics(p => p.includes(url) ? p : [url, ...p])}
          onSave={(n, h, src)=>{ setProfileName(n); setHandle(h); setAvatarSrc(src); setShowProfileEdit(false); flash('Profile updated'); }}
          onClose={()=> setShowProfileEdit(false)}
        />
      )}

      {toast && (
        <div className="rise" style={{
          position:'absolute', left:'50%', bottom: 96, transform:'translateX(-50%)',
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
  );
}

// ─── Profile setting bottom-sheet ───────────────────────────────────
// One reusable sheet that edits whichever profile setting was tapped.
function ProfileSettingSheet({ kind, state, onClose, onSaved }) {
  const GENRE_OPTS = ['Drama','Romance','Sci-Fi','Comedy','Thriller','Mystery','Animation','Music','Adventure','Crime','Fantasy','Family','History','Horror','Documentary'];
  const SERVICE_OPTS = Object.keys(window.SERVICES || {});
  const RUNTIME_OPTS = ['Under 90 min','90–150 min','Over 150 min','No preference'];

  // draft copies so Cancel discards
  const [gDraft, setGDraft] = React.useState(new Set(state.genres));
  const [sDraft, setSDraft] = React.useState(new Set(state.services));
  const [rDraft, setRDraft] = React.useState(state.runtime);
  const [eDraft, setEDraft] = React.useState(state.email);
  const [pDraft, setPDraft] = React.useState(state.phone);
  const [nDraft, setNDraft] = React.useState({ ...state.notif });

  const toggleSet = (set, val) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    return next;
  };

  const META = {
    genres:        { title:'Genres',              save:()=>{ state.setGenres(gDraft);     onSaved('Genres updated'); } },
    services:      { title:'Streaming services',  save:()=>{ state.setServices(sDraft);   onSaved('Services updated'); } },
    runtime:       { title:'Run time preference', save:()=>{ state.setRuntime(rDraft);    onSaved('Preference saved'); } },
    email:         { title:'Email',               save:()=>{ state.setEmail(eDraft.trim()); onSaved('Email saved'); } },
    phone:         { title:'Phone',               save:()=>{ state.setPhone(pDraft.trim()); onSaved('Phone saved'); } },
    notifications: { title:'Notifications',       save:()=>{ state.setNotif(nDraft);      onSaved('Notifications saved'); } },
  }[kind];

  const save = () => { META.save(); onClose(); };

  const chip = (label, on, onTap) => (
    <button key={label} onClick={onTap} style={{
      appearance:'none', padding:'9px 14px', borderRadius: 999,
      background: on ? 'var(--cream)' : 'rgba(var(--fg-rgb),0.06)',
      color: on ? 'var(--ink)' : 'var(--cream)',
      fontFamily:'var(--sans)', fontWeight: on ? 600 : 500, fontSize: 13,
      border: `0.5px solid ${on ? 'var(--cream)' : 'rgba(var(--fg-rgb),0.12)'}`,
    }}>{label}</button>
  );

  let body = null;
  if (kind === 'genres') {
    body = (
      <div style={{display:'flex', flexWrap:'wrap', gap: 8}}>
        {GENRE_OPTS.map(g => chip(g, gDraft.has(g), ()=> setGDraft(s=> toggleSet(s, g))))}
      </div>
    );
  } else if (kind === 'services') {
    body = (
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10}}>
        {SERVICE_OPTS.map(s => {
          const on = sDraft.has(s);
          return (
            <button key={s} onClick={()=> setSDraft(set=> toggleSet(set, s))} style={{
              appearance:'none', border:`0.5px solid ${on ? 'var(--cream)' : 'rgba(var(--fg-rgb),0.12)'}`,
              padding:'12px 14px', borderRadius: 14, textAlign:'left',
              background: on ? 'rgba(var(--fg-rgb),0.08)' : 'rgba(var(--fg-rgb),0.03)',
              display:'flex', alignItems:'center', gap: 10,
              color:'var(--cream)', fontFamily:'var(--sans)', fontWeight: 500, fontSize: 13,
            }}>
              <ServiceChip name={s} size={26}/>
              <span style={{flex:1}}>{s}</span>
              {on && <Icon name="check" size={16} color="var(--cream)"/>}
            </button>
          );
        })}
      </div>
    );
  } else if (kind === 'runtime') {
    body = (
      <div style={{display:'flex', flexDirection:'column', gap: 8}}>
        {RUNTIME_OPTS.map(o => {
          const on = rDraft === o;
          return (
            <button key={o} onClick={()=> setRDraft(o)} style={{
              appearance:'none', border:`0.5px solid ${on ? 'var(--cream)' : 'rgba(var(--fg-rgb),0.12)'}`,
              background: on ? 'rgba(var(--fg-rgb),0.08)' : 'rgba(var(--fg-rgb),0.03)',
              padding:'14px 16px', borderRadius: 14, textAlign:'left',
              display:'flex', alignItems:'center', justifyContent:'space-between',
              color:'var(--cream)', fontFamily:'var(--sans)', fontWeight: 500, fontSize: 14,
            }}>
              {o}
              {on && <Icon name="check" size={16} color="var(--cream)"/>}
            </button>
          );
        })}
      </div>
    );
  } else if (kind === 'email' || kind === 'phone') {
    const isEmail = kind === 'email';
    body = (
      <input
        autoFocus
        type={isEmail ? 'email' : 'tel'}
        inputMode={isEmail ? 'email' : 'tel'}
        value={isEmail ? eDraft : pDraft}
        onChange={e => isEmail ? setEDraft(e.target.value) : setPDraft(e.target.value)}
        placeholder={isEmail ? 'you@email.com' : '+1 (555) 000-0000'}
        style={{
          width:'100%', background:'rgba(var(--fg-rgb),0.07)',
          border:'0.5px solid rgba(var(--fg-rgb),0.14)', borderRadius: 14,
          padding:'14px 16px', color:'var(--cream)', outline:0,
          fontFamily:'var(--sans)', fontSize: 16,
        }}
      />
    );
  } else if (kind === 'notifications') {
    const ROWS = [
      { id:'matches',    label:'New matches',   desc:'When you and a friend both like a film' },
      { id:'newFriends', label:'Friend activity', desc:'When someone adds you or joins a room' },
      { id:'reminders',  label:'Movie-night reminders', desc:'Nudges to keep swiping together' },
    ];
    body = (
      <div style={{display:'flex', flexDirection:'column', gap: 4}}>
        {ROWS.map(row => (
          <button key={row.id} onClick={()=> setNDraft(n => ({ ...n, [row.id]: !n[row.id] }))} style={{
            appearance:'none', border:0, background:'transparent',
            display:'flex', alignItems:'center', gap: 12, textAlign:'left',
            padding:'10px 2px', color:'var(--cream)',
          }}>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize: 14.5, fontWeight: 600}}>{row.label}</div>
              <div style={{fontSize: 12, color:'var(--muted)', marginTop: 2}}>{row.desc}</div>
            </div>
            <Toggle on={nDraft[row.id]}/>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0, zIndex: 200,
      background:'rgba(var(--bg-rgb),0.7)',
      backdropFilter:'blur(16px) saturate(140%)',
      WebkitBackdropFilter:'blur(16px) saturate(140%)',
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
    }}>
      <div onClick={e=>e.stopPropagation()} className="rise" style={{
        background:'var(--ink)', borderRadius:'28px 28px 0 0',
        padding:'14px 20px 26px', boxShadow:'0 -20px 40px rgba(0,0,0,0.5)',
        border:'0.5px solid rgba(var(--fg-rgb),0.10)', borderBottom: 0,
        maxHeight:'82%', display:'flex', flexDirection:'column',
      }}>
        <div style={{
          width: 42, height: 4, borderRadius: 2,
          background:'rgba(var(--fg-rgb),0.25)', margin:'0 auto 14px',
        }}/>

        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 16}}>
          <div style={{fontFamily:'var(--serif)', fontSize: 24, color:'var(--cream)', lineHeight: 1.1}}>{META.title}</div>
          <button onClick={onClose} style={{
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.09)',
            width: 34, height: 34, borderRadius: 999, color:'var(--muted)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name="x" size={16}/>
          </button>
        </div>

        <div className="phone-scroll" style={{overflowY:'auto', paddingBottom: 6}}>
          {body}
        </div>

        <div style={{marginTop: 16}}>
          <PrimaryBtn full onClick={save}>Save</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

// small pill toggle
function Toggle({ on }) {
  return (
    <div style={{
      width: 44, height: 26, borderRadius: 999, flexShrink: 0,
      background: on ? 'var(--green)' : 'rgba(var(--fg-rgb),0.16)',
      border:'0.5px solid rgba(var(--fg-rgb),0.12)',
      position:'relative', transition:'background .18s ease',
    }}>
      <div style={{
        position:'absolute', top: 2.5, left: on ? 20 : 2.5,
        width: 20, height: 20, borderRadius: '50%', background:'#fff',
        transition:'left .18s cubic-bezier(.2,.7,.2,1)',
        boxShadow:'0 1px 3px rgba(0,0,0,0.35)',
      }}/>
    </div>
  );
}

function ProfileStatCard({ label, value, accent, onClick }) {
  return (
    <button onClick={onClick} className="tap-row" style={{
      appearance:'none', textAlign:'left', cursor:'pointer',
      flex: 1, padding:'14px 14px', borderRadius: 18,
      background:'linear-gradient(160deg, rgba(var(--fg-rgb),0.10), rgba(var(--fg-rgb),0.035))', backdropFilter:'blur(18px) saturate(150%)', WebkitBackdropFilter:'blur(18px) saturate(150%)',
      border:'0.5px solid rgba(var(--fg-rgb),0.08)',
      display:'flex', flexDirection:'column',
    }}>
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <span style={{fontFamily:'var(--serif)', fontSize: 28, color: accent, lineHeight: 1}}>{value}</span>
        <Icon name="chev" size={13} color="var(--muted-2)"/>
      </div>
      <div style={{fontSize: 11, color:'var(--muted)', marginTop: 6, lineHeight: 1.3}}>{label}</div>
    </button>
  );
}

// ─── Movie list (poster grid) — opened from the profile stat cards ──
function MovieListSheet({ title, movies = [], onClose, onOpenMovie, friendsFor }) {
  return (
    <div className="fade-in" style={{
      position:'absolute', inset: 0, zIndex: 120,
      background:'var(--ink)', display:'flex', flexDirection:'column',
    }}>
      <TopBar title={title} onBack={onClose} right={
        <div style={{fontSize: 12.5, color:'var(--muted)', paddingRight: 4}}>
          {movies.length} {movies.length === 1 ? 'title' : 'titles'}
        </div>
      }/>

      {movies.length === 0 ? (
        <div style={{
          flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          gap: 12, color:'var(--muted)', textAlign:'center', padding:'0 40px',
        }}>
          <Icon name="film" size={30} color="var(--muted)"/>
          <div style={{fontSize: 14, lineHeight: 1.5}}>Nothing here yet — keep swiping to fill this list.</div>
        </div>
      ) : (
        <div className="phone-scroll" style={{flex:1, overflowY:'auto', padding:'8px 18px 130px'}}>
          <div style={{
            display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))', gap: 12,
          }}>
            {movies.map(m => (
              <button key={m.id} onClick={()=> onOpenMovie?.(m)} style={{
                appearance:'none', border:0, background:'transparent', padding:0,
                textAlign:'left', cursor:'pointer', color:'var(--cream)',
              }}>
                <div style={{
                  width:'100%', aspectRatio:'2/3', borderRadius: 12, overflow:'hidden',
                  boxShadow:'0 6px 16px rgba(0,0,0,0.35)',
                }}>
                  <Poster movie={m} size="sm" hideTitle style={{width:'100%', height:'100%'}}/>
                </div>
                <div style={{
                  fontSize: 12, fontWeight: 600, marginTop: 6, lineHeight: 1.2,
                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                }}>{m.title}</div>
                {friendsFor ? (() => {
                  const fr = friendsFor(m.id);
                  if (!fr.length) return <div style={{fontSize: 10.5, color:'var(--muted)', marginTop: 2}}>{m.year}</div>;
                  return (
                    <div style={{display:'flex', alignItems:'center', gap: 5, marginTop: 4}}>
                      <div style={{display:'flex'}}>
                        {fr.slice(0,3).map((f, i) => (
                          <div key={f.id} style={{marginLeft: i===0?0:-6, border:'1.5px solid var(--ink)', borderRadius:'50%'}}>
                            <Avatar person={f} size={18}/>
                          </div>
                        ))}
                      </div>
                      <span style={{fontSize: 10.5, color:'var(--green)', fontWeight: 600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                        {fr[0].name.split(' ')[0]}{fr.length>1?` +${fr.length-1}`:''}
                      </span>
                    </div>
                  );
                })() : (
                  <div style={{fontSize: 10.5, color:'var(--muted)', marginTop: 1}}>
                    {m.type === 'series' ? `${m.seasons || 1} season${(m.seasons||1)>1?'s':''}` : m.year}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Appearance / theme picker (Dark / Light) ──────────────────────
function ThemePickerSheet({ theme, onPick, onClose }) {
  const OPTIONS = [
    { id:'dark',  label:'Dark',  desc:'Ember on near-black — the signature look.', bg:'#17100f', fg:'#f6f1ea', card:'rgba(244,241,234,0.08)' },
    { id:'light', label:'Light', desc:'Warm & airy for daytime.',                  bg:'#f7f1ea', fg:'#1c1512', card:'rgba(34,24,20,0.06)' },
  ];
  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0, zIndex: 200,
      background:'rgba(var(--bg-rgb),0.7)',
      backdropFilter:'blur(16px) saturate(140%)', WebkitBackdropFilter:'blur(16px) saturate(140%)',
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
    }}>
      <div onClick={e=>e.stopPropagation()} className="rise" style={{
        background:'var(--ink)', borderRadius:'28px 28px 0 0',
        padding:'14px 20px 26px', boxShadow:'0 -20px 40px rgba(0,0,0,0.5)',
        border:'0.5px solid rgba(var(--fg-rgb),0.10)', borderBottom: 0,
      }}>
        <div style={{
          width: 42, height: 4, borderRadius: 2,
          background:'rgba(var(--fg-rgb),0.25)', margin:'0 auto 14px',
        }}/>

        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 4}}>
          <div style={{fontFamily:'var(--serif)', fontSize: 24, color:'var(--cream)', lineHeight: 1.1}}>Appearance</div>
          <button onClick={onClose} style={{
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.09)',
            width: 34, height: 34, borderRadius: 999, color:'var(--muted)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name="x" size={16}/>
          </button>
        </div>
        <div style={{fontSize: 12.5, color:'var(--muted)', marginBottom: 18}}>Choose how Match Doo looks.</div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12}}>
          {OPTIONS.map(o => {
            const on = theme === o.id;
            return (
              <button key={o.id} onClick={()=> onPick(o.id)} style={{
                appearance:'none', cursor:'pointer', textAlign:'left', padding: 8,
                borderRadius: 18,
                border:`1.5px solid ${on ? 'var(--red)' : 'rgba(var(--fg-rgb),0.12)'}`,
                background: on ? 'rgba(255,109,41,0.08)' : 'transparent',
              }}>
                {/* mini preview */}
                <div style={{
                  aspectRatio:'16/11', borderRadius: 12, background: o.bg, overflow:'hidden',
                  padding: 10, display:'flex', flexDirection:'column', gap: 6,
                  border:'0.5px solid rgba(128,128,128,0.18)',
                }}>
                  <div style={{display:'flex', alignItems:'center', gap: 6}}>
                    <div style={{width: 16, height: 16, borderRadius: 5, background:'#FF6D29'}}/>
                    <div style={{height: 6, width: 42, borderRadius: 3, background: o.fg, opacity: 0.85}}/>
                  </div>
                  <div style={{flex:1, borderRadius: 8, background: o.card}}/>
                  <div style={{height: 6, width: '70%', borderRadius: 3, background: o.fg, opacity: 0.55}}/>
                </div>

                <div style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'10px 4px 2px',
                }}>
                  <div>
                    <div style={{fontSize: 14.5, fontWeight: 600, color:'var(--cream)'}}>{o.label}</div>
                    <div style={{fontSize: 11, color:'var(--muted)', marginTop: 1, lineHeight: 1.3}}>{o.desc}</div>
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius:'50%', flexShrink: 0,
                    border:`1.5px solid ${on ? 'var(--red)' : 'rgba(var(--fg-rgb),0.22)'}`,
                    background: on ? 'var(--red)' : 'transparent',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    {on && <Icon name="check" size={13} color="#fff" stroke={3}/>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Edit profile (name + handle) ──────────────────────────────────
function ProfileEditSheet({ name, handle, avatarSrc, pool = [], customPics = [], onAddPic, onSave, onClose }) {
  const [n, setN] = React.useState(name);
  const [h, setH] = React.useState(handle);
  const [src, setSrc] = React.useState(avatarSrc || pool[0] || null);
  const fileRef = React.useRef(null);

  // Add a picture from the user's device — read locally as a data URL,
  // select it, and hand it up so it persists in the picker.
  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';               // allow re-picking the same file
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => { const url = reader.result; onAddPic && onAddPic(url); setSrc(url); };
    reader.readAsDataURL(file);
  };

  // Slider order: Add first, then the user's photos, then the default set.
  const pics = [...customPics, ...pool];
  const field = (label, value, setValue, prefix, autoFocus) => (
    <div>
      <div style={{fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)', margin:'0 0 8px 2px'}}>{label}</div>
      <div style={{
        display:'flex', alignItems:'center', gap: 4,
        background:'rgba(var(--fg-rgb),0.07)', border:'0.5px solid rgba(var(--fg-rgb),0.14)',
        borderRadius: 14, padding:'12px 14px',
      }}>
        {prefix && <span style={{color:'var(--muted)', fontSize: 16}}>{prefix}</span>}
        <input
          autoFocus={autoFocus}
          value={value}
          onChange={e => setValue(prefix ? e.target.value.replace(/[^a-zA-Z0-9_.]/g,'') : e.target.value)}
          style={{
            flex:1, background:'transparent', border:0, outline:0,
            color:'var(--cream)', fontFamily:'var(--sans)', fontSize: 16,
          }}
        />
      </div>
    </div>
  );
  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0, zIndex: 200,
      background:'rgba(var(--bg-rgb),0.7)',
      backdropFilter:'blur(16px) saturate(140%)', WebkitBackdropFilter:'blur(16px) saturate(140%)',
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
    }}>
      <div onClick={e=>e.stopPropagation()} className="rise" style={{
        background:'var(--ink)', borderRadius:'28px 28px 0 0',
        padding:'14px 20px 26px', boxShadow:'0 -20px 40px rgba(0,0,0,0.5)',
        border:'0.5px solid rgba(var(--fg-rgb),0.10)', borderBottom: 0,
      }}>
        <div style={{width: 42, height: 4, borderRadius: 2, background:'rgba(var(--fg-rgb),0.25)', margin:'0 auto 14px'}}/>

        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 18}}>
          <div style={{fontFamily:'var(--serif)', fontSize: 24, color:'var(--cream)', lineHeight: 1.1}}>Edit profile</div>
          <button onClick={onClose} style={{
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.09)',
            width: 34, height: 34, borderRadius: 999, color:'var(--muted)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name="x" size={16}/>
          </button>
        </div>

        <div style={{marginBottom: 20}}>
          <div style={{fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)', margin:'0 0 10px 2px'}}>Profile picture</div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{display:'none'}}/>
          <div
            className="phone-scroll"
            onWheel={(e)=>{ const el = e.currentTarget; if (el.scrollWidth > el.clientWidth && Math.abs(e.deltaY) >= Math.abs(e.deltaX)) el.scrollLeft += e.deltaY; }}
            style={{
              display:'flex', gap: 12, overflowX:'auto', padding:'2px 2px 6px',
              touchAction:'pan-x', WebkitOverflowScrolling:'touch', overscrollBehaviorX:'contain',
            }}>
            {/* Add — always first */}
            <button onClick={()=> fileRef.current && fileRef.current.click()} aria-label="Add photo" style={{
              appearance:'none', cursor:'pointer', flexShrink: 0, padding: 0,
              width: 56, height: 56, borderRadius:'50%',
              background:'rgba(var(--fg-rgb),0.07)',
              border:'1.5px dashed rgba(var(--fg-rgb),0.30)', color:'var(--muted)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Icon name="plus" size={20} stroke={2}/>
            </button>
            {pics.map((p, i) => {
              const on = p === src;
              return (
                <button key={p.slice(0,32) + i} onClick={()=> setSrc(p)} aria-label={`Photo ${i+1}`} style={{
                  appearance:'none', cursor:'pointer', flexShrink: 0, padding: 0,
                  width: 56, height: 56, borderRadius:'50%',
                  backgroundImage:`url("${p}")`, backgroundSize:'cover', backgroundPosition:'center',
                  border: on ? '2px solid var(--red)' : '2px solid transparent',
                  boxShadow: on ? '0 0 0 2px var(--ink), 0 0 0 3.5px var(--red)' : 'inset 0 0 0 0.5px rgba(0,0,0,0.1)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {on && (
                    <span style={{
                      width: 22, height: 22, borderRadius:'50%', background:'var(--red)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <Icon name="check" size={13} color="#fff" stroke={3}/>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap: 16, marginBottom: 20}}>
          {field('Name', n, setN, null, true)}
          {field('Username', h, setH, '@', false)}
        </div>

        <PrimaryBtn full disabled={!n.trim() || !h.trim()} onClick={()=> onSave(n.trim(), h.trim(), src)}>
          Save
        </PrimaryBtn>
      </div>
    </div>
  );
}

function SettingsGroup({ title, children }) {
  return (
    <div style={{marginBottom: 20}}>
      <div style={{
        fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase',
        color:'var(--muted)', padding:'0 24px 8px',
      }}>{title}</div>
      <div style={{
        margin:'0 18px', borderRadius: 16,
        background:'linear-gradient(160deg, rgba(var(--fg-rgb),0.10), rgba(var(--fg-rgb),0.035))', backdropFilter:'blur(18px) saturate(150%)', WebkitBackdropFilter:'blur(18px) saturate(150%)',
        border:'0.5px solid rgba(var(--fg-rgb),0.08)',
        overflow:'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

function SettingsRow({ icon, label, detail, onClick, danger }) {
  return (
    <button onClick={onClick} className="tap-row" style={{
      appearance:'none', border:0, background:'transparent',
      width:'100%', textAlign:'left',
      display:'flex', alignItems:'center', gap: 14,
      padding:'15px 18px',
      color: danger ? '#E8798A' : 'var(--cream)',
      borderBottom:'0.5px solid var(--line)',
    }}>
      <IconBadge icon={icon} size={34} tone={danger ? '#E8798A' : '#E0955E'}/>
      <div style={{flex:1, fontSize: 14, fontWeight: 500}}>{label}</div>
      {detail && <div style={{fontSize: 12.5, color:'var(--muted)'}}>{detail}</div>}
      {!danger && <Icon name="chev" size={14} color="var(--muted-2)"/>}
    </button>
  );
}

// ─── TMDB connect sheet ──────────────────────────────────────────────
// Lets the person paste a free TMDB API key so the app can pull real
// posters + metadata straight from TMDB's official image CDN at runtime.
// Nothing is ever bundled/scraped — this only wires up the person's own key.
function TmdbConnectSheet({ connected, status, onSave, onDisconnect, onClose }) {
  const [key, setKey] = React.useState(() => window.TMDB?.getKey() || '');
  const [touched, setTouched] = React.useState(false);
  const loading = status === 'loading';
  const errored = status === 'error';

  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0, zIndex: 300,
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
          background:'rgba(var(--fg-rgb),0.25)', margin:'0 auto 16px',
        }}/>

        <div style={{display:'flex', alignItems:'center', gap: 12, marginBottom: 6}}>
          <IconBadge icon="film" size={44} tone="#E0955E"/>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontFamily:'var(--serif)', fontSize: 24, lineHeight: 1.1, color:'var(--cream)'}}>
              TMDB integration
            </div>
            <div style={{fontSize: 12, color:'var(--muted)', marginTop: 2}}>
              {status === 'error' ? "Key saved, but the request failed"
                : status === 'loading' ? 'Connecting…'
                : connected ? 'Connected · pulling real posters'
                : 'Not connected · showing illustrated posters'}
            </div>
          </div>
        </div>

        <div style={{fontSize: 13, color:'var(--muted)', lineHeight: 1.5, margin:'14px 0'}}>
          Paste a free TMDB API key (v3 auth or v4 read token) to replace the
          illustrated posters with real ones, pulled live from TMDB's own
          servers. Your key stays on this device only.
        </div>

        <input
          value={key}
          onChange={e=>{ setKey(e.target.value); setTouched(true); }}
          placeholder="Paste your TMDB API key"
          autoCapitalize="off" autoCorrect="off" spellCheck={false}
          style={{
            width:'100%', background:'rgba(var(--fg-rgb),0.07)',
            border:`0.5px solid ${errored ? 'rgba(232,121,138,0.5)' : 'rgba(var(--fg-rgb),0.14)'}`,
            borderRadius: 12, padding:'12px 14px',
            color:'var(--cream)', fontFamily:'var(--sans)', fontSize: 14,
            outline: 0, marginBottom: 8,
          }}
        />

        {errored && (
          <div style={{fontSize: 12, color:'#E8798A', marginBottom: 8}}>
            Couldn't connect — double check the key and try again.
          </div>
        )}

        <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer"
          style={{
            display:'inline-flex', alignItems:'center', gap: 6,
            fontSize: 12.5, color:'#E0955E', marginBottom: 18, textDecoration:'none',
          }}>
          Get a free API key at themoviedb.org
          <Icon name="link" size={12} color="#E0955E"/>
        </a>

        <div style={{display:'flex', gap: 8}}>
          {connected && (
            <button onClick={onDisconnect} style={{
              appearance:'none', border:'0.5px solid rgba(var(--fg-rgb),0.14)', background:'transparent',
              color:'var(--muted)', borderRadius: 999, padding:'13px 18px',
              fontFamily:'var(--sans)', fontWeight: 500, fontSize: 14,
            }}>Disconnect</button>
          )}
          <PrimaryBtn full onClick={()=> key.trim() && onSave(key.trim())}
            disabled={!key.trim() || loading}
            style={{opacity: (!key.trim() || loading) ? 0.5 : 1}}>
            {loading ? 'Connecting…' : connected ? 'Update key' : 'Connect'}
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

// ─── Movie detail sheet ─────────────────────────────────────────────
function MovieDetailSheet({ movie, friend, onClose, onMarkWatched }) {
  if (!movie) return null;
  return (
    <div className="fade-in" style={{
      position:'absolute', inset: 0, zIndex: 50,
      background:'var(--ink)', display:'flex', flexDirection:'column',
    }}>
      {/* Poster header */}
      <div style={{position:'relative', height: 420, flexShrink:0}}>
        {movie.backdropUrl ? (
          <>
            <img src={movie.backdropUrl} alt="" style={{
              position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover',
            }}/>
            <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.0) 30%, var(--ink) 95%)'}}/>
          </>
        ) : (
          <>
            <Poster movie={movie} size="lg" hideTitle/>
            <div style={{
              position:'absolute', inset: 0,
              background:'linear-gradient(180deg, transparent 50%, var(--ink) 100%)',
              pointerEvents:'none',
            }}/>
          </>
        )}
        <button onClick={onClose} style={{
          appearance:'none', border:0,
          position:'absolute', top: 56, left: 18,
          background:'rgba(var(--bg-rgb),0.6)', backdropFilter:'blur(20px)',
          color:'var(--cream)', width: 38, height: 38, borderRadius: 999,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Icon name="chevdn" size={20}/>
        </button>
      </div>

      <div className="phone-scroll" style={{flex:1, overflowY:'auto', padding:'0 24px 32px', marginTop:-50, position:'relative', zIndex: 2}}>
        <div style={{
          fontFamily:'var(--serif)', fontSize: 40, lineHeight: 0.96,
          color:'var(--cream)', letterSpacing:'-0.02em', textWrap:'pretty',
        }}>{movie.title}</div>

        <div style={{
          display:'flex', alignItems:'center', gap: 8, marginTop: 10,
          fontSize: 12, color:'var(--muted)', letterSpacing:'0.08em', textTransform:'uppercase',
        }}>
          <span>{movie.year}</span>
          <span>·</span>
          <span>{Math.floor(movie.runtime/60)}h {movie.runtime%60}m</span>
          <span>·</span>
          <span>{movie.genres.join(', ')}</span>
        </div>

        <div style={{
          marginTop: 18, fontFamily:'var(--serif)', fontStyle:'italic', fontSize: 18,
          color:'var(--cream)', opacity: 0.85, lineHeight: 1.35,
        }}>
          “{movie.tag}”
        </div>

        {/* Ratings */}
        <div style={{
          display:'flex', gap: 10, marginTop: 22,
        }}>
          <RatingCard label="Rotten Tomatoes" value={`${movie.rt}%`} color="#fa320a"/>
          <RatingCard label="IMDb" value={movie.imdb.toFixed(1)} color="#f5c518" sub="/ 10"/>
        </div>

        {/* Where */}
        <div style={{marginTop: 24}}>
          <div style={{
            fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase',
            color:'var(--muted)', marginBottom: 10,
          }}>Streaming on</div>
          <div style={{display:'flex', gap: 8}}>
            {movie.where.map(s=>(
              <div key={s} style={{
                display:'flex', alignItems:'center', gap: 8,
                padding:'8px 12px 8px 8px', borderRadius: 999,
                background:'rgba(var(--fg-rgb),0.07)',
                border:'0.5px solid rgba(var(--fg-rgb),0.10)',
              }}>
                <ServiceChip name={s} size={22}/>
                <span style={{fontSize: 13, fontWeight: 500, color:'var(--cream)'}}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mutual liked context */}
        {friend && (
          <div style={{
            marginTop: 26, padding:'16px 16px', borderRadius: 18,
            background:'linear-gradient(135deg, rgba(255,109,41,0.16), rgba(253,166,90,0.05))',
            border:'0.5px solid rgba(255,109,41,0.25)',
            display:'flex', alignItems:'center', gap: 12,
          }}>
            <Avatar person={friend} size={42}/>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontWeight: 600, fontSize: 14, color:'var(--cream)'}}>You and {friend.name.split(' ')[0]} both want this</div>
              <div style={{fontSize: 12, color:'var(--muted)', marginTop: 2}}>Matched 2 days ago</div>
            </div>
          </div>
        )}

        <div style={{display:'flex', gap: 10, marginTop: 22}}>
          {friend ? (
            <>
              <PrimaryBtn full onClick={()=>onMarkWatched?.(movie, friend)}>
                <span style={{display:'inline-flex', alignItems:'center', gap: 8}}>
                  <Icon name="check" size={16} stroke={2.4}/>
                  Watched together
                </span>
              </PrimaryBtn>
            </>
          ) : (
            <PrimaryBtn full secondary onClick={onClose}>Close</PrimaryBtn>
          )}
        </div>
      </div>
    </div>
  );
}

function RatingCard({ label, value, color, sub }) {
  return (
    <div style={{
      flex: 1, padding:'12px 14px', borderRadius: 14,
      background:'linear-gradient(160deg, rgba(var(--fg-rgb),0.10), rgba(var(--fg-rgb),0.035))', backdropFilter:'blur(18px) saturate(150%)', WebkitBackdropFilter:'blur(18px) saturate(150%)',
      border:'0.5px solid rgba(var(--fg-rgb),0.08)',
    }}>
      <div style={{fontSize: 10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)'}}>{label}</div>
      <div style={{
        marginTop: 6, display:'flex', alignItems:'baseline', gap: 4,
        fontFamily:'var(--serif)', fontSize: 26, color: color, lineHeight: 1,
      }}>
        {value}
        {sub && <span style={{fontSize: 12, color:'var(--muted)'}}>{sub}</span>}
      </div>
    </div>
  );
}

// ─── Match celebration ──────────────────────────────────────────────
function MatchCelebration({ movie, friend, onWatch, onKeep }) {
  // Popcorn + movie confetti — a single burst out of the centre when the
  // match appears (no ongoing rain).
  const burst = React.useMemo(() => {
    const EM = ['🍿','🍿','🍿','🍿','🎬','🎉','🎟️','⭐','✨','🥤','🎈','🍿'];
    return Array.from({ length: 20 }, (_, i) => {
      const ang = Math.random() * Math.PI * 2;
      const dist = 130 + Math.random() * 220;
      return {
        id: i, emoji: EM[(Math.random() * EM.length) | 0],
        tx: `${(Math.cos(ang) * dist) | 0}px`,
        ty: `${((Math.sin(ang) * dist) - 50) | 0}px`, // bias upward for the burst
        r:  `${(Math.random() * 960 - 480) | 0}deg`,
        delay: `${(Math.random() * 0.5).toFixed(2)}s`,
        dur:   `${(1.6 + Math.random() * 1.4).toFixed(2)}s`,
        size:  (18 + Math.random() * 18) | 0,
        left:  `${44 + Math.random() * 12}%`,
        top:   `${36 + Math.random() * 10}%`,
      };
    });
  }, []);

  return (
    <div style={{
      position:'absolute', inset:0, zIndex: 999,
      background:'rgba(var(--bg-rgb),0.92)',
      backdropFilter:'blur(24px) saturate(140%)',
      WebkitBackdropFilter:'blur(24px) saturate(140%)',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      padding: '0 24px', overflow:'hidden',
    }}>
      {/* curtains */}
      <div style={{
        position:'absolute', left:0, top:0, bottom:0, width:'50%',
        background:'linear-gradient(90deg, rgba(255,109,41,0.18), transparent)',
        animation:'mm-curtain-l .6s cubic-bezier(.4,0,.2,1) both',
      }}/>
      <div style={{
        position:'absolute', right:0, top:0, bottom:0, width:'50%',
        background:'linear-gradient(270deg, rgba(253,166,90,0.12), transparent)',
        animation:'mm-curtain-r .6s cubic-bezier(.4,0,.2,1) both',
      }}/>

      {/* Popcorn + movie-night confetti burst */}
      <div aria-hidden="true" style={{position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:5}}>
        {burst.map(p => (
          <span key={'b'+p.id} style={{
            position:'absolute', left:p.left, top:p.top, fontSize:p.size, lineHeight:1,
            '--tx': p.tx, '--ty': p.ty, '--r': p.r,
            animation:`mm-confetti ${p.dur} cubic-bezier(.15,.6,.3,1) ${p.delay} both`,
            willChange:'transform, opacity',
          }}>{p.emoji}</span>
        ))}
      </div>

      {/* Top tag */}
      <div className="rise" style={{
        animationDelay:'.1s',
        fontSize: 11, letterSpacing:'0.3em', textTransform:'uppercase',
        color:'var(--gold)', marginBottom: 14, position:'relative', zIndex:1,
      }}>
        ✦ &nbsp;A mutual match&nbsp; ✦
      </div>

      <div className="rise" style={{
        animationDelay:'.18s',
        fontFamily:'var(--serif)', fontSize: 44, lineHeight: 1.0,
        textAlign:'center', color:'var(--cream)', letterSpacing:'-0.02em',
        position:'relative', zIndex:1, marginBottom: 24, whiteSpace:'nowrap',
      }}>
        It's a <em style={{fontStyle:'italic'}}>match.</em>
      </div>

      {/* Stacked poster + avatars */}
      <div className="pop" style={{
        position:'relative', width: 200, height: 300, marginBottom: 28,
        animationDelay:'.28s',
      }}>
        <Poster movie={movie} size="lg"/>
        {/* friend avatar bottom-right */}
        <div style={{
          position:'absolute', bottom: -14, right: -14,
        }}>
          <Avatar person={friend} size={64} ring/>
        </div>
        {/* you bottom-left */}
        <div style={{
          position:'absolute', bottom: -14, left: -14,
        }}>
          <Avatar person={{initials:'YOU', tone:'var(--cream)'}} size={64} ring ringColor="var(--gold)"/>
        </div>
      </div>

      <div className="rise" style={{
        animationDelay:'.36s',
        textAlign:'center', maxWidth: 280,
        fontFamily:'var(--serif)', fontSize: 22, fontStyle:'italic',
        color:'var(--cream)', opacity: 0.9, marginBottom: 6, lineHeight: 1.2,
        position:'relative', zIndex:1,
      }}>
        “{movie.title}”
      </div>
      <div className="rise" style={{
        animationDelay:'.4s',
        fontSize: 13, color:'var(--muted)', marginBottom: 32, textAlign:'center',
        position:'relative', zIndex:1,
      }}>
        You and {friend.name.split(' ')[0]} both want to watch this.
      </div>

      <div className="rise" style={{
        animationDelay:'.48s', display:'flex', flexDirection:'column', gap: 10,
        width:'100%', maxWidth: 320, position:'relative', zIndex:1,
      }}>
        <PrimaryBtn full onClick={onWatch}>
          <span style={{display:'inline-flex', alignItems:'center', gap: 8}}>
            <Icon name="play" size={14}/>
            Watched it together
          </span>
        </PrimaryBtn>
        <PrimaryBtn full secondary onClick={onKeep}>Keep swiping</PrimaryBtn>
      </div>
    </div>
  );
}

Object.assign(window, {
  WelcomeScreen, AuthScreen,
  OnboardingScreen, MatchesScreen,
  FriendsScreen, AddFriendScreen, FriendProfileScreen, ProfileScreen,
  MovieDetailSheet, MatchCelebration, Wordmark, Logomark, TmdbConnectSheet,
  Stat, Section, PosterRow, EmptySectionRow, RatingCard,
});
