// components.jsx — Shared atoms for Match Doo
// Poster, Avatar, Icon, ServiceChip, etc.

// ─── Icons ──────────────────────────────────────────────────────────
function Icon({ name, size = 20, color = 'currentColor', stroke = 2.2 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    heart:    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
    x:        <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>,
    eye:      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    star:     <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>,
    starf:    <path fill={color} stroke="none" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>,
    play:     <path fill={color} stroke="none" d="M8 5v14l11-7z"/>,
    cards:    <><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18"/></>,
    users:    <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    user:     <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    usersRound:<g transform="scale(1.714)"><path fill={color} stroke="none" d="M5.36279 1.20313q-0.54688 0.07178-1.0459 0.31103-0.49561 0.23584-0.88525 0.61523-0.47852 0.44775-0.74512 0.99122-0.43408 0.9126-0.34179 1.88671 0.09229 0.9707 0.70752 1.76709 0.08545 0.14014 0.25293 0.31104 0.16748 0.16748 0.29394 0.27685l0.10938 0.08545-0.24952 0.12647q-0.71436 0.3623-1.30224 0.95019-0.25293 0.23926-0.3999 0.42383-0.14697 0.18115-0.31446 0.43067-0.12646 0.18457-0.28711 0.49902-0.16064 0.31445-0.23242 0.50928-0.32129 0.88184-0.33496 1.73633 0 0.18115 0.00684 0.23242 0.00684 0.04785 0.03418 0.1333 0.05811 0.0957 0.14013 0.18115 0.21191 0.19482 0.50586 0.14697 0.29395-0.04785 0.42041-0.31445 0.02734-0.07178 0.03418-0.12647 0.00684-0.05811 0.02051-0.25292 0.02734-0.4751 0.12646-0.875 0.09912-0.3999 0.29395-0.78956 0.44775-0.93994 1.30225-1.5415 0.85449-0.60156 1.87646-0.71435 0.93652-0.11279 1.81836 0.1914 0.88184 0.30078 1.55518 0.9707 0.48877 0.49219 0.79638 1.14502 0.30762 0.64941 0.36573 1.30567l0.04101 0.40674q0.01367 0.16748 0.04102 0.25976 0.03076 0.08887 0.12646 0.18115 0.09912 0.08887 0.18115 0.12647 0.08545 0.03418 0.22559 0.03418 0.14014 0 0.22217-0.03418 0.08545-0.0376 0.18115-0.1333 0.09912-0.09912 0.1333-0.18115 0.0376-0.08545 0.0376-0.28028 0.01367-0.57422-0.16065-1.24756-0.17432-0.67334-0.48193-1.23046-0.3794-0.68701-0.95361-1.24073-0.57422-0.55371-1.26123-0.90234l-0.24951-0.12647 0.06835-0.05468q0.09912-0.08545 0.30762-0.30078 0.21191-0.21875 0.29395-0.33155 0.49219-0.65625 0.64599-1.49707 0.04102-0.18115 0.04102-0.52295 0-0.34521-0.02735-0.54004-0.12646-0.89551-0.63916-1.60302-0.50928-0.70752-1.32275-1.08692-0.52979-0.24951-1.104-0.32129-0.18457-0.01367-0.45117-0.01367-0.26318 0-0.417 0.02735z m4.74414 0.39306q-0.12647 0.02734-0.23242 0.11279-0.10254 0.08203-0.15722 0.19483-0.04443 0.08545-0.05127 0.22558-0.00684 0.14014 0.02734 0.23926 0.0376 0.0957 0.10596 0.17432 0.07178 0.0752 0.22558 0.17432 0.38965 0.26318 0.64942 0.64257 0.25977 0.37939 0.35888 0.84082 0.04102 0.15381 0.04102 0.46143 0 0.30762-0.04102 0.46143-0.08545 0.39307-0.28369 0.73828-0.19482 0.3418-0.48877 0.57763-0.15381 0.12646-0.19482 0.17774-0.04102 0.04785-0.09912 0.14355-0.05469 0.12646-0.04102 0.28711 0.01367 0.16064 0.09912 0.27344 0.02734 0.05811 0.2666 0.2666 1.00488 0.84082 1.55176 2.15674 0.33838 0.79639 0.39307 1.65088 0.01367 0.29395 0.03418 0.3999 0.02051 0.10596 0.07861 0.18799 0.15381 0.23926 0.42383 0.2666 0.27344 0.02734 0.47168-0.18115 0.12646-0.11279 0.15381-0.25293 0.02734-0.14014 0.01367-0.46143-0.04101-0.65967-0.21191-1.26806-0.16748-0.6084-0.48877-1.23731-0.4751-0.95361-1.16211-1.68164l-0.18116-0.18115 0.06836-0.08545q0.08545-0.08203 0.19825-0.26318 0.46142-0.67334 0.58105-1.46973 0.11963-0.7998-0.1333-1.56885-0.16748-0.51953-0.49219-0.96728-0.32129-0.44775-0.75537-0.76905-0.2666-0.19824-0.42041-0.25293-0.15381-0.05469-0.30762-0.01367z m-3.87597 0.76904q0.71436 0.12646 1.24414 0.65284 0.5332 0.52295 0.65967 1.25097 0.01367 0.14014 0.0205 0.3794 0.00684 0.23926-0.0205 0.3623-0.07178 0.44775-0.29053 0.82715-0.21533 0.37939-0.55029 0.64258-0.54688 0.43408-1.24073 0.50586-0.69043 0.06836-1.30566-0.25293-0.47852-0.25293-0.79297-0.69385-0.31445-0.44092-0.41357-0.95703-0.02734-0.14014-0.02735-0.3999 0-0.25977 0.01367-0.38623 0.14014-0.79639 0.73487-1.33985 0.59473-0.54688 1.38086-0.60498 0.29395-0.02734 0.58789 0.02735l0-0.01368z"/></g>,
    plus:     <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    chev:     <path d="M9 18l6-6-6-6"/>,
    chevdn:   <path d="M6 9l6 6 6-6"/>,
    chevup:   <path d="M18 15l-6-6-6 6"/>,
    chevl:    <path d="M15 18l-6-6 6-6"/>,
    search:   <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></>,
    qr:       <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3h-3z"/><path d="M20.5 14v3M14 20.5h3M19 19.5h2.5"/></>,
    phone:    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>,
    mail:     <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    clock:    <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    cake:     <><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3M12 8v3M17 8v3"/><path d="M7 4h.01M12 4h.01M17 4h.01"/></>,
    languages:<g transform="scale(1.714)"><path fill={color} stroke="none" d="M3.9751 0.60156q-0.24951 0.04102-0.38281 0.2666-0.1333 0.22217-0.06495 0.46143 0.04102 0.14014 0.14698 0.24609 0.10596 0.10596 0.24609 0.14698 0.08203 0.02734 0.45459 0.02734 0.37256 0 0.45459-0.02734 0.18115-0.05811 0.30762-0.21875 0.12646-0.16064 0.11279-0.36231-0.01367-0.20508-0.14697-0.35889-0.1333-0.15381-0.3418-0.18115-0.09912-0.02734-0.39307-0.02734-0.29395 0-0.39306 0.02734z m-2.89844 1.73633q-0.23584 0.04102-0.38281 0.24609-0.14697 0.20166-0.09229 0.44092 0.01367 0.0957 0.04785 0.16748 0.0376 0.06836 0.1128 0.14014 0.07861 0.06836 0.16064 0.11279l0.09912 0.04102 2.43701 0.01367q2.43359 0 2.4336 0.00684 0 0.00684-0.24951 0.3999l-0.26661 0.38965-0.99462 0.99463-0.56055-0.54346q-0.54688-0.54688-0.61524-0.58789-0.11279-0.07178-0.27343-0.07178-0.16064 0-0.28711 0.07178-0.2085 0.0957-0.28028 0.32812-0.06836 0.229 0.04444 0.45459 0.02734 0.06836 0.58789 0.62891l0.54346 0.54687-0.83741 0.8545q-0.56055 0.56055-0.71435 0.72119-0.15381 0.16064-0.18457 0.229-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.06836-0.03076 0.229-0.18457 0.16064-0.15381 0.72119-0.71435l0.8545-0.83741 0.84082 0.83741q0.56055 0.56055 0.72119 0.71435 0.16064 0.15381 0.229 0.18457 0.23926 0.10938 0.46143 0.01367 0.22559-0.09912 0.32129-0.32128 0.09912-0.22559-0.01026-0.46485-0.03076-0.06836-0.18457-0.229-0.15381-0.16064-0.71435-0.72119l-0.83741-0.8545 1.09034-1.09375 1.0083-1.52441 0.47509 0q0.39307 0 0.49561-0.01367 0.10596-0.01367 0.21875-0.09912 0.21191-0.14014 0.24609-0.36914 0.03418-0.23242-0.09912-0.43409-0.1333-0.20508-0.38281-0.23242-0.09912-0.02734-3.58545-0.02734-3.48633 0-3.59912 0.02734l0-0.01367z m8.6543 4.11524q-0.07178 0.01367-0.15039 0.07177-0.0752 0.05469-0.11621 0.1128-0.04102 0.05469-1.521 3.00781-1.47656 2.95313-1.50391 3.0249-0.02734 0.06836-0.01367 0.19482 0.01367 0.12647 0.04102 0.21192 0.05811 0.12647 0.1914 0.22558 0.1333 0.0957 0.27002 0.10938 0.14014 0.01367 0.28028-0.04102 0.14014-0.05811 0.22558-0.1538 0.05469-0.05811 0.57422-1.09375l0.51611-1.04932 2.77198 0 0.51953 1.03564q0.51953 1.03564 0.57422 1.09375 0.06836 0.10938 0.22217 0.16748 0.15723 0.05469 0.2666 0.04102 0.2666-0.02734 0.42041-0.22901 0.15381-0.20508 0.11279-0.458-0.02734-0.0957-1.52783-3.07959-1.07666-2.17041-1.29541-2.5874-0.21533-0.42041-0.28369-0.47852-0.1709-0.15381-0.39307-0.15381-0.11279 0-0.18115 0.02735z m0.58789 2.6455q0.38965 0.78613 0.38965 0.80664 0 0.02051-0.79981 0.02051-0.79639 0-0.79639-0.01367l0.79981-1.59619q0.01367 0 0.40674 0.78271z"/></g>,
    check:    <path d="M20 6L9 17l-5-5"/>,
    arrow:    <><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></>,
    undo:     <><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-4"/></>,
    bell:     <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    sparkle:  <path fill={color} stroke="none" d="M12 2l1.8 6.5L20 10l-6.2 1.5L12 18l-1.8-6.5L4 10l6.2-1.5L12 2z"/>,
    bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>,
    link:     <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
    copy:     <><rect x="9" y="9" width="13" height="13" rx="2.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    share:    <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98"/><path d="M15.41 6.51l-6.82 3.98"/></>,
    contacts: <><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></>,
    film:     <><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/></>,
    home:     <><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></>,
    tv:       <g transform="scale(1.714)"><path fill={color} stroke="none" d="M3.9751 0.60156q-0.18115 0.02734-0.30762 0.16748-0.12646 0.14014-0.15381 0.33155-0.02734 0.18799 0.05469 0.35546 0.04443 0.05469 1.03906 1.04932l0.97754 0.99463-1.66455 0q-1.68164 0-1.82178 0.01367-0.54346 0.08545-0.95019 0.46485-0.40674 0.37598-0.53321 0.92285-0.01367 0.10938-0.02734 0.64258l0 6.37109 0.04102 0.16748q0.07178 0.25293 0.18115 0.44092 0.11279 0.18799 0.29394 0.37256 0.18457 0.18115 0.37256 0.29394 0.18799 0.10938 0.44092 0.18115l0.16748 0.04102 9.83008 0 0.16748-0.04102q0.25293-0.07178 0.44092-0.18115 0.18799-0.11279 0.36914-0.29394 0.18457-0.18457 0.29394-0.37256 0.11279-0.18799 0.18457-0.44092l0.04102-0.16748 0-6.37109q-0.01367-0.5332-0.02734-0.64258-0.12647-0.54688-0.53321-0.92285-0.40674-0.37939-0.95019-0.46485-0.14014-0.01367-1.82178-0.01367l-1.66455 0 0.97754-0.98096q0.98096-0.99463 1.02197-1.04931 0.07178-0.09912 0.08545-0.2461 0.01367-0.14697-0.04102-0.25634-0.0581-0.15381-0.19824-0.26661-0.14014-0.11279-0.34863-0.11279l-0.02734 0q-0.11279 0-0.19825 0.04102-0.0957 0.07178-0.34863 0.30761l-2.33789 2.32422-1.30225-1.30224q-0.84082-0.82373-1.08691-1.05957-0.24268-0.23926-0.29736-0.27002-0.15381-0.05469-0.33838-0.02735z m7.8955 4.10156q0.21192 0.08545 0.32471 0.29395l0.04102 0.09912 0 6.70606-0.02735 0.08545q-0.12646 0.26318-0.37939 0.33496-0.08203 0.02734-4.82959 0.02734-4.74756 0-4.82959-0.02734-0.25293-0.07178-0.37939-0.33496l-0.02735-0.08545 0-6.70606 0.04102-0.09912q0.04443-0.08203 0.1333-0.16406 0.09229-0.08545 0.16748-0.1128 0.07861-0.03076 0.70752-0.04443l4.18701 0 4.18701 0q0.61523 0 0.68359 0.02734z"/></g>,
    clapperboard: <g transform="scale(1.714)"><path fill={color} stroke="none" d="M9.95313 0.61523q-0.11279 0.01367-0.29395 0.05811l-1.20313 0.3623q-1.23047 0.36572-1.30224 0.37256-0.06836 0.00684-0.18115 0.05469-0.11279 0.04785-2.65577 0.79981-2.53955 0.74854-2.63525 0.78955-0.22559 0.08545-0.4375 0.25976-0.2085 0.17432-0.34863 0.36914-0.19482 0.29395-0.2666 0.63233-0.02734 0.14014-0.02735 0.38623 0 0.24268 0.03418 0.36914 0.0376 0.12646 0.27344 0.78271l0.25293 0.646 0.01367 4.89795 0.04102 0.12646q0.15381 0.4751 0.47509 0.79981 0.32471 0.32129 0.81348 0.46142 0.08545 0.02734 0.71436 0.02735l3.78027 0.01367 3.78027-0.01367q0.62891 0 0.71436-0.02735 0.98096-0.2666 1.28857-1.26123l0.04102-0.12646 0-4.67578q0-0.43408-0.02734-0.48877-0.02734-0.12646-0.12647-0.22217-0.09912-0.09912-0.23926-0.14356-0.04102-0.01367-0.56055-0.02734l-5.97802-0.01367 1.56885-0.46143q1.55518-0.44775 1.64404-0.46142 0.09229-0.01367 0.19824-0.05469 0.10596-0.04443 1.38428-0.41357 1.28174-0.37256 1.36719-0.41358 0.14014-0.07178 0.22216-0.21191 0.08545-0.14014 0.08545-0.29395 0-0.08203-0.04443-0.23584-0.04101-0.15723-0.19482-0.67334l-0.25294-0.7998q-0.05469-0.15381-0.10937-0.26319-0.09912-0.21191-0.29394-0.40673-0.28027-0.29395-0.68018-0.43409-0.3999-0.14014-0.83398-0.08545z m0.50585 1.20313q0.18115 0.09912 0.24952 0.23926 0.04443 0.07178 0.1914 0.55371 0.14697 0.48193 0.14014 0.48877-0.00684 0.00684-0.88867 0.2666-0.88184 0.25977-0.89893 0.25976-0.01367 0-0.46142-0.58789l-0.50245-0.64599q-0.05811-0.06836-0.04443-0.0752 0.01709-0.00684 0.92627-0.27343 0.66992-0.2085 0.80322-0.24268 0.1333-0.0376 0.2461-0.02393 0.15381 0 0.23925 0.04102z m-2.92578 1.50049q0.48877 0.64258 0.49561 0.64941 0.00684 0.00684-1.17578 0.35889-1.18262 0.34863-1.20313 0.34863-0.02051 0-0.51953-0.62207-0.49561-0.62207-0.50244-0.64258-0.00684-0.02393 1.16211-0.37256 1.16895-0.35205 1.20312-0.35888 0.03418-0.00684 0.54004 0.63916z m-3.61279 1.09033q0.48877 0.61523 0.48193 0.62549-0.00684 0.00684-1.14843 0.33496-1.1416 0.32813-1.15528 0.32812l-0.32129-0.85449 0-0.16748q0-0.11279 0.00684-0.15381 0.00684-0.04102 0.03418-0.09912 0.09912-0.18115 0.22559-0.24951 0.08545-0.04443 0.71435-0.23242 0.62891-0.18799 0.64258-0.17432l0.51953 0.64258z m7.7417 4.68945l0 2.11572-0.04102 0.09913q-0.14014 0.27685-0.43408 0.33496-0.09912 0.02734-4.18701 0.02734-4.08789 0-4.18701-0.02734-0.29395-0.05811-0.43408-0.33496l-0.04102-0.09913-0.01367-4.21435 9.35156 0-0.01367 2.09863z"/></g>,
    sofa:     <g transform="scale(1.714)"><path fill={color} stroke="none" d="M3.21973 1.77734q-0.3623 0.05811-0.69385 0.2837-0.32813 0.22217-0.52295 0.52978-0.15381 0.2666-0.21191 0.57422-0.02734 0.12646-0.03418 0.2666-0.00684 0.13672-0.00684 0.62891l0 0.71435-0.11279 0.04102q-0.42041 0.16748-0.70069 0.55371-0.27686 0.38281-0.33496 0.86133-0.02734 0.15381-0.02734 1.64404 0 1.49023 0.02734 1.64404 0.04102 0.42041 0.26319 0.77246 0.22559 0.34863 0.5913 0.55713 0.12646 0.07178 0.2085 0.09912l0.08545 0.02735 0 0.39306q0 0.32129 0.02051 0.42725 0.02051 0.10596 0.09228 0.20166 0.15381 0.22559 0.417 0.24609 0.2666 0.02051 0.46484-0.17431 0.11279-0.11279 0.14697-0.23926 0.03418-0.12646 0.03418-0.46143l0-0.29394 8.14844 0 0 0.30762q0 0.32129 0.03418 0.44775 0.03418 0.12646 0.14697 0.23926 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609 0.07178-0.0957 0.09228-0.20166 0.02051-0.10596 0.02051-0.42725l0-0.39306 0.08545-0.02735q0.08203-0.02734 0.2085-0.09912 0.36572-0.2085 0.58789-0.55713 0.22559-0.35205 0.2666-0.77246 0.02734-0.15381 0.02734-1.64404 0-1.49023-0.02734-1.64404-0.05811-0.47852-0.33838-0.86133-0.27686-0.38623-0.6836-0.55371l-0.12646-0.04102 0-0.71435q0-0.60156-0.02051-0.79639-0.02051-0.19824-0.10596-0.40674-0.18115-0.43408-0.54003-0.72119-0.35547-0.28711-0.8169-0.35889-0.18115-0.02734-3.78027-0.02734-3.59912 0-3.7666 0.02734z m3.20605 3.17871l0 2.04395-2.33789 0-0.01367-0.44775q0-0.29395-0.01367-0.38965-0.01367-0.09912-0.02735-0.18457-0.12646-0.40674-0.37939-0.70069-0.25293-0.29395-0.60156-0.44775l-0.12647-0.05469 0-1.44238 0.05469-0.08545q0.12646-0.23584 0.36572-0.30762 0.04102-0.01367 1.55518-0.01367l1.52441 0 0 2.03027z m4.32715-1.97558q0.18115 0.08545 0.2666 0.2666l0.05469 0.08545 0 1.44238-0.12647 0.05469q-0.3623 0.15381-0.60839 0.44775-0.24609 0.29395-0.37256 0.70069-0.01367 0.08545-0.02735 0.18457-0.01367 0.0957-0.01367 0.38965l0 0.44775-2.35156 0 0-4.07422 3.09326 0 0.08545 0.05469z m-8.14844 2.9292q0.16748 0.08203 0.2666 0.27685l0.04102 0.09912 0.01367 1.23389 0.07178 0.14014q0.05469 0.12305 0.17432 0.24267 0.11963 0.11963 0.229 0.17432l0.01367 0.01367q0.09912 0.04443 0.23926 0.05811 0.18115 0.01367 0.81348 0.01367l5.06542 0q0.63232 0 0.81348-0.01367 0.14014-0.01367 0.23926-0.05811l0.01367-0.01367q0.10938-0.05469 0.22901-0.17432 0.11963-0.11963 0.17431-0.24267l0.07178-0.14014 0.01367-1.23389 0.04102-0.09912q0.08545-0.16748 0.21875-0.25634 0.1333-0.09229 0.30078-0.09229 0.22217 0 0.34863 0.11279 0.08545 0.05469 0.11963 0.09912 0.03418 0.04102 0.07861 0.12305l0.04102 0.09912 0 3.20606-0.04102 0.09912q-0.04443 0.08203-0.11621 0.16064-0.06836 0.0752-0.14013 0.1128-0.06836 0.03418-0.19483 0.05468-0.12305 0.02051-4.74414 0.02051-4.62109 0-4.74756-0.02051-0.12305-0.02051-0.19482-0.05468-0.06836-0.0376-0.14014-0.1128-0.06836-0.07861-0.11279-0.16064l-0.04102-0.09912 0-3.20606 0.04102-0.09912q0.05811-0.12646 0.17431-0.21533 0.11963-0.09229 0.25977-0.10596 0.19824-0.02734 0.36572 0.05811z"/></g>,
  };
  return <svg {...p}>{paths[name]}</svg>;
}

// ─── IconBadge ──────────────────────────────────────────────────────
// Circular tonal icon badge: soft radial glow + ring + icon, in the
// "system icon" style — one accent hue, glass-tinted, gradient glow.
function IconBadge({ icon, size = 40, tone = '#FD8973', style = {} }) {
  const rgba = (a) => {
    if (typeof tone === 'string' && tone[0] === '#' && tone.length === 7) {
      const r = parseInt(tone.slice(1,3),16), g = parseInt(tone.slice(3,5),16), b = parseInt(tone.slice(5,7),16);
      return `rgba(${r},${g},${b},${a})`;
    }
    return tone;
  };
  const iconSize = Math.round(size * 0.42);
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0, ...style }}>
      <div style={{
        position:'absolute', inset:0, borderRadius:'50%',
        background:`radial-gradient(circle at 32% 26%, ${rgba(0.22)}, ${rgba(0.03)} 68%, transparent 100%)`,
      }}/>
      <div style={{
        position:'absolute', inset:0, borderRadius:'50%',
        border:`1px solid ${rgba(0.55)}`,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon name={icon} size={iconSize} color={tone} stroke={2.2}/>
      </div>
    </div>
  );
}

// ─── Poster ─────────────────────────────────────────────────────────
// Each movie gets a curated abstract poster from its bg/fg palette + an art ID.
function Poster({ movie, size = 'lg', className = '', style = {}, hideTitle = false }) {
  if (!movie) return null;
  // hash id -> art style 0..3
  const art = (parseInt(String(movie.id || '').replace(/\D/g, ''), 10) || 0) % 4;
  const realPoster = !!movie.posterUrl;
  const dims = size === 'lg' ? { w: '100%', h: '100%' }
             : size === 'md' ? { w: 120, h: 180 }
             : size === 'sm' ? { w: 64,  h: 96  }
             : { w: 44, h: 66 };
  const small = size === 'sm' || size === 'xs';
  const titleSize = size === 'lg' ? 56 : size === 'md' ? 22 : size === 'sm' ? 13 : 10;
  const meta = size === 'lg' ? 11 : 9;

  return (
    <div className={`poster ${className}`} style={{
      width: dims.w, height: dims.h, aspectRatio: '2/3',
      background: movie.bg || '#13181B', color: movie.fg || '#F0EEEB', ...style,
    }}>
      {realPoster ? (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block'}}
          onError={(e)=>{ e.currentTarget.style.display='none'; }}
        />
      ) : (
        <PosterArt art={art} fg={movie.fg || '#F0EEEB'} bg={movie.bg || '#13181B'} small={small} />
      )}

      {/* grain */}
      <div style={{
        position:'absolute', inset:0, mixBlendMode:'overlay', opacity: small ? 0.2 : (realPoster ? 0.25 : 0.55),
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='u%72l(%23n)' opacity='0.7'/%3E%3C/svg%3E")`,
      }}/>

      {/* top meta — abstract posters only */}
      {!small && !realPoster && (
        <div style={{
          position:'absolute', top: size==='lg'? 22:14, left: size==='lg'? 24:14, right: size==='lg'? 24:14,
          display:'flex', justifyContent:'space-between', alignItems:'baseline',
          fontFamily:'var(--sans)', fontSize: meta, letterSpacing:'0.18em', textTransform:'uppercase',
          opacity: 0.7,
        }}>
          <span>{movie.year}</span>
          <span>{genreLabel(movie.genres?.[0])}</span>
        </div>
      )}

      {/* title — abstract posters get a serif title; real posters skip it */}
      {!hideTitle && !realPoster && (
        <div style={{
          position:'absolute', left: small? 8: (size==='lg'? 26:16), right: small? 8: (size==='lg'? 26:16),
          bottom: small? 8 : (size==='lg'? 32 : 18),
          fontFamily:'var(--serif)', fontWeight: 400,
          fontSize: titleSize, lineHeight: 0.92, letterSpacing: '-0.01em',
        }}>
          {movie.title}
        </div>
      )}
    </div>
  );
}

// poster art styles — each is an abstract editorial element
function PosterArt({ art, fg, bg, small }) {
  const op = small ? 0.18 : 0.22;
  const s = { position:'absolute', inset:0 };
  if (art === 0) {
    // big circle (sun/moon)
    return (
      <div style={s}>
        <div style={{
          position:'absolute', left:'50%', top:'38%', transform:'translate(-50%,-50%)',
          width:'62%', aspectRatio:'1', borderRadius:'50%',
          background: fg, opacity: op,
        }}/>
      </div>
    );
  }
  if (art === 1) {
    // horizon line + tiny dot
    return (
      <div style={s}>
        <div style={{position:'absolute', left:0, right:0, top:'55%', height:0.6, background: fg, opacity: op*1.5}}/>
        <div style={{position:'absolute', left:'18%', top:'40%', width:'10%', aspectRatio:'1', borderRadius:'50%', background: fg, opacity: op*1.8}}/>
      </div>
    );
  }
  if (art === 2) {
    // vertical stripes
    return (
      <div style={{...s, display:'flex', gap:'2.5%', padding:'0 14%'}}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{flex:1, background: fg, opacity: op*(0.5 + i*0.15), marginTop:'18%', marginBottom: '38%'}}/>
        ))}
      </div>
    );
  }
  // art === 3 — concentric rings
  return (
    <div style={s}>
      {[0.85,0.6,0.35].map((r,i)=>(
        <div key={i} style={{
          position:'absolute', left:'50%', top:'42%', transform:'translate(-50%,-50%)',
          width: `${r*70}%`, aspectRatio:'1', borderRadius:'50%',
          border: `${small? 0.6:1.2}px solid ${fg}`, opacity: op*1.6,
        }}/>
      ))}
    </div>
  );
}

// ─── Avatar ─────────────────────────────────────────────────────────
// Glass-gradient profile pictures live in assets/Profiles. Each person
// gets a stable one (by id hash) unless a specific `photo` is provided.
// ─── Avatar pool — colourful gradient images (assets/Profiles) ──────
const AVATAR_POOL = Array.from({ length: 11 }, (_, i) => `assets/Profiles/avatar-${i + 1}.png`);
window.AVATAR_POOL = AVATAR_POOL;
function pickAvatar(person) {
  const key = String(person.id || person.initials || person.name || '');
  let h = 0;
  for (let i = 0; i < key.length; i++) h = ((h << 5) - h + key.charCodeAt(i)) | 0;
  return AVATAR_POOL[Math.abs(h) % AVATAR_POOL.length];
}

function Avatar({ person, size = 44, ring = false, ringColor = '#FD8973' }) {
  if (!person) return null;
  const photo = person.photo || (person.noPhoto ? null : pickAvatar(person));
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: person.tone || '#6F93E0',
      backgroundImage: photo ? `url("${photo}")` : 'none',
      backgroundSize: 'cover', backgroundPosition: 'center',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:'var(--sans)', fontWeight:700, color: photo ? 'rgba(20,24,36,0.72)' : 'var(--ink)',
      fontSize: size * 0.36, letterSpacing:'-0.02em', flexShrink:0,
      boxShadow: ring ? `0 0 0 2px ${ringColor}, 0 0 0 4.5px var(--ink)` : 'none',
      position:'relative',
    }}>
      {person.initials}
      {person.online && (
        <span title="Active now" style={{
          position:'absolute', right: -1, bottom: 1,
          width: size*0.26, height: size*0.26, borderRadius:'50%',
          /* the app's positive tone reads as "active now" (palette has no green) */
          background:'var(--green)', border:'2px solid var(--ink)',
          boxShadow:'0 0 6px rgba(143,180,230,0.6)',
        }}/>
      )}
    </div>
  );
}

// ─── Service chip ───────────────────────────────────────────────────
// Maps a service name to a logo file slug in assets/logos/.
// Drop real logos there (e.g. assets/logos/netflix.svg) and they render
// automatically; until then it falls back to the tinted letter mark.
const SERVICE_SLUGS = {
  'Netflix':   'netflix',
  'Prime':     'prime-video',
  'Hulu':      'hulu',
  'Max':       'max',
  'Apple TV+': 'apple-tv',
  'Disney+':   'disney-plus',
  'MUBI':      'mubi',
  'Viu':       'viu',
  'iQIYI':     'iqiyi',
  'WeTV':      'wetv',
};

function ServiceChip({ name, size = 22 }) {
  const s = window.SERVICES[name] || { color:'#333', short: name[0] };
  const slug = SERVICE_SLUGS[name] || name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  // try svg → png → tinted-letter fallback
  const [stage, setStage] = React.useState('svg');
  const src = stage === 'svg' ? `assets/logos/${slug}.svg`
            : stage === 'png' ? `assets/logos/${slug}.png`
            : null;

  if (src) {
    // App-icon style: square 1:1 logo filling a rounded tile
    return (
      <div title={name} style={{
        width: size, height: size, borderRadius: Math.round(size * 0.26),
        overflow:'hidden', flexShrink: 0,
        boxShadow:'inset 0 0 0 0.5px rgba(var(--fg-rgb),0.16)',
      }}>
        <img
          src={src}
          alt={name}
          onError={()=> setStage(stage === 'svg' ? 'png' : 'fallback')}
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
        />
      </div>
    );
  }

  // fallback — tinted letter mark (used until a logo file exists)
  return (
    <div title={name} style={{
      width: size, height: size, borderRadius: 6,
      background: s.color, color:'#fff',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:'var(--sans)', fontSize: size*0.42, fontWeight:700, letterSpacing:'-0.02em',
      boxShadow:'inset 0 0 0 0.5px rgba(255,255,255,0.15)',
    }}>{s.short}</div>
  );
}

// ─── Tab bar (bottom nav) ───────────────────────────────────────────
function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'rooms',   icon: 'sofa',  label: window.tr ? tr('nav.rooms','Rooms') : 'Rooms' },
    { id: 'swipe',   icon: 'cards', label: 'MatchDoo', center: true },
    { id: 'profile', icon: 'user',  label: window.tr ? tr('nav.profile','Profile') : 'Profile' },
  ];
  const ACCENT = '#FD8973';

  const renderTab = (t) => {
    const on = active === t.id;
    // Center brand tab — a prominent circular logo icon (no text)
    if (t.center) {
      return (
        <button key={t.id} onClick={()=>onChange(t.id)} aria-label={t.label} style={{
          appearance:'none', cursor:'pointer', padding: 0, flexShrink: 0,
          width: 56, height: 56, borderRadius: '50%',
          border: '2px solid rgba(240,238,235,0.92)',
          backgroundImage: 'url("assets/logo-app.png?v=191")',
          backgroundSize: '116%', backgroundPosition: 'center 47%',
          backgroundRepeat: 'no-repeat', backgroundColor: '#13181B',
          boxShadow: on
            ? '0 6px 24px rgba(253,137,115,0.55), 0 0 0 3px rgba(253,137,115,0.45)'
            : '0 4px 16px rgba(0,0,0,0.40)',
          transform: on ? 'translateY(-2px) scale(1.05)' : 'scale(1)',
          transition: 'transform .28s cubic-bezier(.4,0,.2,1), box-shadow .28s ease',
        }}/>
      );
    }
    // Side tabs — always icon + text; active vs inactive shown by colour
    const col = on ? ACCENT : 'rgba(240,238,235,0.5)';
    return (
      <button key={t.id} onClick={()=>onChange(t.id)} aria-label={t.label} style={{
        appearance:'none', border:0, cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
        gap: 7, height: 46,
        padding: '0 16px', borderRadius: 999,
        background: on ? 'rgba(253,137,115,0.16)' : 'transparent',
        overflow:'hidden', flexShrink: 0, maxWidth:'100%',
        transition: 'background .3s cubic-bezier(.4,0,.2,1)',
      }}>
        <Icon name={t.icon} size={27} stroke={on ? 2.1 : 1.8} color={col}/>
        <span style={{
          whiteSpace:'nowrap',
          fontFamily:'var(--sans)', fontWeight: on ? 700 : 600, fontSize: 13, letterSpacing:'-0.01em',
          color: col,
          transition: 'color .3s ease',
        }}>{t.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* mood-tone scrim behind the bar so it reads over any content */}
      <div aria-hidden="true" style={{
        position:'absolute', left: 0, right: 0, bottom: 0, height: 160, zIndex: 39,
        pointerEvents:'none',
        background:'linear-gradient(180deg, transparent 0%, rgba(var(--bg-rgb),0.5) 42%, rgba(var(--bg-rgb),0.94) 100%)',
      }}/>
      <div data-coach="nav" style={{
        // Below the modal/sheet layer (sheets are zIndex 200) so a bottom sheet
        // covers the tab bar instead of the bar bleeding over the sheet's content;
        // still above regular screen content and the swipe deck.
        position:'absolute', left: 14, right: 14, bottom: 12, zIndex: 150,
        display:'flex', alignItems:'center',
        padding: '10px 12px',
        // dark glass + a diagonal mood gradient tint — stays a dark bar in
        // both themes, so icons/rim are kept fixed-light.
        background:'linear-gradient(135deg, rgba(253,137,115,0.20) 0%, rgba(253,137,115,0.16) 55%, rgba(19,24,27,0.30) 100%), rgba(15,20,26,0.78)',
        backdropFilter:'blur(30px) saturate(180%)',
        WebkitBackdropFilter:'blur(30px) saturate(180%)',
        borderRadius: 'var(--r-xl)',
        border:'0.5px solid rgba(240,238,235,0.16)',
        boxShadow:'0 16px 46px rgba(0,0,0,0.55), inset 0 0.5px 0 rgba(240,238,235,0.14)',
      }}>
        {/* Equal-width side rails keep the centre logo locked dead-centre
            no matter which side tab expands. */}
        <div style={{flex:1, minWidth:0, display:'flex', justifyContent:'flex-start'}}>{renderTab(tabs[0])}</div>
        {renderTab(tabs[1])}
        <div style={{flex:1, minWidth:0, display:'flex', justifyContent:'flex-end'}}>{renderTab(tabs[2])}</div>
      </div>
    </>
  );
}

// ─── Generic top bar with title + optional back ─────────────────────
function TopBar({ title, onBack, right, subtitle, large=false }) {
  return (
    <div style={{
      padding: '14px 18px 8px',
      display:'flex', alignItems:'center', justifyContent:'space-between', gap: 8,
    }}>
      <div style={{display:'flex', alignItems:'center', gap: 10, minWidth:0, flex:1}}>
        {onBack && (
          <button onClick={onBack} style={{
            appearance:'none', border:0, background:'rgba(var(--fg-rgb),0.09)',
            width: 36, height: 36, borderRadius: 999,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'var(--cream)', flexShrink:0,
          }}>
            <Icon name="chevl" size={18} />
          </button>
        )}
        <div style={{minWidth:0}}>
          <div style={{
            fontFamily: large ? 'var(--serif)' : 'var(--sans)',
            fontSize: large ? 30 : 18,
            fontWeight: large ? 400 : 500,
            letterSpacing: large ? '-0.01em' : '-0.01em',
            lineHeight: 1.1,
            color:'var(--cream)',
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
          }}>{title}</div>
          {subtitle && (
            <div style={{
              fontSize:12, color:'var(--muted)', marginTop: 2,
            }}>{subtitle}</div>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}

// ─── Primary button ─────────────────────────────────────────────────
function PrimaryBtn({ children, onClick, full=false, secondary=false, disabled=false, style={} }) {
  return (
    <button onClick={disabled? undefined : onClick} className={disabled ? undefined : 'press'} style={{
      appearance:'none', border:0,
      background: secondary ? 'rgba(var(--fg-rgb),0.08)' : 'var(--cream)',
      color: secondary ? 'var(--cream)' : 'var(--ink)',
      padding:'14px 22px', borderRadius: 999,
      fontFamily:'var(--sans)', fontWeight: 500, fontSize: 15, letterSpacing:'0.01em',
      width: full? '100%' : 'auto',
      opacity: disabled? 0.4 : 1,
      transition: 'transform .12s ease, opacity .18s ease',
      ...style,
    }}>{children}</button>
  );
}

Object.assign(window, { Icon, IconBadge, Poster, PosterArt, Avatar, ServiceChip, TabBar, TopBar, PrimaryBtn });
