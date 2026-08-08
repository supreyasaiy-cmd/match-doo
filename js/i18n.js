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
      'profile.group.account':  'บัญชี',
      'profile.group.films':    'ภาพยนตร์',
      'profile.group.app':      'แอป',
      'profile.group.legal':    'ข้อกฎหมาย',
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
