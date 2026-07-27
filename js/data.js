// Mock data for Match Doo
// Each movie has a unique 2-tone palette so we can render distinctive editorial posters

window.MOVIES = [
  { id: 'm1', title: 'Parasite', year: 2019, runtime: 132, genres: ['Thriller', 'Drama'], rt: 99, imdb: 8.5, where: ['Netflix'], bg: '#1a1410', fg: '#e8c994', tag: 'One staircase, two families, no way back up.' },
  { id: 'm2', title: 'Spirited Away', year: 2001, runtime: 125, genres: ['Animation', 'Fantasy'], rt: 97, imdb: 8.6, where: ['Prime'], bg: '#0a1628', fg: '#e6f0ff', tag: 'Lose your name. Keep your nerve.' },
  { id: 'm3', title: 'The Godfather', year: 1972, runtime: 175, genres: ['Crime', 'Drama'], rt: 97, imdb: 9.2, where: ['Max'], bg: '#2a1f15', fg: '#f4d089', tag: 'An offer written in loyalty and blood.' },
  { id: 'm4', title: 'Inception', year: 2010, runtime: 148, genres: ['Sci-Fi', 'Thriller'], rt: 87, imdb: 8.8, where: ['Hulu'], bg: '#101418', fg: '#86A6DD', tag: 'Steal the idea before it steals you.' },
  { id: 'm5', title: 'Pan\'s Labyrinth', year: 2006, runtime: 118, genres: ['Fantasy', 'Drama'], rt: 95, imdb: 8.2, where: ['Disney+'], bg: '#3a1a12', fg: '#ffb88c', tag: 'A war outside. A kingdom underground.' },
  { id: 'm6', title: 'Amélie', year: 2001, runtime: 122, genres: ['Romance', 'Comedy'], rt: 89, imdb: 8.3, where: ['Apple TV+'], bg: '#13231a', fg: '#a8c9ad', tag: 'Paris, rearranged one small kindness at a time.' },
  { id: 'm7', title: 'The Dark Knight', year: 2008, runtime: 152, genres: ['Action', 'Crime'], rt: 94, imdb: 9.0, where: ['MUBI'], bg: '#1c1738', fg: '#d4c4ff', tag: 'The city keeps score. So does he.' },
  { id: 'm8', title: 'Everything Everywhere All at Once', year: 2022, runtime: 139, genres: ['Sci-Fi', 'Comedy'], rt: 95, imdb: 7.8, where: ['Netflix', 'Prime'], bg: '#2b1230', fg: '#ffc4d6', tag: 'Every life you could\'ve had, all at once.' },
  { id: 'm9', title: 'City of God', year: 2002, runtime: 130, genres: ['Crime', 'Drama'], rt: 90, imdb: 8.6, where: ['Max', 'Hulu'], bg: '#0d1418', fg: '#c8d6e0', tag: 'Grow up fast or don\'t grow up at all.' },
  { id: 'm10', title: 'La La Land', year: 2016, runtime: 128, genres: ['Musical', 'Romance'], rt: 91, imdb: 8.0, where: ['Prime', 'Apple TV+'], bg: '#28101e', fg: '#ffb3c1', tag: 'Chase the dream. Count the cost.' },
  { id: 'm11', title: 'Interstellar', year: 2014, runtime: 169, genres: ['Sci-Fi', 'Drama'], rt: 73, imdb: 8.7, where: ['Peacock'], bg: '#1f1a0e', fg: '#e8d18a', tag: 'Love is the only thing that crosses time.' },
  { id: 'm12', title: 'Portrait of a Lady on Fire', year: 2019, runtime: 122, genres: ['Romance', 'Drama'], rt: 95, imdb: 8.1, where: ['Paramount+'], bg: '#1a1f1a', fg: '#c9e0c1', tag: 'Look at me the way I\'m looking at you.' },
  { id: 'm13', title: 'Whiplash', year: 2014, runtime: 106, genres: ['Drama', 'Music'], rt: 94, imdb: 8.5, where: ['Netflix'], bg: '#0e1f24', fg: '#9ed5e0', tag: 'Not quite my tempo.' },
  { id: 'm14', title: 'Get Out', year: 2017, runtime: 104, genres: ['Horror', 'Thriller'], rt: 98, imdb: 7.7, where: ['Prime'], bg: '#161028', fg: '#93A8E8', tag: 'Meeting the parents was never this dangerous.' },
  { id: 'm15', title: 'Coco', year: 2017, runtime: 105, genres: ['Animation', 'Family'], rt: 97, imdb: 8.4, where: ['Max'], bg: '#241010', fg: '#E17F5C', tag: 'You\'re only forgotten when you\'re forgotten.' },
  { id: 'm16', title: 'Roma', year: 2018, runtime: 135, genres: ['Drama'], rt: 96, imdb: 7.7, where: ['Hulu'], bg: '#0f1c14', fg: '#7ED9B4', tag: 'A year in one house, remembered in full.' },
  { id: 'm17', title: 'Moonlight', year: 2016, runtime: 111, genres: ['Drama'], rt: 98, imdb: 7.4, where: ['Disney+'], bg: '#221408', fg: '#F0AC72', tag: 'Three chapters. One boy becoming himself.' },
  { id: 'm18', title: 'The Grand Budapest Hotel', year: 2014, runtime: 99, genres: ['Comedy'], rt: 92, imdb: 8.1, where: ['Apple TV+'], bg: '#141a26', fg: '#6F93E0', tag: 'Concierge, thief, legend — in that order.' },
  { id: 'm19', title: 'Your Name', year: 2016, runtime: 106, genres: ['Animation', 'Romance'], rt: 98, imdb: 8.4, where: ['MUBI'], bg: '#2a1018', fg: '#E8798A', tag: 'Two strangers, one borrowed life.' },
  { id: 'm20', title: 'Mad Max: Fury Road', year: 2015, runtime: 120, genres: ['Action', 'Adventure'], rt: 97, imdb: 8.1, where: ['Netflix', 'Prime'], bg: '#182410', fg: '#c3d98a', tag: 'Redemption, at full throttle, through the sand.' },
  { id: 'm21', title: 'Blade Runner 2049', year: 2017, runtime: 164, genres: ['Sci-Fi', 'Drama'], rt: 88, imdb: 8.0, where: ['Max', 'Hulu'], bg: '#1a1410', fg: '#e8c994', tag: 'Some memories aren\'t yours to keep.' },
  { id: 'm22', title: 'Knives Out', year: 2019, runtime: 130, genres: ['Mystery', 'Comedy'], rt: 97, imdb: 7.9, where: ['Prime', 'Apple TV+'], bg: '#0a1628', fg: '#e6f0ff', tag: 'Everyone in this house is a suspect.' },
  { id: 'm23', title: 'The Shawshank Redemption', year: 1994, runtime: 142, genres: ['Drama'], rt: 91, imdb: 9.3, where: ['Peacock'], bg: '#2a1f15', fg: '#f4d089', tag: 'Hope is a very patient thing.' },
  { id: 'm24', title: 'Oldboy', year: 2003, runtime: 120, genres: ['Thriller', 'Mystery'], rt: 81, imdb: 8.4, where: ['Paramount+'], bg: '#101418', fg: '#86A6DD', tag: 'Fifteen years locked up. Five days to find why.' },
  { id: 'm25', title: 'Little Women', year: 2019, runtime: 135, genres: ['Drama', 'Romance'], rt: 95, imdb: 7.8, where: ['Netflix'], bg: '#3a1a12', fg: '#ffb88c', tag: 'Four sisters. One stubborn idea of a life.' },
  { id: 'm26', title: 'Jojo Rabbit', year: 2019, runtime: 108, genres: ['Comedy', 'Drama'], rt: 80, imdb: 7.9, where: ['Prime'], bg: '#13231a', fg: '#a8c9ad', tag: 'His imaginary friend has the worst ideas.' },
  { id: 'm27', title: 'The Handmaiden', year: 2016, runtime: 145, genres: ['Thriller', 'Romance'], rt: 84, imdb: 8.1, where: ['Max'], bg: '#1c1738', fg: '#d4c4ff', tag: 'A con with two hearts and three endings.' },
  { id: 'm28', title: 'Call Me by Your Name', year: 2017, runtime: 132, genres: ['Romance', 'Drama'], rt: 95, imdb: 7.9, where: ['Hulu'], bg: '#2b1230', fg: '#ffc4d6', tag: 'One Italian summer, never quite over.' },
  { id: 'm29', title: 'Arrival', year: 2016, runtime: 116, genres: ['Sci-Fi', 'Drama'], rt: 94, imdb: 7.9, where: ['Disney+'], bg: '#0d1418', fg: '#c8d6e0', tag: 'Learn their language. Lose your sense of time.' },
  { id: 'm30', title: 'Train to Busan', year: 2016, runtime: 118, genres: ['Horror', 'Action'], rt: 95, imdb: 7.6, where: ['Apple TV+'], bg: '#28101e', fg: '#ffb3c1', tag: 'A father, a daughter, and a train full of trouble.' },
  { id: 'm31', title: 'The Farewell', year: 2019, runtime: 100, genres: ['Drama', 'Comedy'], rt: 98, imdb: 7.5, where: ['MUBI'], bg: '#1f1a0e', fg: '#e8d18a', tag: 'The whole family knows. Grandma doesn\'t.' },
  { id: 'm32', title: 'Life of Pi', year: 2012, runtime: 127, genres: ['Adventure', 'Drama'], rt: 87, imdb: 7.9, where: ['Netflix', 'Prime'], bg: '#1a1f1a', fg: '#c9e0c1', tag: 'A lifeboat, a tiger, and a story worth believing.' },
  { id: 'm33', title: 'Booksmart', year: 2019, runtime: 105, genres: ['Comedy'], rt: 97, imdb: 7.1, where: ['Max', 'Hulu'], bg: '#0e1f24', fg: '#9ed5e0', tag: 'Four years of being good. One night to fix that.' },
  { id: 'm34', title: 'The Lighthouse', year: 2019, runtime: 109, genres: ['Horror', 'Drama'], rt: 90, imdb: 7.4, where: ['Prime', 'Apple TV+'], bg: '#161028', fg: '#93A8E8', tag: 'Two keepers, one light, and the sea listening.' },
  { id: 'm35', title: 'Minari', year: 2020, runtime: 115, genres: ['Drama'], rt: 98, imdb: 7.4, where: ['Peacock'], bg: '#241010', fg: '#E17F5C', tag: 'A family plants roots in unfamiliar soil.' },
  { id: 'm36', title: 'Drive My Car', year: 2021, runtime: 179, genres: ['Drama'], rt: 97, imdb: 7.6, where: ['Paramount+'], bg: '#0f1c14', fg: '#7ED9B4', tag: 'Grief rides shotgun on the long way home.' },
  { id: 'm37', title: 'Nomadland', year: 2020, runtime: 107, genres: ['Drama'], rt: 93, imdb: 7.3, where: ['Netflix'], bg: '#221408', fg: '#F0AC72', tag: 'Home isn\'t a house. It\'s the road.' },
  { id: 'm38', title: 'The Trial of the Chicago 7', year: 2020, runtime: 129, genres: ['Drama', 'History'], rt: 90, imdb: 7.7, where: ['Prime'], bg: '#141a26', fg: '#6F93E0', tag: 'Seven defendants. One country on trial.' },
  { id: 'm39', title: 'Soul', year: 2020, runtime: 100, genres: ['Animation', 'Fantasy'], rt: 95, imdb: 8.0, where: ['Max'], bg: '#2a1018', fg: '#E8798A', tag: 'Find your spark before you find your purpose.' },
  { id: 'm40', title: 'Dune', year: 2021, runtime: 155, genres: ['Sci-Fi', 'Adventure'], rt: 83, imdb: 8.0, where: ['Hulu'], bg: '#182410', fg: '#c3d98a', tag: 'The spice, the sand, and a prophecy he never asked for.' },
  { id: 'm41', title: 'CODA', year: 2021, runtime: 111, genres: ['Drama', 'Music'], rt: 94, imdb: 8.0, where: ['Disney+'], bg: '#1a1410', fg: '#e8c994', tag: 'The only hearing one in a family of four.' },
  { id: 'm42', title: 'The Power of the Dog', year: 2021, runtime: 126, genres: ['Drama', 'Western'], rt: 94, imdb: 6.8, where: ['Apple TV+'], bg: '#0a1628', fg: '#e6f0ff', tag: 'Two brothers, one ranch, and a quiet kind of cruelty.' },
  { id: 'm43', title: 'RRR', year: 2022, runtime: 187, genres: ['Action', 'Drama'], rt: 95, imdb: 7.8, where: ['MUBI'], bg: '#2a1f15', fg: '#f4d089', tag: 'Two revolutionaries, one impossible friendship.' },
  { id: 'm44', title: 'The Banshees of Inisherin', year: 2022, runtime: 114, genres: ['Comedy', 'Drama'], rt: 96, imdb: 7.7, where: ['Netflix', 'Prime'], bg: '#101418', fg: '#86A6DD', tag: 'He just doesn\'t like you anymore.' },
  { id: 'm45', title: 'Top Gun: Maverick', year: 2022, runtime: 130, genres: ['Action', 'Drama'], rt: 96, imdb: 8.3, where: ['Max', 'Hulu'], bg: '#3a1a12', fg: '#ffb88c', tag: 'Some legends never really land.' },
  { id: 'm46', title: 'All Quiet on the Western Front', year: 2022, runtime: 148, genres: ['War', 'Drama'], rt: 91, imdb: 7.7, where: ['Prime', 'Apple TV+'], bg: '#13231a', fg: '#a8c9ad', tag: 'Glory looks different from the trench.' },
  { id: 'm47', title: 'Aftersun', year: 2022, runtime: 102, genres: ['Drama'], rt: 97, imdb: 7.6, where: ['Peacock'], bg: '#1c1738', fg: '#d4c4ff', tag: 'A holiday, a camcorder, and everything unsaid.' },
  { id: 'm48', title: 'Past Lives', year: 2023, runtime: 105, genres: ['Romance', 'Drama'], rt: 96, imdb: 7.9, where: ['Paramount+'], bg: '#2b1230', fg: '#ffc4d6', tag: 'Twenty years later, the question is still there.' },
  { id: 'm49', title: 'Anatomy of a Fall', year: 2023, runtime: 152, genres: ['Drama', 'Mystery'], rt: 96, imdb: 7.7, where: ['Netflix'], bg: '#0d1418', fg: '#c8d6e0', tag: 'Her marriage is now Exhibit A.' },
  { id: 'm50', title: 'Poor Things', year: 2023, runtime: 141, genres: ['Comedy', 'Sci-Fi'], rt: 92, imdb: 7.9, where: ['Prime'], bg: '#28101e', fg: '#ffb3c1', tag: 'A new mind, an old world, and no rules yet.' },

  // ── Added catalog: HBO/Max, Netflix, Apple TV+, Disney+ (movies + series) ──
  // Max
  { id: 'm51', title: 'The Last of Us', type: 'series', seasons: 2, year: 2023, runtime: 55, genres: ['Drama', 'Sci-Fi'], rt: 96, imdb: 8.7, where: ['Max'], bg: '#1c2620', fg: '#cfe8d8', tag: 'Love and survival in a world gone quiet.' },
  { id: 'm52', title: 'House of the Dragon', type: 'series', seasons: 2, year: 2022, runtime: 60, genres: ['Fantasy', 'Drama'], rt: 92, imdb: 8.4, where: ['Max'], bg: '#2a1518', fg: '#f0c0a0', tag: 'The throne divides even its own blood.' },
  { id: 'm53', title: 'Dune: Part Two', type: 'movie', year: 2024, runtime: 166, genres: ['Sci-Fi', 'Adventure'], rt: 92, imdb: 8.5, where: ['Max'], bg: '#2a2113', fg: '#f0d9a0', tag: 'A desert prophecy, written in sand and war.' },
  { id: 'm54', title: 'Succession', type: 'series', seasons: 4, year: 2018, runtime: 60, genres: ['Drama', 'Comedy'], rt: 94, imdb: 8.9, where: ['Max'], bg: '#14181f', fg: '#cdd6e0', tag: 'Family, but make it a hostile takeover.' },
  // Netflix
  { id: 'm55', title: 'Stranger Things', type: 'series', seasons: 4, year: 2016, runtime: 50, genres: ['Sci-Fi', 'Horror'], rt: 92, imdb: 8.7, where: ['Netflix'], bg: '#1a0e12', fg: '#ff7a6b', tag: 'Small town, big monsters, closer friends.' },
  { id: 'm56', title: 'The Crown', type: 'series', seasons: 6, year: 2016, runtime: 58, genres: ['Drama', 'History'], rt: 89, imdb: 8.6, where: ['Netflix'], bg: '#101826', fg: '#d4c07a', tag: 'The weight of a crown, worn quietly.' },
  { id: 'm57', title: 'Glass Onion', type: 'movie', year: 2022, runtime: 139, genres: ['Mystery', 'Comedy'], rt: 92, imdb: 7.1, where: ['Netflix'], bg: '#14211f', fg: '#ffd98a', tag: "Everyone's a suspect on a very rich island." },
  { id: 'm58', title: 'Wednesday', type: 'series', seasons: 1, year: 2022, runtime: 50, genres: ['Comedy', 'Mystery'], rt: 72, imdb: 8.1, where: ['Netflix'], bg: '#14161a', fg: '#9be3c9', tag: 'Deadpan, deadly, and delightfully strange.' },
  // Apple TV+
  { id: 'm59', title: 'Ted Lasso', type: 'series', seasons: 3, year: 2020, runtime: 45, genres: ['Comedy', 'Drama'], rt: 90, imdb: 8.8, where: ['Apple TV+'], bg: '#17202a', fg: '#cfe0f0', tag: 'Kindness as a winning strategy.' },
  { id: 'm60', title: 'Severance', type: 'series', seasons: 2, year: 2022, runtime: 55, genres: ['Sci-Fi', 'Thriller'], rt: 97, imdb: 8.7, where: ['Apple TV+'], bg: '#0e1620', fg: '#a7c4e0', tag: 'Leave your life at the office door — literally.' },
  { id: 'm61', title: 'CODA', type: 'movie', year: 2021, runtime: 111, genres: ['Drama', 'Music'], rt: 94, imdb: 8.0, where: ['Apple TV+'], bg: '#1b2224', fg: '#bfe0d8', tag: 'A voice her family will never hear.' },
  { id: 'm62', title: 'Killers of the Flower Moon', type: 'movie', year: 2023, runtime: 206, genres: ['Crime', 'Drama'], rt: 93, imdb: 7.6, where: ['Apple TV+'], bg: '#241612', fg: '#e6b088', tag: 'A fortune found, a people betrayed.' },
  // Disney+
  { id: 'm63', title: 'The Mandalorian', type: 'series', seasons: 3, year: 2019, runtime: 40, genres: ['Sci-Fi', 'Adventure'], rt: 91, imdb: 8.6, where: ['Disney+'], bg: '#1a1712', fg: '#e8cf9a', tag: 'A bounty hunter with a very small boss.' },
  { id: 'm64', title: 'Loki', type: 'series', seasons: 2, year: 2021, runtime: 50, genres: ['Sci-Fi', 'Fantasy'], rt: 83, imdb: 8.2, where: ['Disney+'], bg: '#14261f', fg: '#7be0b0', tag: 'Time is broken. So is he.' },
  { id: 'm65', title: 'Encanto', type: 'movie', year: 2021, runtime: 102, genres: ['Animation', 'Family'], rt: 90, imdb: 7.2, where: ['Disney+'], bg: '#201430', fg: '#ffb0e0', tag: 'Every gift but her own.' },
  { id: 'm66', title: 'Andor', type: 'series', seasons: 2, year: 2022, runtime: 45, genres: ['Sci-Fi', 'Drama'], rt: 96, imdb: 8.4, where: ['Disney+'], bg: '#12181c', fg: '#b8c8d0', tag: 'A rebellion begins with one ordinary man.' },
];

// Friends — three relationship contexts
window.FRIENDS = {
  couple: [
    { id: 'f1', name: 'Sofia',    handle: '@sofialdn',  rel: 'couple',  initials: 'SO', tone: '#E17F5C', online: true,  lastSeen: 'Active now',     mutual: 12 },
  ],
  family: [
    { id: 'f2', name: 'Mom',      handle: '@maria.m',   rel: 'family',  initials: 'MA', tone: '#F0AC72', online: false, lastSeen: '2h ago',          mutual: 3 },
    { id: 'f3', name: 'Lucas',    handle: '@lucas_m',   rel: 'family',  initials: 'LU', tone: '#E8945F', online: true,  lastSeen: 'Active now',      mutual: 7 },
    { id: 'f4', name: 'Aunt Rita',handle: '@rita.b',    rel: 'family',  initials: 'RI', tone: '#e8c994', online: false, lastSeen: 'Yesterday',       mutual: 1 },
  ],
  friends: [
    { id: 'f5', name: 'Owen Pak',   handle: '@owen',     rel: 'friends', initials: 'OW', tone: '#86A6DD', online: true,  lastSeen: 'Active now',     mutual: 9 },
    { id: 'f6', name: 'Mira Cole',  handle: '@miracole', rel: 'friends', initials: 'MI', tone: '#93A8E8', online: true,  lastSeen: 'Active now',     mutual: 14 },
    { id: 'f7', name: 'Jules',      handle: '@jules.k',  rel: 'friends', initials: 'JU', tone: '#a8c9ad', online: false, lastSeen: '30m ago',        mutual: 5 },
    { id: 'f8', name: 'Tomás Reyes',handle: '@tomas',    rel: 'friends', initials: 'TR', tone: '#ffb3c1', online: false, lastSeen: '4h ago',         mutual: 8 },
    { id: 'f9', name: 'Hana',       handle: '@hana.x',   rel: 'friends', initials: 'HA', tone: '#d4c4ff', online: false, lastSeen: '2d ago',         mutual: 2 },
  ],
};

// Pre-seeded matches (mutual likes) per friend
// Each entry: { friendId, movieIds: [...likes], watched: [...watched together] }
window.MATCHES = {
  f1: { movieIds: ['m1','m5','m8','m12','m14'],  watched: ['m3','m7']  },
  f2: { movieIds: ['m9','m11'],                  watched: ['m13']      },
  f3: { movieIds: ['m2','m4','m7'],              watched: []           },
  f4: { movieIds: ['m9'],                        watched: []           },
  f5: { movieIds: ['m2','m4','m6','m11'],        watched: ['m9']       },
  f6: { movieIds: ['m1','m10','m14','m8','m5'],  watched: ['m12']      },
  f7: { movieIds: ['m6','m11'],                  watched: []           },
  f8: { movieIds: ['m3','m10'],                  watched: ['m8']       },
  f9: { movieIds: ['m14'],                       watched: []           },
};

// Pending suggestions (people who want to add you)
window.PENDING = [
  { id: 'p1', name: 'Iris Lane',   handle: '@iris',    initials: 'IL', tone: '#E8945F', mutual: 3 },
  { id: 'p2', name: 'Ben Ortiz',   handle: '@bortiz',  initials: 'BO', tone: '#86A6DD', mutual: 1 },
];

// Streaming service swatches
window.SERVICES = {
  'Netflix':   { color: '#e50914', short: 'N'  },
  'Prime':     { color: '#00a8e1', short: 'pv' },
  'Hulu':      { color: '#1ce783', short: 'h'  },
  'Max':       { color: '#0079d3', short: 'M'  },
  'Apple TV+': { color: '#000000', short: 'tv' },
  'Disney+':   { color: '#1f4690', short: 'D+' },
  'MUBI':      { color: '#0a0a0a', short: 'mu' },
  'Viu':       { color: '#ffcc00', short: 'vi' },
  'iQIYI':     { color: '#00be06', short: 'iQ' },
  'WeTV':      { color: '#00a0e9', short: 'we' },
};

// ─── Ads (Banner / Swipe / Popup) ───────────────────────────────────
// Managed from the Admin CMS. Dates are plain "YYYY-MM-DD" + "HH:MM" (24h)
// so scheduling can be edited with native <input type="date"/"time">.
window.ADS = {
  // Global cadence for Swipe Ads — one setting for all campaigns.
  cadence: { every: 7, mode: 'Counts every swipe direction', rotation: 'Weighted by priority', skipAfter: 3 },

  banners: [
    { id: 'bn1', name: 'House of the Dragon S3', advertiser: 'HBO Max', headline: 'House of the Dragon returns July 18',
      placement: 'swipeTop', ctaText: 'Watch now', ctaUrl: 'https://max.com',
      priority: 8, freqCap: 4, audience: 'Everyone',
      startDate: '2026-06-15', startTime: '00:00', endDate: '2026-07-20', endTime: '23:59',
      enabled: true, impressions: 284102, clicks: 5210 },
    { id: 'bn2', name: 'Movie Night Playlist', advertiser: 'Spotify', headline: 'Set the mood — Movie Night playlist',
      placement: 'roomsTop', ctaText: 'Open Spotify', ctaUrl: 'https://spotify.com',
      priority: 6, freqCap: 3, audience: 'Users with 1+ match',
      startDate: '2026-06-01', startTime: '00:00', endDate: '2026-07-31', endTime: '23:59',
      enabled: true, impressions: 152300, clicks: 2870 },
    { id: 'bn3', name: 'A24 Summer Series', advertiser: 'AMC Theatres', headline: 'A24 Summer Series — now playing',
      placement: 'sticky', ctaText: 'Get tickets', ctaUrl: 'https://amctheatres.com',
      priority: 9, freqCap: 5, audience: 'Everyone',
      startDate: '2026-06-20', startTime: '00:00', endDate: '2026-07-20', endTime: '23:59',
      enabled: true, impressions: 96500, clicks: 3110 },
    { id: 'bn4', name: 'Peacock Fall Preview', advertiser: 'Peacock', headline: 'First look: Peacock fall lineup',
      placement: 'swipeTop', ctaText: 'Preview now', ctaUrl: 'https://peacocktv.com',
      priority: 5, freqCap: 3, audience: 'New users (first 7 days)',
      startDate: '2026-07-10', startTime: '00:00', endDate: '2026-08-10', endTime: '23:59',
      enabled: false, impressions: 0, clicks: 0 },
  ],

  swipeAds: [
    { id: 'sw1', name: 'The Studio', advertiser: 'Apple TV+', headline: 'The Studio', tag: 'New season — every Friday.',
      ctaText: 'Watch trailer', ctaUrl: 'https://tv.apple.com', bg: '#0a0a0a', fg: '#e8e8e8',
      priority: 9, freqCap: 3, audience: 'Everyone',
      startDate: '2026-06-01', startTime: '09:00', endDate: '2026-07-30', endTime: '23:59',
      enabled: true, impressions: 184210, clicks: 9870 },
    { id: 'sw2', name: 'Premium Family', advertiser: 'Spotify', headline: 'Spotify Premium Family', tag: 'One plan. Six accounts.',
      ctaText: 'Try free', ctaUrl: 'https://spotify.com', bg: '#0d2818', fg: '#c8f5da',
      priority: 6, freqCap: 2, audience: 'Everyone',
      startDate: '2026-06-15', startTime: '00:00', endDate: '2026-07-14', endTime: '23:59',
      enabled: true, impressions: 72408, clicks: 3012 },
    { id: 'sw3', name: 'Re-issue Week', advertiser: 'Cinema Maxi', headline: 'Re-issue Week', tag: 'Classics, back on the big screen.',
      ctaText: 'Get tickets', ctaUrl: 'https://cinemamaxi.example', bg: '#241a0d', fg: '#f4d089',
      priority: 4, freqCap: 1, audience: 'Users with 1+ match',
      startDate: '2026-07-05', startTime: '00:00', endDate: '2026-07-12', endTime: '23:59',
      enabled: false, impressions: 0, clicks: 0 },
  ],

  popupAds: [
    { id: 'pa1', name: 'New Movie Fridays', advertiser: 'Peacock', headline: "New movies drop every Friday",
      body: "Stream this week's biggest releases free with your subscription.",
      ctaText: 'Explore Peacock', ctaUrl: 'https://peacocktv.com',
      trigger: 'On app open', priority: 8, freqCap: 1, audience: 'Everyone',
      startDate: '2026-06-20', startTime: '00:00', endDate: '2026-07-20', endTime: '23:59',
      enabled: true, impressions: 42100, clicks: 1870 },
    { id: 'pa2', name: 'Summer Blockbusters', advertiser: 'Max', headline: "This summer's biggest movies",
      body: 'One month free when you sign up today.',
      ctaText: 'Claim offer', ctaUrl: 'https://max.com',
      trigger: 'After 5 swipes', priority: 5, freqCap: 1, audience: 'New users (first 7 days)',
      startDate: '2026-06-25', startTime: '00:00', endDate: '2026-07-25', endTime: '23:59',
      enabled: true, impressions: 18400, clicks: 640 },
    { id: 'pa3', name: 'Local Cinema Nights', advertiser: 'Local Cinema Co.', headline: 'Bring the theater home',
      body: 'Rent this week\u2019s indie picks at half price.',
      ctaText: 'See offers', ctaUrl: 'https://localcinema.example',
      trigger: 'On app open', priority: 3, freqCap: 1, audience: 'Everyone',
      startDate: '2026-07-08', startTime: '00:00', endDate: '2026-07-15', endTime: '23:59',
      enabled: false, impressions: 0, clicks: 0 },
  ],
};

