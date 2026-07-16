const ICONS = {
  headphones: `<svg viewBox="0 0 48 48" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 26v-2a18 18 0 0 1 36 0v2"/><rect x="4" y="24" width="10" height="16" rx="4"/><rect x="34" y="24" width="10" height="16" rx="4"/></svg>`,
  watch: `<svg viewBox="0 0 48 48" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="14" width="20" height="20" rx="5"/><path d="M18 14V7h12v7M18 34v7h12v-7"/><path d="M24 20v5l3 3"/></svg>`,
  camera: `<svg viewBox="0 0 48 48" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="14" width="38" height="26" rx="5"/><circle cx="24" cy="27" r="8"/><path d="M17 14l3-6h8l3 6"/></svg>`,
  laptop: `<svg viewBox="0 0 48 48" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="30" height="20" rx="2"/><path d="M4 39h40l-4-8H8z"/></svg>`,
  phone: `<svg viewBox="0 0 48 48" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="5" width="20" height="38" rx="4"/><path d="M21 38h6"/></svg>`,
  gamepad: `<svg viewBox="0 0 48 48" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16h20a9 9 0 0 1 9 11.5l-1 3.4a5 5 0 0 1-9 1.4l-2.6-4.3H17.6L15 32.3a5 5 0 0 1-9 -1.4l-1-3.4A9 9 0 0 1 14 16z"/><path d="M12 24h6M15 21v6"/><circle cx="32" cy="22" r="1.6"/><circle cx="36" cy="26" r="1.6"/></svg>`,
  backpack: `<svg viewBox="0 0 48 48" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 20V13a10 10 0 0 1 20 0v7"/><path d="M10 20h28l2 22H8z"/><path d="M18 20v8h12v-8"/></svg>`,
  buds: `<svg viewBox="0 0 48 48" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20v10a6 6 0 0 0 12 0"/><rect x="12" y="14" width="8" height="12" rx="4"/><rect x="28" y="14" width="8" height="12" rx="4"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7.2-4.5-9.6-9C.7 7.4 3 3.5 7 3.5c2.4 0 4 1.4 5 3 1-1.6 2.6-3 5-3 4 0 6.3 3.9 4.6 7.5-2.4 4.5-9.6 9-9.6 9z"/></svg>`,
  cart: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1.4"/><circle cx="18" cy="21" r="1.4"/><path d="M1.5 2h2.4l2.6 12.6a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L21.5 6H5.3"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  star: `<svg viewBox="0 0 24 24"><path d="M12 2.5l3 6.4 6.9.9-5 4.9 1.3 6.9L12 18l-6.2 3.6L7 14.7l-5-4.9 6.9-.9z"/></svg>`,
  chevronUp: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15l7-7 7 7"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19v2.4M21.5 12h-2.4M4.9 12H2.5M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7M18.4 18.4l-1.7-1.7M7.3 7.3 5.6 5.6"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3.2"/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.2A11 11 0 0 1 12 5c7 0 10.5 7 10.5 7a13.6 13.6 0 0 1-3.2 4.1M6.5 6.6C3.4 8.6 1.5 12 1.5 12s3.5 7 10.5 7a10.6 10.6 0 0 0 3.6-.6"/><path d="M9.5 9.7a3.2 3.2 0 0 0 4.6 4.5"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M3 6.5L12 13l9-6.5"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/></svg>`,
  phoneCall: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2a1.4 1.4 0 0 1 1.4-.3c1.2.4 2.5.6 3.8.6a1.4 1.4 0 0 1 1.4 1.4V21a1.4 1.4 0 0 1-1.4 1.4C10.8 22.4 1.6 13.2 1.6 3.4A1.4 1.4 0 0 1 3 2h4.1a1.4 1.4 0 0 1 1.4 1.4c0 1.3.2 2.6.6 3.8a1.4 1.4 0 0 1-.3 1.4z"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>`,
  social_x: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 3H21l-6.7 7.7L22.2 21h-6.6l-5.2-6.6L4.4 21H2.3l7.2-8.2L2.1 3h6.7l4.7 6.1L18.9 3zm-1.1 16.1h1.8L7.3 4.8H5.4l12.4 14.3z"/></svg>`,
  social_ig: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1"/></svg>`,
  social_yt: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none"/></svg>`,
  social_gh: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.8-2.4 4.6-4.6 4.9.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>`
};

// Product catalogue — invented brand, invented specs, for demonstration only.
const PRODUCTS = [
  {
    id: 'p1', name: 'Pulse X Wireless Headset', cat: 'Headphones', icon: ICONS.headphones,
    price: 249, oldPrice: 299, rating: 4.8, reviews: 312, badge: 'New',
    specs: 'ANC · 42H BATT · BT 5.3',
    desc: 'Closed-back wireless gaming headset with adaptive noise cancellation, a 42-hour battery, and a detachable broadcast mic tuned for clarity in fast-paced play.'
  },
  {
    id: 'p2', name: 'Orbit Watch S3', cat: 'Smart Watches', icon: ICONS.watch,
    price: 399, oldPrice: null, rating: 4.6, reviews: 204, badge: null,
    specs: 'AMOLED · 6D BATT · 5ATM',
    desc: 'A titanium-cased smartwatch with an always-on AMOLED face, six-day battery life, and dive-rated water resistance for training in any condition.'
  },
  {
    id: 'p3', name: 'Aether Book Pro 14', cat: 'Laptops', icon: ICONS.laptop,
    price: 1899, oldPrice: 2099, rating: 4.9, reviews: 158, badge: 'Best Seller',
    specs: 'M-CLASS · 32GB · 14" 120HZ',
    desc: 'A featherweight 14-inch workstation with a 120Hz mini-LED display, all-day battery life, and enough headroom for demanding creative and dev workloads.'
  },
  {
    id: 'p4', name: 'Flux Phone 12', cat: 'Smartphones', icon: ICONS.phone,
    price: 999, oldPrice: null, rating: 4.7, reviews: 441, badge: null,
    specs: '6.7" · 256GB · 5G',
    desc: 'A flagship handset with a titanium frame, a triple-lens computational camera system, and all-day 5G performance in a remarkably compact body.'
  },
  {
    id: 'p5', name: 'Halo Cam Z Mirrorless', cat: 'Cameras', icon: ICONS.camera,
    price: 1299, oldPrice: null, rating: 4.5, reviews: 96, badge: null,
    specs: '33MP · 8K30 · IBIS',
    desc: 'A full-frame mirrorless body with in-body stabilization, 8K video, and a weather-sealed shell built for both studio and expedition work.'
  },
  {
    id: 'p6', name: 'Vortex Controller GX', cat: 'Gaming', icon: ICONS.gamepad,
    price: 89, oldPrice: 119, rating: 4.7, reviews: 527, badge: 'Sale',
    specs: 'HALL FX · 30H BATT · RGB',
    desc: 'A pro-grade controller with Hall-effect sticks that never drift, swappable back paddles, and a 30-hour battery for marathon sessions.'
  },
  {
    id: 'p7', name: 'Prism Buds Air', cat: 'Accessories', icon: ICONS.buds,
    price: 179, oldPrice: null, rating: 4.4, reviews: 268, badge: null,
    specs: 'ANC · IPX4 · 28H CASE',
    desc: 'True wireless earbuds with adaptive transparency mode, a compact charging case, and a full day of playback between charges.'
  },
  {
    id: 'p8', name: 'Nomad Tech Backpack', cat: 'Accessories', icon: ICONS.backpack,
    price: 129, oldPrice: 159, rating: 4.6, reviews: 137, badge: 'Sale',
    specs: '24L · RFID · USB-C PORT',
    desc: 'A weatherproof 24-litre carry built around a padded laptop bay, RFID-safe pockets, and a pass-through USB-C charging port.'
  }
];

// Category taxonomy — the "SYS_xx" tag is a HUD-style module id, not a step order.
const CATEGORIES = [
  { id: 'Gaming', label: 'Gaming', tag: 'SYS_01', icon: ICONS.gamepad, count: 46 },
  { id: 'Smartphones', label: 'Smartphones', tag: 'SYS_02', icon: ICONS.phone, count: 32 },
  { id: 'Laptops', label: 'Laptops', tag: 'SYS_03', icon: ICONS.laptop, count: 28 },
  { id: 'Headphones', label: 'Headphones', tag: 'SYS_04', icon: ICONS.headphones, count: 54 },
  { id: 'Smart Watches', label: 'Smart Watches', tag: 'SYS_05', icon: ICONS.watch, count: 21 },
  { id: 'Cameras', label: 'Cameras', tag: 'SYS_06', icon: ICONS.camera, count: 19 },
  { id: 'Accessories', label: 'Accessories', tag: 'SYS_07', icon: ICONS.backpack, count: 63 }
];

const TESTIMONIALS = [
  { name: 'Maya Okafor', role: 'Content Creator', initials: 'MO', rating: 5, quote: "The Aether Book handles my entire edit pipeline without a single fan spin-up. It's the first laptop that's kept up with my workflow instead of the other way around." },
  { name: 'Devon Ruiz', role: 'Competitive Gamer', initials: 'DR', rating: 5, quote: "Switched to the Vortex controller before playoffs and haven't looked back — zero drift after months of daily play, and the paddles genuinely changed my reaction time." },
  { name: 'Priya Nathan', role: 'Travel Photographer', initials: 'PN', rating: 4, quote: 'Halo Cam Z survived a sandstorm in Namibia and a monsoon in Kerala in the same year. Image quality held up in both, and the stabilization saved a lot of shots handheld.' }
];
