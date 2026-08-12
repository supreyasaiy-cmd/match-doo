// app.jsx — root state machine for Match Doo

// Re-seed pre-defined per-friend mutual likes against an arbitrary movie list
// so that swiping into TMDB results still triggers the "It's a match" celebration.
function seedFriendLikesAgainst(movies) {
  if (!movies || movies.length < 5) return;
  const PATTERN = {
    f1: [0, 4, 7, 11, 13], f2: [8, 10], f3: [1, 3, 6], f4: [8],
    f5: [1, 3, 5, 10], f6: [0, 9, 13, 7, 4], f7: [5, 10], f8: [2, 9], f9: [13],
  };
  const watchedPattern = {
    f1: [2, 6], f2: [12], f5: [8], f6: [11], f8: [7],
  };
  Object.entries(PATTERN).forEach(([fid, idxs]) => {
    if (!window.MATCHES[fid]) window.MATCHES[fid] = { movieIds: [], watched: [] };
    window.MATCHES[fid].movieIds = idxs.map(i => movies[i]?.id).filter(Boolean);
  });
  Object.entries(watchedPattern).forEach(([fid, idxs]) => {
    if (!window.MATCHES[fid]) window.MATCHES[fid] = { movieIds: [], watched: [] };
    window.MATCHES[fid].watched = idxs.map(i => movies[i]?.id).filter(Boolean);
  });
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#FD8973",
  "celebration": "curtain",
  "density": "regular",
  "bannerPlacement": "swipeTop"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Hash-based screen override for demo (e.g. #main)
  const hashScreen = (typeof window !== 'undefined' && ['main','onboarding','welcome','auth'].includes(window.location.hash.slice(1)))
    ? window.location.hash.slice(1) : 'welcome';
  const [screen, setScreen] = React.useState(hashScreen);
  React.useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.slice(1);
      if (['main','onboarding','welcome','auth'].includes(h)) setScreen(h);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const [authMode, setAuthMode] = React.useState('signin');
  // Identity model: userId is the permanent unique system key; username
  // (the @handle) is also unique but user-editable. userId never changes.
  const genUserId = () => 'MD-' + Array.from({ length: 8 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
  const [user, setUser] = React.useState(() => ({ name: 'Alex Carter', username: 'alex', userId: genUserId() }));
  const [prefs, setPrefs] = React.useState({ contentType: 'both', services: ['Netflix','Prime'], genres: ['Drama','Comedy','Thriller'] });

  // Main tabs
  const [tab, setTab] = React.useState('swipe');

  // Likes / passes / seen — start empty so all profile stats reflect real swipes
  const [likes, setLikes] = React.useState(new Set());
  const [passes, setPasses] = React.useState(new Set());
  const [seen, setSeen] = React.useState(new Set());
  const [history, setHistory] = React.useState([]);  // [{ id, dir }] for Undo

  const [watchedWith, setWatchedWith] = React.useState(()=> {
    const m = {};
    Object.entries(window.MATCHES).forEach(([fid, v]) => { m[fid] = new Set(v.watched); });
    return m;
  });

  // Modals
  const [movieDetail, setMovieDetail] = React.useState(null);  // { movie, friend? | room? }
  const [readMore, setReadMore]       = React.useState(null);  // { movie }
  const [search, setSearch]           = React.useState(null);  // { initialQuery }
  const [matchPopup, setMatchPopup]   = React.useState(null);
  const [roomDetail, setRoomDetail]   = React.useState(null);
  // When a bottom-sheet inside Room Detail is open, lift the whole overlay
  // above the nav bar so the sheet's action button isn't hidden behind it.
  const [roomDetailModal, setRoomDetailModal] = React.useState(false);
  // Room-scoped swipe session — { room, onDone } — rendered as a full modal.
  const [roomSwipe, setRoomSwipe]     = React.useState(null);
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [matchesOpen, setMatchesOpen] = React.useState(false);
  const [createRoom, setCreateRoom]   = React.useState(false);
  const [addFriend, setAddFriend]     = React.useState(false);
  const [friendsOpen, setFriendsOpen] = React.useState(false);
  const [friendProfile, setFriendProfile] = React.useState(null);
  const [toast, setToast]             = React.useState(null);
  const [tmdbSheetOpen, setTmdbSheetOpen] = React.useState(false);
  const [legal, setLegal] = React.useState(null);  // 'terms' | 'privacy' — full-screen legal overlay

  // Language — 'en' | 'th', persisted. Changing it re-renders the whole tree
  // so every tr() call re-reads the active language.
  const [lang, setLangState] = React.useState(() => (window.I18N ? window.I18N.lang : 'en'));
  const setLang = (l) => { if (window.I18N) window.I18N.setLang(l); setLangState(l); };
  React.useEffect(() => {
    if (window.I18N) window.I18N.lang = lang;
    document.documentElement.setAttribute('data-lang', lang); // CSS switches head titles to Kanit in Thai
  }, [lang]);

  // Appearance — Dark / Light theme, persisted
  const [theme, setTheme] = React.useState(() => {
    try { return localStorage.getItem('matchdoo.theme') || 'dark'; } catch { return 'dark'; }
  });
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('matchdoo.theme', theme); } catch {}
  }, [theme]);

  // First-run swipe coach (shown once)
  const [coachSeen, setCoachSeen] = React.useState(() => {
    try { return !!localStorage.getItem('matchdoo.coachSeen'); } catch { return false; }
  });
  const dismissCoach = () => {
    setCoachSeen(true);
    try { localStorage.setItem('matchdoo.coachSeen', '1'); } catch {}
  };

  // Notifications
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifSeen, setNotifSeen] = React.useState(false);
  const notifications = React.useMemo(() => {
    const fr = ALL_FRIENDS_LIST();
    const list = [];
    const nm = (f) => f.name.split(' ')[0];
    if (fr[0]) list.push({ id:'n1', type:'match',    person: fr[0], text: tr('notif.match1',`You and ${nm(fr[0])} both want the same film 🍿`).replace('{name}', nm(fr[0])), time:'2m' });
    if (fr[2]) list.push({ id:'n2', type:'friend',   person: fr[2], text: tr('notif.friend',`${nm(fr[2])} added you — say hi! 👋`).replace('{name}', nm(fr[2])), time:'1h' });
    list.push({ id:'n3', type:'reminder', text: tr('notif.reminder','Movie night with Family Night is tonight 🎬'), time:'3h' });
    if (fr[1]) list.push({ id:'n4', type:'match',    person: fr[1], text: tr('notif.match2',`${nm(fr[1])} liked a film you love too 💫`).replace('{name}', nm(fr[1])), time:'Yesterday' });
    list.push({ id:'n5', type:'new', text: tr('notif.new','Fresh titles just landed on your picks ✨'), time:'2d' });
    return list;
  }, [lang]);
  const openNotif = () => { setNotifOpen(true); setNotifSeen(true); };
  // Tapping a notification jumps to the relevant place.
  const openNotifTarget = (n) => {
    setNotifOpen(false);
    if (n.type === 'match') setMatchesOpen(true);
    else if (n.type === 'friend') { if (n.person) setFriendProfile(n.person); else setFriendsOpen(true); }
    else if (n.type === 'reminder') setTab('rooms');
    else setTab('swipe');
  };

  // TMDB — served from our /api/tmdb backend (key held server-side), so every
  // visitor gets real posters/metadata with no personal key. Falls back to the
  // bundled sample titles if the backend isn't configured. A personal key can
  // still be connected (local dev / legacy) and takes over as a fallback.
  const [tmdbMovies, setTmdbMovies] = React.useState(null);
  const [tmdbStatus, setTmdbStatus] = React.useState('idle');
  const [tmdbReloadTick, setTmdbReloadTick] = React.useState(0);
  const tmdbKey = window.TMDB?.getKey() || '';

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setTmdbStatus('loading');
      try {
        const results = await window.TMDB.library();   // tries the server proxy, then a personal key
        if (cancelled) return;
        if (results && results.length) {
          seedFriendLikesAgainst(results);
          setTmdbMovies(results);
          setTmdbStatus('ready');
        } else {
          setTmdbStatus('idle');                        // no backend + no key → bundled sample
        }
      } catch (e) {
        if (!cancelled) setTmdbStatus(window.TMDB?.getKey() ? 'error' : 'idle');
      }
    })();
    return () => { cancelled = true; };
  }, [tmdbReloadTick]);

  // Auto-close the connect sheet a beat after a successful connection
  React.useEffect(() => {
    if (tmdbStatus === 'ready' && tmdbSheetOpen) {
      const tm = setTimeout(() => setTmdbSheetOpen(false), 700);
      return () => clearTimeout(tm);
    }
  }, [tmdbStatus, tmdbSheetOpen]);

  const handleTmdbSave = (key) => {
    window.TMDB?.setKey(key);
    setTmdbReloadTick(t => t + 1);
  };
  const handleTmdbDisconnect = () => {
    window.TMDB?.clearKey();
    setTmdbMovies(null);
    setTmdbStatus('idle');
    setTmdbSheetOpen(false);
  };

  const sourceMovies = tmdbMovies && tmdbMovies.length ? tmdbMovies : window.MOVIES;
  React.useEffect(() => { window.MOVIES = sourceMovies; }, [sourceMovies]);

  const deck = React.useMemo(()=> {
    return sourceMovies.filter(m => !likes.has(m.id) && !passes.has(m.id) && !seen.has(m.id));
  }, [sourceMovies, likes, passes, seen]);

  React.useEffect(() => {
    if (!tmdbMovies) return;
    const top = deck.slice(0, 5).filter(m => m.tmdbId && !m._detailFetched);
    if (!top.length) return;
    let cancelled = false;
    (async () => {
      for (const m of top) {
        if (cancelled) return;
        await window.TMDB.enrich(m);
        if (!cancelled) setTmdbMovies(prev => prev ? [...prev] : prev);
      }
    })();
    return () => { cancelled = true; };
  }, [deck, tmdbKey, tmdbMovies]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(()=> setToast(null), 1800);
  };

  // ── Ads — banner / swipe / popup ─────────────────────────────────
  const onOpenAdCTA = (campaign) => showToast(`Would open ${campaign.advertiser} → ${campaign.ctaUrl}`);
  const activeSwipeAds = window.activeSwipeAdCampaigns ? window.activeSwipeAdCampaigns() : [];
  const swipeAdCadence = window.ADS?.cadence?.every || 0;

  const [popupAd, setPopupAd] = React.useState(null);
  const popupAdShownRef = React.useRef(false);
  React.useEffect(() => {
    if (screen === 'main' && !popupAdShownRef.current) {
      popupAdShownRef.current = true;
      const campaign = window.activePopupAdCampaign ? window.activePopupAdCampaign() : null;
      if (campaign) {
        const tm = setTimeout(() => setPopupAd(campaign), 1400);
        return () => clearTimeout(tm);
      }
    }
  }, [screen]);

  // ── Swipe handler — new semantics ────────────────────────────────
  // right = LIKE, left = PASS, up = READ MORE, down = SEARCH
  const onSwipe = (dir, movie) => {
    if (dir === 'right' || dir === 'left' || dir === 'down') {
      setHistory(h => [...h, { id: movie.id, dir }]);
    }
    if (dir === 'right') {
      setLikes(s => new Set(s).add(movie.id));
      const allFriends = ALL_FRIENDS_LIST();
      const matchedFriend = allFriends.find(f =>
        (window.MATCHES[f.id]?.movieIds || []).includes(movie.id)
        && !(watchedWith[f.id]?.has(movie.id))
      );
      if (matchedFriend) {
        setTimeout(()=> setMatchPopup({ movie, friend: matchedFriend }), 220);
      }
    } else if (dir === 'left') {
      setPasses(s => new Set(s).add(movie.id));
    } else if (dir === 'up') {
      // Read More — open the detail popup. The deck no longer consumes the
      // card on 'up', so the same movie stays on top when the sheet closes.
      setReadMore({ movie });
    } else if (dir === 'down') {
      // Mark as already seen (search is still available from the top bar)
      setSeen(s => new Set(s).add(movie.id));
    }
  };

  // Undo the last swipe — remove it from its set so the card returns to top.
  const undoSwipe = () => {
    const last = history[history.length - 1];
    if (!last) return;
    const remove = (setter) => setter(s => { const n = new Set(s); n.delete(last.id); return n; });
    if (last.dir === 'right') remove(setLikes);
    else if (last.dir === 'left') remove(setPasses);
    else if (last.dir === 'down') remove(setSeen);
    setHistory(h => h.slice(0, -1));
  };

  const markWatched = (movie, friend) => {
    setWatchedWith(prev => {
      const next = { ...prev };
      next[friend.id] = new Set(next[friend.id] || []);
      next[friend.id].add(movie.id);
      return next;
    });
    setMatchPopup(null);
    setMovieDetail(null);
    showToast(`Added to watched-together with ${friend.name.split(' ')[0]}`);
  };

  // ── Phone content ────────────────────────────────────────────────
  let content;
  if (screen === 'welcome') {
    content = <WelcomeScreen
      onSignIn={()=>{ setAuthMode('signin'); setScreen('auth'); }}
      onSignUp={()=>{ setAuthMode('signup'); setScreen('auth'); }}
      onOpenLegal={setLegal}
    />;
  } else if (screen === 'auth') {
    content = <AuthScreen
      mode={authMode}
      onBack={()=> setScreen('welcome')}
      onOpenLegal={setLegal}
      onAuth={(u, submittedMode)=>{
        setUser({...user, ...u});
        // Sign-up flow → onboarding; Sign-in → main (mode reflects any in-screen switch)
        setScreen((submittedMode || authMode) === 'signup' ? 'onboarding' : 'main');
      }}
    />;
  } else if (screen === 'onboarding') {
    content = <OnboardingScreen initialName={user.name} onDone={(p)=>{
      setPrefs({ contentType: p.contentType, services: Array.from(p.services), genres: Array.from(p.genres) });
      setScreen('main');
    }}/>;
  } else {
    let tabContent;
    if (tab === 'swipe') {
      tabContent = <SwipeTab deck={deck} onSwipe={onSwipe} onTap={(m)=> setReadMore({ movie: m })} accent={t.accent} onSearch={()=> setSearch({initialQuery:''})} userName={user.name}
        onUndo={undoSwipe} canUndo={history.length > 0}
        onNotif={openNotif} notifCount={notifSeen ? 0 : notifications.length}
        banner={t.bannerPlacement === 'swipeTop' ? <BannerAd placement="swipeTop" onOpenCTA={onOpenAdCTA}/> : null}
        ads={activeSwipeAds} adCadence={swipeAdCadence} onOpenAdCTA={onOpenAdCTA}
      />;
    } else if (tab === 'matches') {
      tabContent = <MatchesScreen likes={Array.from(likes)} onOpenMatch={(f)=> setFriendProfile(f)} onOpenMovie={(m, f)=> setMovieDetail({ movie: m, friend: f })}/>;
    } else if (tab === 'rooms') {
      tabContent = <RoomsScreen
        onOpenRoom={(r)=> setRoomDetail(r)}
        onCreateRoom={()=> setCreateRoom(true)}
        onAddFriend={()=> setFriendsOpen(true)}
        onOpenCalendar={()=> setCalendarOpen(true)}
        onNotif={openNotif} notifCount={notifSeen ? 0 : notifications.length}
        onOpenAdCTA={onOpenAdCTA}
        banner={t.bannerPlacement === 'roomsTop' ? <BannerAd placement="roomsTop" onOpenCTA={onOpenAdCTA}/> : null}
      />;
    } else if (tab === 'profile') {
      // Real stats, computed against the live catalog — no mock numbers.
      const likedMovies = sourceMovies.filter(m => likes.has(m.id));
      const seenMovies = sourceMovies.filter(m => seen.has(m.id));
      // Matches = the shared watch queue (films you + a friend both want),
      // per-friend, minus anything already watched together. Same model the
      // grouped Matches screen uses, so the stat and the screen agree.
      const matchedIds = new Set();
      ALL_FRIENDS_LIST().forEach(f => {
        const watched = new Set(window.MATCHES[f.id]?.watched || []);
        (window.MATCHES[f.id]?.movieIds || []).forEach(id => { if (!watched.has(id)) matchedIds.add(id); });
      });
      const matchedMovies = sourceMovies.filter(m => matchedIds.has(m.id));
      tabContent = <ProfileScreen
        user={user}
        prefs={prefs}
        likedMovies={likedMovies}
        matchedMovies={matchedMovies}
        seenMovies={seenMovies}
        onOpenMovie={(m)=> setReadMore({ movie: m })}
        onOpenMatches={()=> setMatchesOpen(true)}
        theme={theme} onSetTheme={setTheme}
        onSignOut={()=> {
          // Reset to a clean first-run state so the coach tour (and a fresh
          // sign-up's onboarding) show again next time you come back in.
          setLikes(new Set()); setPasses(new Set()); setSeen(new Set()); setHistory([]);
          setCoachSeen(false);
          try { localStorage.removeItem('matchdoo.coachSeen'); } catch {}
          setNotifSeen(false);
          setTab('swipe');
          setScreen('welcome');
        }}
        onOpenTweaks={()=> showToast('Toggle "Tweaks" in the toolbar above to customize')}
        tmdbConnected={tmdbStatus === 'ready' || !!tmdbKey}
        tmdbStatus={tmdbStatus}
        onOpenTmdb={()=> setTmdbSheetOpen(true)}
        onOpenLegal={setLegal}
        lang={lang} onSetLang={setLang}
      />;
    }
    content = (
      <>
        {tabContent}
        {t.bannerPlacement === 'sticky' && (
          <div style={{position:'absolute', left: 16, right: 16, bottom: 96, zIndex: 39}}>
            <BannerAd placement="sticky" onOpenCTA={onOpenAdCTA}/>
          </div>
        )}
        <TabBar active={tab} onChange={(t)=>{
          // Switching tabs must return to that tab's root — dismiss any
          // full-screen overlay or sheet that's currently on top.
          setTab(t);
          setRoomDetail(null); setRoomDetailModal(false); setRoomSwipe(null); setCreateRoom(false); setAddFriend(false); setFriendProfile(null); setFriendsOpen(false);
          setMovieDetail(null); setReadMore(null); setSearch(null);
          setNotifOpen(false); setCalendarOpen(false); setTmdbSheetOpen(false); setMatchesOpen(false);
        }}/>
      </>
    );
  }

  return (
    <>
    <FitStage w={402} h={874}>
    <IOSDevice dark={theme === 'dark'}>
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(125% 78% at 50% -10%, rgba(253,137,115,0.11), transparent 52%), radial-gradient(85% 55% at 96% 104%, rgba(199,73,52,0.09), transparent 60%), var(--ink)',
        color:'var(--cream)',
        display:'flex', flexDirection:'column',
      }}>
        <div style={{height: 50, flexShrink: 0}}/>
        <div style={{
          flex: 1, position:'relative', minHeight: 0,
          overflow: 'hidden', paddingBottom: 24,
          display:'flex', flexDirection:'column',
        }}>
          <div style={{flex: 1, position:'relative', minHeight: 0, overflow:'hidden'}}>
          {content}
          {screen === 'main' && tab === 'swipe' && !coachSeen && deck.length > 0 && (
            <SwipeCoach onDone={dismissCoach}/>
          )}
          {tmdbSheetOpen && (
            <TmdbConnectSheet
              connected={!!tmdbKey}
              status={tmdbStatus}
              onSave={handleTmdbSave}
              onDisconnect={handleTmdbDisconnect}
              onClose={()=> setTmdbSheetOpen(false)}
            />
          )}
          {legal && (
            <div style={{position:'absolute', inset:0, zIndex: 300,
              background:'radial-gradient(125% 78% at 50% -10%, rgba(253,137,115,0.11), transparent 52%), radial-gradient(85% 55% at 96% 104%, rgba(199,73,52,0.09), transparent 60%), var(--ink)'}}>
              <LegalScreen doc={legal} onBack={()=> setLegal(null)}/>
            </div>
          )}
          {readMore && (
            <ReadMoreSheet
              movie={readMore.movie}
              onClose={()=> setReadMore(null)}
              onLike={()=>{
                setLikes(s => new Set(s).add(readMore.movie.id));
                const allFriends = ALL_FRIENDS_LIST();
                const matchedFriend = allFriends.find(f =>
                  (window.MATCHES[f.id]?.movieIds || []).includes(readMore.movie.id)
                  && !(watchedWith[f.id]?.has(readMore.movie.id))
                );
                const movie = readMore.movie;
                setReadMore(null);
                if (matchedFriend) setTimeout(()=> setMatchPopup({ movie, friend: matchedFriend }), 220);
              }}
              onPass={()=>{
                setPasses(s => new Set(s).add(readMore.movie.id));
                setReadMore(null);
              }}
            />
          )}
          {search && (
            <SearchOverlay
              onClose={()=> setSearch(null)}
              onPick={(m)=>{ setSearch(null); setReadMore({ movie: m }); }}
            />
          )}
          {notifOpen && (
            <NotificationsSheet items={notifications} onClose={()=> setNotifOpen(false)} onOpen={openNotifTarget}/>
          )}
          {calendarOpen && (
            <CalendarSheet
              onClose={()=> setCalendarOpen(false)}
              onOpenRoom={(r)=>{ setCalendarOpen(false); setRoomDetail(r); }}
            />
          )}
          {movieDetail && (
            <MovieDetailSheet
              movie={movieDetail.movie}
              friend={movieDetail.friend}
              onClose={()=> setMovieDetail(null)}
              onMarkWatched={markWatched}
            />
          )}
          {roomDetail && (
            <div style={{position:'absolute', inset:0, background:'radial-gradient(125% 78% at 50% -10%, rgba(253,137,115,0.11), transparent 52%), radial-gradient(85% 55% at 96% 104%, rgba(199,73,52,0.09), transparent 60%), var(--ink)', zIndex: roomDetailModal ? 250 : 45}}>
              <RoomDetailScreen
                room={roomDetail}
                onBack={()=> { setRoomDetailModal(false); setRoomDetail(null); }}
                onModal={setRoomDetailModal}
                onSwipeRoom={(room, onDone)=> setRoomSwipe({ room, onDone })}
                onOpenMovie={(m, r)=> setMovieDetail({ movie: m })}
              />
            </div>
          )}
          {roomSwipe && (
            <div style={{position:'absolute', inset:0, background:'radial-gradient(125% 78% at 50% -10%, rgba(253,137,115,0.11), transparent 52%), radial-gradient(85% 55% at 96% 104%, rgba(199,73,52,0.09), transparent 60%), var(--ink)', zIndex: 240}}>
              <RoomSwipeScreen
                room={roomSwipe.room}
                onReadMore={(m)=> setReadMore({ movie: m })}
                onBack={()=> { roomSwipe.onDone?.(); setRoomSwipe(null); }}
              />
            </div>
          )}
          {matchesOpen && (
            <div style={{position:'absolute', inset:0, background:'radial-gradient(125% 78% at 50% -10%, rgba(253,137,115,0.11), transparent 52%), radial-gradient(85% 55% at 96% 104%, rgba(199,73,52,0.09), transparent 60%), var(--ink)', zIndex: 45}}>
              <MatchesScreen
                likes={Array.from(likes)}
                onBack={()=> setMatchesOpen(false)}
                onOpenMatch={(f)=> setFriendProfile(f)}
                onOpenMovie={(m, f)=> setMovieDetail({ movie: m, friend: f })}
              />
            </div>
          )}
          {createRoom && (
            <div style={{position:'absolute', inset:0, background:'radial-gradient(125% 78% at 50% -10%, rgba(253,137,115,0.11), transparent 52%), radial-gradient(85% 55% at 96% 104%, rgba(199,73,52,0.09), transparent 60%), var(--ink)', zIndex: 250}}>
              <CreateRoomScreen
                onBack={()=> setCreateRoom(false)}
                onCreate={(r)=>{ setCreateRoom(false); setRoomDetail(r); showToast(tr('toast.roomCreated','Room’s ready — let’s find your film. 🍿')); }}
              />
            </div>
          )}
          {addFriend && (
            <div style={{position:'absolute', inset:0, background:'radial-gradient(125% 78% at 50% -10%, rgba(253,137,115,0.11), transparent 52%), radial-gradient(85% 55% at 96% 104%, rgba(199,73,52,0.09), transparent 60%), var(--ink)', zIndex: 250}}>
              <AddFriendScreen onBack={()=> setAddFriend(false)}/>
            </div>
          )}
          {friendsOpen && (
            <div style={{position:'absolute', inset:0, background:'radial-gradient(125% 78% at 50% -10%, rgba(253,137,115,0.11), transparent 52%), radial-gradient(85% 55% at 96% 104%, rgba(199,73,52,0.09), transparent 60%), var(--ink)', zIndex: 45}}>
              <FriendsScreen
                onBack={()=> setFriendsOpen(false)}
                onOpenFriend={(f)=> setFriendProfile(f)}
                onOpenAdd={()=> setAddFriend(true)}
              />
            </div>
          )}
          {friendProfile && (
            <div style={{position:'absolute', inset:0, background:'radial-gradient(125% 78% at 50% -10%, rgba(253,137,115,0.11), transparent 52%), radial-gradient(85% 55% at 96% 104%, rgba(199,73,52,0.09), transparent 60%), var(--ink)', zIndex: 45}}>
              <FriendProfileScreen
                friend={friendProfile}
                onBack={()=> setFriendProfile(null)}
                onOpenMovie={(m, f)=> setMovieDetail({ movie: m, friend: f })}
              />
            </div>
          )}
          {matchPopup && (
            t.celebration === 'curtain' ? (
              <MatchCelebration
                movie={matchPopup.movie}
                friend={matchPopup.friend}
                onWatch={()=> markWatched(matchPopup.movie, matchPopup.friend)}
                onKeep={()=> setMatchPopup(null)}
              />
            ) : (
              <MatchToast
                movie={matchPopup.movie}
                friend={matchPopup.friend}
                onDismiss={()=> setMatchPopup(null)}
              />
            )
          )}
          {popupAd && (
            <PopupAdInterstitial
              campaign={popupAd}
              onClose={()=> setPopupAd(null)}
              onOpenCTA={(c)=>{ onOpenAdCTA(c); setPopupAd(null); }}
            />
          )}
          {toast && <Toast text={toast}/>}
          </div>
        </div>
      </div>
    </IOSDevice>
    </FitStage>

    <MatchDooTweaks t={t} setTweak={setTweak}/>
    </>
  );
}

function ALL_FRIENDS_LIST() {
  return [
    ...(window.FRIENDS.couple || []),
    ...(window.FRIENDS.family || []),
    ...(window.FRIENDS.friends || []),
  ];
}

function FitStage({ w, h, children }) {
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const fit = () => {
      const pad = 24;
      const sx = (window.innerWidth - pad) / w;
      const sy = (window.innerHeight - pad) / h;
      setScale(Math.min(1, sx, sy));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [w, h]);
  return (
    <div style={{
      width: w * scale, height: h * scale, position: 'relative',
    }}>
      <div style={{
        width: w, height: h,
        transform: `scale(${scale})`, transformOrigin: '0 0',
        position: 'absolute', top: 0, left: 0,
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── Swipe tab wrapper ─────────────────────────────────────────────
function SwipeTab({ deck, onSwipe, onTap, accent, onSearch, userName, banner, ads, adCadence, onOpenAdCTA, onUndo, canUndo, onNotif, notifCount }) {
  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <div style={{
        padding:'10px 18px 4px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <Wordmark small/>
        <div style={{display:'flex', alignItems:'center', gap: 8}}>
          {canUndo && (
            <button onClick={onUndo} aria-label="Undo last swipe" title="Undo" style={{
              appearance:'none', border:'0.5px solid rgba(253,166,90,0.4)',
              background:'rgba(253,166,90,0.12)', color:'var(--gold)',
              height: 36, borderRadius: 999, padding:'0 12px',
              display:'inline-flex', alignItems:'center', gap: 6,
              fontFamily:'var(--sans)', fontSize: 12.5, fontWeight: 600,
            }}>
              <Icon name="undo" size={15} color="var(--gold)"/>
              Undo
            </button>
          )}
          <button onClick={onSearch} style={{
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.07)',
            width: 36, height: 36, borderRadius: 999, color:'var(--cream)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name="search" size={16}/>
          </button>
          <button onClick={onNotif} aria-label="Notifications" style={{
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.07)',
            width: 36, height: 36, borderRadius: 999, color:'var(--cream)',
            display:'flex', alignItems:'center', justifyContent:'center',
            position:'relative',
          }}>
            <Icon name="bell" size={16}/>
            {notifCount > 0 && (
              <span style={{
                position:'absolute', top: 6, right: 6,
                width: 8, height: 8, borderRadius: 999,
                background:'var(--red)', border:'1.5px solid var(--ink)',
              }}/>
            )}
          </button>
        </div>
      </div>

      {banner && <div style={{padding:'8px 18px 2px'}}>{banner}</div>}

      <SwipeDeck movies={deck} onSwipe={onSwipe} onTap={onTap} ads={ads} adCadence={adCadence} onOpenAdCTA={onOpenAdCTA}/>
    </div>
  );
}

// ─── Toasts ────────────────────────────────────────────────────────
// ─── Notifications sheet ───────────────────────────────────────────
function NotificationsSheet({ items = [], onClose, onOpen }) {
  const META = {
    match:    { icon:'heart',   tone:'#F0B24A' },
    friend:   { icon:'user',    tone:'#FFBF65' },
    reminder: { icon:'clock',   tone:'#FFBF65' },
    new:      { icon:'sparkle', tone:'#FD8973' },
  };
  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0, zIndex: 250,
      background:'rgba(var(--bg-rgb),0.7)',
      backdropFilter:'blur(16px) saturate(140%)', WebkitBackdropFilter:'blur(16px) saturate(140%)',
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
    }}>
      <div onClick={e=>e.stopPropagation()} className="rise" style={{
        background:'var(--ink)', borderRadius:'28px 28px 0 0',
        padding:'14px 0 22px', boxShadow:'0 -20px 40px rgba(0,0,0,0.5)',
        border:'0.5px solid rgba(var(--fg-rgb),0.10)', borderBottom: 0,
        maxHeight:'80%', display:'flex', flexDirection:'column',
      }}>
        <div style={{width: 42, height: 4, borderRadius: 2, background:'rgba(var(--fg-rgb),0.25)', margin:'0 auto 12px'}}/>
        <div style={{padding:'0 20px 8px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{fontFamily:'var(--serif)', fontSize: 24, color:'var(--cream)', lineHeight: 1.1}}>Notifications</div>
          <button onClick={onClose} style={{
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.09)',
            width: 34, height: 34, borderRadius: 999, color:'var(--muted)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name="x" size={16}/>
          </button>
        </div>

        <div className="phone-scroll" style={{flex:1, overflowY:'auto', padding:'6px 12px 4px'}}>
          {items.length === 0 ? (
            <div style={{padding:'40px 20px', textAlign:'center', color:'var(--muted)', fontSize: 13}}>
              You're all caught up.
            </div>
          ) : items.map(n => {
            const m = META[n.type] || META.new;
            return (
              <button key={n.id} onClick={()=> onOpen?.(n)} className="tap-row" style={{
                appearance:'none', border:0, background:'transparent', width:'100%', textAlign:'left', cursor:'pointer',
                display:'flex', alignItems:'center', gap: 12,
                padding:'12px 10px', borderRadius: 14, color:'var(--cream)',
              }}>
                {n.person ? <Avatar person={n.person} size={40}/> : <IconBadge icon={m.icon} size={40} tone={m.tone}/>}
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize: 13.5, color:'var(--cream)', lineHeight: 1.35}}>{n.text}</div>
                  <div style={{fontSize: 11, color:'var(--muted)', marginTop: 3}}>{n.time}</div>
                </div>
                <Icon name="chev" size={14} color="var(--muted-2)"/>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Toast({ text }) {
  return (
    <div className="rise" style={{
      position:'absolute', left:'50%', bottom: 110, transform:'translateX(-50%)',
      padding:'10px 16px', borderRadius: 999,
      background:'rgba(var(--bg-rgb),0.85)',
      backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
      border:'0.5px solid rgba(var(--fg-rgb),0.12)',
      color:'var(--cream)', fontSize: 12.5, fontWeight: 500,
      letterSpacing:'-0.01em', zIndex: 999,
      boxShadow:'0 12px 30px rgba(0,0,0,0.4)',
    }}>{text}</div>
  );
}

function MatchToast({ movie, friend, onDismiss }) {
  React.useEffect(()=>{
    const tm = setTimeout(onDismiss, 3500);
    return () => clearTimeout(tm);
  }, []);
  return (
    <button onClick={onDismiss} className="rise" style={{
      appearance:'none', border:0, textAlign:'left',
      position:'absolute', left: 16, right: 16, top: 70, zIndex: 999,
      padding:'12px 14px', borderRadius: 18,
      background:'rgba(var(--bg-rgb),0.85)',
      backdropFilter:'blur(20px)',
      border:'0.5px solid rgba(253,137,115,0.35)',
      display:'flex', alignItems:'center', gap: 12,
      boxShadow:'0 12px 30px rgba(0,0,0,0.4)', color:'var(--cream)',
    }}>
      <div style={{width: 44, height: 66, borderRadius: 8, overflow:'hidden', flexShrink:0}}>
        <Poster movie={movie} size="xs"/>
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--red)', fontWeight: 700}}>
          ✦ It's a match
        </div>
        <div style={{fontFamily:'var(--serif)', fontSize: 18, lineHeight: 1.1, marginTop: 2}}>{movie.title}</div>
        <div style={{fontSize: 12, color:'var(--muted)', marginTop: 2}}>with {friend.name.split(' ')[0]}</div>
      </div>
      <Avatar person={friend} size={36}/>
    </button>
  );
}

// ─── Tweaks panel ──────────────────────────────────────────────────
function MatchDooTweaks({ t, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Theme"/>
      <TweakColor label="Accent" value={t.accent}
        options={['#FD8973','#FFBF65','#6F93E0','#93A8E8']}
        onChange={(v)=>{ setTweak('accent', v); document.documentElement.style.setProperty('--red', v); }}
      />
      <TweakSection label="Match moment"/>
      <TweakRadio label="Style" value={t.celebration}
        options={['curtain','toast']}
        onChange={(v)=> setTweak('celebration', v)}/>
      <TweakSection label="Layout"/>
      <TweakRadio label="Density" value={t.density}
        options={['compact','regular','comfy']}
        onChange={(v)=> setTweak('density', v)}/>
      <TweakSection label="Ads"/>
      <TweakRadio label="Banner placement" value={t.bannerPlacement}
        options={[{value:'swipeTop',label:'Swipe'},{value:'roomsTop',label:'Rooms'},{value:'sticky',label:'Sticky'}]}
        onChange={(v)=> setTweak('bannerPlacement', v)}/>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
