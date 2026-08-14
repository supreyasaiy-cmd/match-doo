// i18n.js — MatchDoo lightweight localization (English / Thai).
//
// Usage in components:  tr('key', 'English fallback')
// Any key without a Thai entry falls back to the English fallback string,
// so English mode is always complete and Thai fills in progressively.
//
// Re-render model: the App holds a `lang` state; changing it re-renders the
// whole tree, and tr() reads the current window.I18N.lang, so every visible
// string updates. window.I18N.setLang persists the choice.

window.I18N = {
  lang: (function () { try { return localStorage.getItem('matchdoo.lang') || 'en'; } catch { return 'en'; } })(),
  setLang(l) { this.lang = l; try { localStorage.setItem('matchdoo.lang', l); } catch {} },
  t(key, fallback) {
    const d = (this.dict[this.lang] || {});
    if (key in d) return d[key];
    if (fallback !== undefined) return fallback;
    const en = this.dict.en || {};
    return (key in en) ? en[key] : key;
  },
  dict: {
    en: {
      // These English entries are optional (fallbacks are passed inline);
      // kept for a few where the source string is long/structured.
    },
    th: {
      // ── Bottom nav ──
      'nav.rooms':   'ห้อง',
      'nav.profile': 'โปรไฟล์',

      // ── Swipe actions ──
      'swipe.pass':      'ผ่าน',
      'swipe.more':      'อ่านต่อ',
      'swipe.seen':      'เคยดูแล้ว',
      'swipe.watchlist': 'อยากดู',
      'swipe.readmore':  'อ่านต่อ',

      // ── Profile ──
      'profile.you':            'คุณ',
      'profile.watchlist':      'อยากดู',
      'profile.matches':        'แมตช์',
      'profile.seen':           'เคยดู',
      'profile.group.taste':    'รสนิยม',
      'profile.genres':         'แนวหนัง',
      'profile.streaming':      'บริการสตรีมมิง',
      'profile.runtime':        'ความยาวที่ชอบ',
      'profile.group.account':  'บัญชี',
      'profile.group.films':    'ภาพยนตร์',
      'profile.group.app':      'แอป',
      'profile.group.legal':    'ข้อกฎหมาย',

      // ── Rooms ──
      'rooms.title':    'ห้อง',
      'rooms.subtitle': 'รวมกลุ่มเพื่อน ปัดหนังไปด้วยกัน',
      'rooms.create':   'สร้างห้อง',
      'rooms.friends':  'เพื่อน',
      'rooms.search':   'ค้นหาห้อง',
      'rooms.round':          'รอบนี้',
      'rooms.voteGenres':     'โหวตแนวหนัง',
      'rooms.swipeTogether':  'มาปัดหาหนังกัน',
      'rooms.topPicks':       'หนังที่ทุกคนอยากดู',
      'rooms.everyoneIn':     'ทุกคนอยากดู',

      // ── Matches ──
      'matches.title':        'แมตช์',
      'matches.subtitleN':    'เรื่องในคิวที่อยากดูร่วมกัน',
      'matches.subtitle0':    'หนังที่คุณทั้งคู่อยากดู',

      // ── Search ──
      'search.placeholder':   'ค้นหาหนังหรือซีรีส์',

      // ── Auth ──
      'auth.signupDesc': 'สร้างบัญชีเพื่อเริ่มจับคู่หนังกับคนที่คุณดูด้วยจริงๆ',
      'auth.signinDesc': 'เข้าสู่ระบบเพื่อไปต่อจากที่ค้างไว้',
      'auth.orEmail':    'หรือด้วยอีเมล',
      'auth.fullName':   'ชื่อ-นามสกุล',
      'auth.email':      'อีเมล',
      'auth.password':   'รหัสผ่าน',
      'auth.birthday':   'วันเกิด',
      'auth.gender':     'เพศ',
      'auth.continueWith': 'ดำเนินการต่อด้วย',
      'auth.haveAccount': 'มีบัญชีอยู่แล้ว?',
      'auth.newHere':    'เพิ่งเคยใช้?',
      'auth.under15':    'คุณต้องมีอายุอย่างน้อย 15 ปีจึงจะใช้ MatchDoo ได้',
      'auth.signingIn':  'กำลังเข้าสู่ระบบ…',
      'gender.male':     'ชาย',
      'gender.female':   'หญิง',
      'gender.na':       'ไม่ระบุ',
      'gender.naShort':  'ไม่ระบุ',

      // ── Friends ──
      'friends.title':    'เพื่อน',
      'friends.subtitle': 'แตะที่เพื่อนเพื่อดูแมตช์ของคุณ',
      'friends.search':   'ค้นหาเพื่อน',
      'friends.wantsToAdd': 'ต้องการเพิ่มคุณ',
      'friends.accept':   'ยอมรับ',
      'friends.mutual':   'เพื่อนร่วมกัน', 'friends.mutualFilms': 'หนังที่ตรงกัน',
      'friends.addTitle': 'เพิ่มเพื่อน',
      'addfriend.username': 'ชื่อผู้ใช้',
      'addfriend.contacts': 'รายชื่อติดต่อ',
      'addfriend.qr':     'QR / ลิงก์',

      // ── Swipe coach ──
      'coach.k1': 'วิธีใช้งาน',        'coach.t1': 'ปัดเพื่อเลือก',
      'coach.x1': 'ปัดการ์ดไปทางที่ต้องการ — ขวาเพื่อบันทึกลงรายการอยากดู ซ้ายเพื่อผ่าน ขึ้นเพื่อดูรายละเอียด และลงถ้าเคยดูแล้ว',
      'coach.k2': 'หรือแค่แตะ',        'coach.t2': 'เหมือนกัน แค่แตะครั้งเดียว',
      'coach.x2': 'ไม่ถนัดปัด? ปุ่มเหล่านี้ทำแบบเดียวกัน — ผ่าน อ่านต่อ เคยดู และอยากดู',
      'coach.k3': 'ส่วนที่สนุก',       'coach.t3': 'ดูด้วยกัน',
      'coach.x3': 'สร้างห้องเพื่อจับคู่กับเพื่อนหรือครอบครัว แล้วดูทุกเรื่องที่คุณถูกใจได้ในโปรไฟล์',
      'coach.next': 'ถัดไป', 'coach.skip': 'ข้าม', 'coach.gotit': 'เข้าใจแล้ว!',

      // ── Fun UX microcopy (empty states, prompts, toasts) ──
      'empty.deckTitle':    'หมดม้วนแล้ว! 🎬',
      'empty.deckSub':      'คุณปัดครบทุกเรื่องแล้ว เดี๋ยวมีหนังใหม่มาให้ปัดเร็ว ๆ นี้ พักจิบน้ำก่อนนะ 🍿',
      'empty.listTitle':    'ลิสต์นี้ยังเหงา ๆ อยู่เลย 🍿',
      'empty.listSub':      'ปัดขวาเก็บหนังที่ถูกใจมาไว้ตรงนี้ได้เลย',
      'empty.matchesTitle': 'ยังไม่มีแมตช์ — เดี๋ยวก็มา! 💫',
      'empty.matchesSub':   'ปัดต่อไปเรื่อย ๆ พอคุณสองคนถูกใจเรื่องเดียวกัน เดี๋ยวมันโผล่มาตรงนี้เอง',
      'empty.sharedQueue':  'ยังไม่มีหนังที่ตรงกัน — ปัดต่อไปอีกนิด! 🍿',
      'rooms.noPicks':      'ยังไม่มีหนังที่ตรงกัน — เริ่มปัดหาหนังกันเลย เรื่องที่หลายคนอยากดูจะมาโผล่ตรงนี้ 🍿',
      'rooms.swipePrompt':  'ยิ่งหลายคนปัด “อยากดู” เรื่องไหน เรื่องนั้นยิ่งขึ้นอันดับบน',
      'toast.profileSaved': 'ดูดีขึ้นเยอะ! ✨',
      'toast.roomCreated':  'สร้างห้องแล้ว — ไปหาหนังกันเลย! 🍿',
      'toast.friendAdded':  'เพิ่ม {name} เข้ากลุ่มแล้ว! 🎉',
      // Notifications (fun tone)
      'notif.match1':  'คุณกับ {name} อยากดูเรื่องเดียวกัน 🍿',
      'notif.friend':  '{name} เพิ่มคุณเป็นเพื่อนแล้ว — ทักไปสิ! 👋',
      'notif.reminder':'คืนดูหนังกับ Family Night คืนนี้! 🎬',
      'notif.match2':  '{name} ถูกใจหนังที่คุณชอบเหมือนกัน 💫',
      'notif.new':     'มีหนังใหม่มาให้เลือกแล้ว ✨',

      // ── Onboarding ──
      'onb.hi':        'สวัสดี',
      'onb.t1':        'มาหาอะไรดูดี?',
      'onb.sub1':      'เลือกแบบที่ใช่ — เปลี่ยนทีหลังได้เสมอ',
      'onb.movies':    'หนัง',       'onb.moviesDesc': 'เฉพาะหนังยาว',
      'onb.series':    'ซีรีส์',      'onb.seriesDesc': 'เฉพาะซีรีส์เป็นตอน ๆ',
      'onb.both':      'ทั้งคู่',      'onb.bothDesc':   'ผสมกันไปเลย เอาให้ครบ',
      'onb.t2':        'ดูจากที่ไหนบ้าง?',
      'onb.sub2':      'เราจะโชว์เฉพาะเรื่องที่คุณดูได้จริงคืนนี้',
      'onb.t3':        'เลือกแนวที่ชอบ',
      'onb.sub3a':     'เลือกอย่างน้อย 3 แนว เราจะได้เรียนรู้รสนิยมคุณ —',
      'onb.sub3b':     'แนวแล้ว',
      'onb.back':      'ย้อนกลับ',
      'onb.continue':  'ต่อไป',
      'onb.start':     'เริ่มจับคู่เลย',

      // ── Match celebration ──
      'celebrate.mutual': 'ถูกใจตรงกัน',
      'celebrate.itsA':   'ถูกใจ',
      'celebrate.match':  'ตรงกัน!',

      // ── Room detail ──
      'room.typePartner': 'คู่รัก', 'room.typeFamily': 'ครอบครัว', 'room.typeFriends': 'เพื่อน',
      'room.member': 'คน', 'room.members': 'คน', 'room.invite': 'ชวนเพื่อนมาปัดหนังกัน',
      'room.movieNight':  'คืนดูหนัง',
      'room.pickDay':     'เลือกวันดูหนังด้วยกัน',
      'room.tonight':     'คืนนี้', 'room.tomorrow': 'พรุ่งนี้', 'room.weekend': 'สุดสัปดาห์นี้', 'room.pickDate': 'เลือกวันที่',
      'room.groupMatches':'แมตช์ของกลุ่ม', 'room.almostThere': 'ใกล้แล้ว', 'room.membersStat': 'สมาชิก',
      'room.almostMatch': 'เกือบแมตช์', 'room.almostCap': 'คุณอยากดูเรื่องพวกนี้ — รอที่เหลือในห้อง',
      'room.everyoneIn':  'ทุกคนเอาด้วย', 'room.wantThis': 'อยากดู', 'room.ofN': 'จาก',
      'room.groupPick': 'กลุ่มถูกใจ', 'room.everyoneOnThis': 'ทุกคนเอาเรื่องนี้!', 'room.wantIt': 'อยากดู',
      'room.streamOn':    'บน',
      'room.daysToVote':  'วันในการโหวต', 'room.dayWindow': 'ช่วงโหวต {n} วัน', 'room.votingClosed': 'ปิดโหวตแล้ว',
      'room.youVoted':    'คุณโหวต:', 'room.pickFromGenres': 'เลือกจาก {n} แนวที่เจ้าของตั้งไว้',
      'room.left':        'เหลือ', 'room.deckDone': 'ดูครบแล้ว',

      // ── Read More sheet ──
      'rm.movieNight': 'คืนดูหนัง',
      'rm.schedule':   'เลือกวันไปดู',
      'rm.watching':   'ดูวันที่',
      'rm.synopsis':   'เรื่องย่อ',
      'rm.cast':       'นักแสดง',
      'rm.whereToWatch': 'ดูได้ที่',

      // ── Create Room ──
      'cr.newRoom':    'ห้องใหม่',
      'cr.roomName':   'ชื่อห้อง',
      'cr.streaming':  'สตรีมมิง',
      'cr.streamHint': 'หนังจะมาจากบริการเหล่านี้',
      'cr.genrePool':  'กลุ่มแนวหนัง',
      'cr.votingWindow':'ช่วงเวลาโหวต',
      'cr.addMembers': 'เพิ่มสมาชิก',
      'cr.selected':   'เลือกแล้ว',
      'cr.create':     'สร้างห้อง',
      'cr.streamHint2':'หนังจะมาจากบริการเหล่านี้',
      'cr.pick35':     'เลือก 3–5',
      'cr.votingHint': 'สมาชิกมีเวลาเท่านี้ในการโหวตแนวและปัดก่อนล็อกผลลัพธ์',
      'cr.day1':'1 วัน', 'cr.day3':'3 วัน', 'cr.week1':'1 สัปดาห์',

      // ── Add members sheet ──
      'am.addTo':      'เพิ่มเข้า', 'am.selected': 'เลือกแล้ว', 'am.searchFriends': 'ค้นหาเพื่อน',
      'am.everyoneIn': 'ทุกคนที่คุณรู้จักอยู่ในห้องนี้แล้ว', 'am.noMatch': 'ไม่พบเพื่อนที่ตรงกับการค้นหา', 'am.add': 'เพิ่ม',

      // ── Edit profile sheet ──
      'ep.editProfile': 'แก้ไขโปรไฟล์', 'ep.profilePic': 'รูปโปรไฟล์',
      'ep.name': 'ชื่อ', 'ep.username': 'ชื่อผู้ใช้', 'ep.userId': 'User ID', 'ep.save': 'บันทึก',
      'ep.usernameHint': '@username ของคุณที่ไม่ซ้ำใคร — คนอื่นค้นหาคุณเจอด้วยชื่อนี้',
      'ep.userIdHint':   'รหัสบัญชีถาวรของคุณ ไม่มีวันเปลี่ยน', 'ep.copy': 'คัดลอก',

      // ── Room settings sheet ──
      'rs.mute': 'ปิดการแจ้งเตือน', 'rs.members': 'สมาชิก', 'rs.justYou': 'มีแค่คุณตอนนี้',
      'rs.saveChanges': 'บันทึกการเปลี่ยนแปลง', 'rs.leave': 'ออกจากห้อง', 'rs.delete': 'ลบห้อง',

      // ── Theme picker ──
      'tp.appearance': 'ธีม',
      'tp.dark': 'มืด', 'tp.darkDesc': 'โทน coral บนฟ้ากลางคืน — ลุคเอกลักษณ์',
      'tp.light': 'สว่าง', 'tp.lightDesc': 'สว่างโปร่งสบายสำหรับกลางวัน',

      // ── Calendar ──
      'cal.movieNights': 'คืนดูหนัง', 'cal.movieNightSub': 'คืนดูหนัง', 'cal.watchingSolo': 'ดูคนเดียว',
      'cal.noScheduled': 'ยังไม่มีคืนดูหนัง — เลือกวันในห้องได้เลย', 'cal.aFilm': 'หนังสักเรื่อง',

      // ── TMDB ──
      'tmdb.notConnected': 'ยังไม่เชื่อมต่อ', 'tmdb.connecting': 'กำลังเชื่อมต่อ…',
      'tmdb.fetchFailed': 'เชื่อมต่อแล้ว · ดึงข้อมูลไม่สำเร็จ', 'tmdb.realPosters': 'เชื่อมต่อแล้ว · โปสเตอร์จริง',
      'tmdb.title': 'การเชื่อมต่อ TMDB',
      'tmdb.stError': 'บันทึก key แล้ว แต่ดึงข้อมูลไม่สำเร็จ', 'tmdb.stLoading': 'กำลังเชื่อมต่อ…',
      'tmdb.stConnected': 'เชื่อมต่อแล้ว · กำลังดึงโปสเตอร์จริง', 'tmdb.stNot': 'ยังไม่เชื่อมต่อ · แสดงโปสเตอร์ภาพวาด',
      'tmdb.desc': 'โปสเตอร์จริงเปิดใช้งานอยู่ — ดึงสดจาก TMDB ผ่านเซิร์ฟเวอร์ของ MatchDoo ไม่ต้องตั้งค่าเอง ถ้าอยากใช้ key ของตัวเอง วางด้านล่างได้ (ไม่บังคับ)',
      'tmdb.paste': 'วาง TMDB API key ของคุณ', 'tmdb.errMsg': 'เชื่อมต่อไม่ได้ — ตรวจสอบ key แล้วลองใหม่',
      'tmdb.getKey': 'ขอ API key ฟรีที่ themoviedb.org', 'tmdb.disconnect': 'ตัดการเชื่อมต่อ',
      'tmdb.update': 'อัปเดต key', 'tmdb.connect': 'เชื่อมต่อ',

      // ── Notification settings ──
      'ns.matches': 'แมตช์ใหม่', 'ns.matchesDesc': 'เมื่อคุณกับเพื่อนถูกใจหนังเรื่องเดียวกัน',
      'ns.friends': 'กิจกรรมของเพื่อน', 'ns.friendsDesc': 'เมื่อมีคนเพิ่มคุณหรือเข้าห้อง',
      'ns.reminders': 'เตือนคืนดูหนัง', 'ns.remindersDesc': 'กระตุ้นให้ปัดหนังด้วยกัน',

      // ── Read More / Friend profile ──
      'rm.trailer': 'ตัวอย่าง',
      'fp.sharedQueue': 'คิวที่อยากดูร่วมกัน', 'fp.sharedQueueCap': 'เรื่องที่คุณทั้งคู่อยากดู',
      'fp.watchedTogether': 'เคยดูด้วยกัน', 'fp.watchedCap': 'เรื่องที่ดูกับ',
      // Friend-detail stat labels — each two lines (\n) so all three align.
      'fd.statMatches': 'หนัง\nที่แมตช์', 'fd.statWatched': 'ดู\nด้วยกัน', 'fd.statMutual': 'เพื่อน\nร่วมกัน',
      'fd.mutualCap': 'เพื่อนที่รู้จักร่วมกัน', 'empty.mutual': 'ยังไม่มีเพื่อนร่วมกัน — ยิ่งเพิ่มเพื่อนด้วยกัน ยิ่งเจอคนที่รู้จักร่วมกัน 🤝',

      // ── Misc ──
      'ms.logWatched': 'ดูหนังที่แมตช์ด้วยกันแล้ว? แตะ “เคยดูแล้ว” เดี๋ยวมาโผล่ตรงนี้ 🍿',
      'search.noneA': 'ไม่พบผลลัพธ์สำหรับ', 'search.noneB': 'ลองชื่อเรื่องหรือแนวอื่นดู',
      'profile.email':          'อีเมล',
      'profile.birthday':       'วันเกิด',
      'profile.gender':         'เพศ',
      'profile.notifications':  'การแจ้งเตือน',
      'profile.tmdb':           'การเชื่อมต่อ TMDB',
      'profile.themes':         'ธีม',
      'profile.language':       'ภาษา',
      'profile.joined':         'เข้าร่วม พ.ค. 2026',
      'profile.selectedN':      'รายการ',
      'profile.notifOn':        'เปิด',
      'theme.dark':             'มืด', 'theme.light': 'สว่าง',
      'matches.all':            'ทั้งหมด', 'matches.matchesN': 'แมตช์',
      // Gender + runtime display labels (values stay English internally)
      'g.Male': 'ชาย', 'g.Female': 'หญิง', 'g.Prefer not to say': 'ไม่ระบุ',
      'rt.Under 90 min': 'ต่ำกว่า 90 นาที', 'rt.90–150 min': '90–150 นาที',
      'rt.Over 150 min': 'มากกว่า 150 นาที', 'rt.No preference': 'ไม่มีข้อกำหนด',
      'profile.signout':        'ออกจากระบบ',
      'profile.terms':          'ข้อกำหนดและเงื่อนไข',
      'profile.privacy':        'นโยบายความเป็นส่วนตัว',
      'profile.tagline':        'Match Doo · สร้างมาเพื่อค่ำคืนดูหนัง',

      // ── Welcome ──
      // Welcome headline — two lines: a question, then the answer in gradient
      // ("ดูอะไรดี?" / "ปัดเลย"). h3/h4 are legacy, no longer rendered.
      'welcome.h1': 'ดูอะไรดี?', 'welcome.h2': 'ปัดเลย', 'welcome.h3': '', 'welcome.h4': '',
      'welcome.badge':       'จบปัญหาเลือกหนังไม่ถูก',
      'welcome.desc':        'ปัดหาหนังและซีรีส์ที่ใช่ในไม่กี่วิ ดูคนเดียวก็ฟิน อยู่กับแฟน เพื่อน หรือครอบครัวก็ลงตัว',
      'welcome.signin':      'เข้าสู่ระบบ',
      'welcome.create':      'สร้างบัญชี',
      'welcome.agree':       'การใช้งานต่อถือว่าคุณยอมรับ', 'welcome.and': 'และ',
      'welcome.terms':       'ข้อกำหนด', 'welcome.privacy': 'นโยบายความเป็นส่วนตัว',

      // ── Chill review ──
      'rev.title':       'รีวิวสายชิล',
      'rev.subtitle':    'เล่าแบบเพื่อนเพิ่งดูจบ ไม่ต้องเป็นนักวิจารณ์',
      'rev.moviePrompt': 'ดูจบแล้ว มาปล่อยของกัน 🍿',
      'rev.stars':       'ให้กี่ดาวจากใจจริง?',
      'rev.mood':        'ความรู้สึกแรกพอจบเรื่อง',
      'rev.note':        'อยากเม้าท์อะไรเพิ่มไหม?',
      'rev.notePlaceholder': 'เช่น “พระเอกหล่อจนลืมพล็อต” หรือ “ป็อปคอร์นอร่อยกว่าหนัง” 🍿',
      'rev.tags':        'แปะป้ายให้หน่อย',
      'rev.post':        'ปล่อยรีวิวเลย',
      'rev.update':      'อัปเดตรีวิว',
      'rev.saved':       'ปล่อยรีวิวแล้ว! 🎉',
      'rev.yourReview':  'รีวิวของคุณ',
      'rev.write':       'เขียนรีวิวสายชิล',
      'rev.edit':        'แก้รีวิวของคุณ',
      'rev.nudgeTitle':  'ดูจบแล้วใช่ไหม?',
      'rev.nudgeCta':    'รีวิวเลย',
      'rev.nudgeSkip':   'ไว้ก่อน',
      // moods (emoji live in code)
      'rev.mood.love':     'ฟินจนละลาย',
      'rev.mood.laugh':    'ขำจนสำลัก',
      'rev.mood.wow':      'ทึ่งไปเลย',
      'rev.mood.cry':      'ร้องไห้หนักมาก',
      'rev.mood.confused': 'งงแต่ก็ชอบ',
      'rev.mood.sleep':    'หลับกลางเรื่อง',
      // vibe tags
      'rev.tag.rewatch': 'ดูซ้ำได้อีก',
      'rev.tag.mustsee': 'เพื่อนต้องได้ดู',
      'rev.tag.funny':   'ขำกร๊าก',
      'rev.tag.feels':   'ฟินเวอร์',
      'rev.tag.twist':   'พล็อตทวิสต์',
      'rev.tag.cried':   'เตรียมทิชชู่',
      'rev.tag.meh':     'เฉย ๆ นะ',

      // ── Share list ──
      'sl.title':        'แชร์ลิสต์นี้',
      'sl.subtitle':     'ส่งหนังที่คัดไว้ให้เพื่อนลองดู',
      'sl.heroSuffix':   'เรื่องที่อยากให้เธอดู',
      'sl.heroCaption':  'คัดมาแล้วว่า feel good ดูง่าย และเหมาะกับคืนวันศุกร์',
      'sl.copy':         'คัดลอกลิงก์',
      'sl.share':        'แชร์',
      'sl.linkCopied':   'คัดลอกลิงก์แล้ว',
      'sl.cta':          'แชร์ลิสต์นี้เลย',
      'sl.scanHint':     'สแกนเพื่อเปิดลิสต์',
      'sl.empty':        'ลิสต์ยังว่างอยู่ — ปัดเก็บหนังก่อนแล้วค่อยแชร์นะ 🍿',

      // ── Onboarding · popcorn genre picker ──
      'onb.tapToFill':  'เลือกแนวหนัง',
      'onb.bucketFull': 'เต็มถังเลย! รสนิยมดีมาก 🍿',
      'onb.genresLabel': 'แนว',

      // ── Add friend · QR / Link ──
      'qrp.title':    'แชร์ Match Doo ของคุณ',
      'qrp.sub':      'เพื่อนสแกน QR ค้นหาจากรหัส หรือกดลิงก์เพื่อเพิ่มคุณได้เลย',
      'qrp.save':     'บันทึกรูป QR',
      'qrp.saved':    'บันทึกรูป QR แล้ว',
      'qrp.yourCode': 'รหัสของคุณ — ให้เพื่อนค้นหา',
      'qrp.code':     'รหัส',
      'qrp.copy':     'คัดลอก',
      'qrp.copyCaps': 'คัดลอก',
      'qrp.link':     'ลิงก์',
      'qrp.copied':   'คัดลอกแล้ว',
      'qrp.copyFail': 'คัดลอกไม่สำเร็จ',

      // ── Common ──
      'common.save':   'บันทึก',
      'common.cancel': 'ยกเลิก',
      'common.done':   'เสร็จสิ้น',
      'lang.en': 'English',
      'lang.th': 'ไทย',
    },
  },
};

// Short global helper. Named `tr` (not `t`) to avoid colliding with the
// tweaks object `t` used in the App component.
window.tr = function (key, fallback) { return window.I18N.t(key, fallback); };

// ── Display-only localizers (data stays English; only the label changes) ──

// Genre display label. The catalog/filters keep the English genre string;
// this only swaps the visible text in Thai. Returns the input unchanged in EN.
const GENRE_TH = {
  'Action':'แอ็กชัน','Adventure':'ผจญภัย','Animation':'แอนิเมชัน','Comedy':'คอเมดี้',
  'Crime':'อาชญากรรม','Documentary':'สารคดี','Drama':'ดราม่า','Family':'ครอบครัว',
  'Fantasy':'แฟนตาซี','History':'ประวัติศาสตร์','Horror':'สยองขวัญ','Music':'ดนตรี',
  'Musical':'มิวสิคัล','Mystery':'ลึกลับ','Romance':'โรแมนติก','Sci-Fi':'ไซไฟ',
  'Thriller':'ระทึกขวัญ','War':'สงคราม','Western':'คาวบอย','Series':'ซีรีส์',
  'Film':'หนัง','Talk':'ทอล์ก','Reality':'เรียลลิตี้',
};
window.genreLabel = function (g) {
  if (!g || window.I18N.lang !== 'th') return g;
  return GENRE_TH[g] || g;
};

// Relative-time / activity string ("Active now", "2h ago", "Yesterday"…) → Thai.
window.relTime = function (s) {
  if (!s || window.I18N.lang !== 'th') return s;
  const M = { 'Active now':'ใช้งานอยู่', 'Yesterday':'เมื่อวาน', 'Just now':'เมื่อสักครู่', 'Just added':'เพิ่งเพิ่ม' };
  if (M[s]) return M[s];
  let m;
  if ((m = s.match(/^(\d+)m ago$/))) return `${m[1]} นาทีที่แล้ว`;
  if ((m = s.match(/^(\d+)h ago$/))) return `${m[1]} ชม.ที่แล้ว`;
  if ((m = s.match(/^(\d+)d ago$/))) return `${m[1]} วันที่แล้ว`;
  if ((m = s.match(/^(\d+)w ago$/))) return `${m[1]} สัปดาห์ที่แล้ว`;
  return s;
};

// Localized date formatter. Thai uses Thai month/weekday names with a
// Gregorian year (avoids Buddhist-era confusion since the data is Gregorian).
window.fmtDateLoc = function (iso, opts) {
  try {
    const d = /^\d{4}-\d{2}-\d{2}/.test(iso) ? new Date(iso + 'T00:00:00') : new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const loc = window.I18N.lang === 'th' ? 'th-TH-u-ca-gregory' : 'en-US';
    return d.toLocaleDateString(loc, opts);
  } catch { return iso; }
};
