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
      'rooms.swipeTogether':  'ปัดด้วยกัน',
      'rooms.topPicks':       'ตัวเลือกยอดนิยมรอบนี้',
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
      'friends.mutual':   'เพื่อนร่วมกัน',
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
      'profile.email':          'อีเมล',
      'profile.birthday':       'วันเกิด',
      'profile.gender':         'เพศ',
      'profile.notifications':  'การแจ้งเตือน',
      'profile.tmdb':           'การเชื่อมต่อ TMDB',
      'profile.themes':         'ธีม',
      'profile.language':       'ภาษา',
      'profile.signout':        'ออกจากระบบ',
      'profile.terms':          'ข้อกำหนดและเงื่อนไข',
      'profile.privacy':        'นโยบายความเป็นส่วนตัว',
      'profile.tagline':        'Match Doo · สร้างมาเพื่อค่ำคืนดูหนัง',

      // ── Welcome ──
      'welcome.badge':       'เลือกให้น้อยลง ดูด้วยกันให้มากขึ้น',
      'welcome.desc':        'ค้นพบหนังและซีรีส์ไปด้วยกัน ปัด จับคู่ แล้วเปลี่ยนหนังที่ถูกใจให้เป็นค่ำคืนดูหนังครั้งต่อไป',
      'welcome.signin':      'เข้าสู่ระบบ',
      'welcome.create':      'สร้างบัญชี',

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
