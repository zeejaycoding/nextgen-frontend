// Product catalogue (front-end demo data, mirrored from the reference site).
// Screenshots are stored locally in public/images. ProductImage also renders a
// branded fallback if an image is ever missing.

export const products = [
  {
    id: 24,
    slug: 'bo2-revolution',
    title: 'BO2 Revolution',
    game: 'Black Ops II',
    category: 'Mod',
    price: 19.99,
    image: '/images/revolution0.png',
    images: ['/images/revolution0.png'],
    contact: 'DOMIGEN Team',
    published: '2016-02-01',
    badge: 'Bestseller',
    featured: true,
    version: '2.4',
    description:
      'A full revolution for Black Ops II: new maps, new weapons and a completely reworked experience.',
    features: ['New maps and weapon sets', 'Reworked menus and HUD', 'Quality-of-life fixes'],
  },
  {
    id: 33,
    slug: 'mw3-phantom',
    title: 'MW3 Phantom',
    game: 'Modern Warfare 3',
    category: 'Mod',
    price: 19.99,
    image: '/images/phantom0.png',
    images: ['/images/phantom0.png'],
    contact: 'DOMIGEN Team',
    published: '2016-03-30',
    badge: 'Bestseller',
    featured: true,
    version: '2.22',
    video: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    description:
      'Step into the shadows with Phantom. Stealth-focused gameplay, new menus and exclusive content for Modern Warfare 3.',
    features: [
      'Host menu: aimbot, givable menu, advanced noclip, forge mode and menu scripting',
      'Non-host menu: radar, no recoil, ESP, autoshoot, autowall and name changing',
      'Pregame menu: name modification, console commands and theme selector',
    ],
  },
  {
    id: 18,
    slug: 'mw3-project-memories',
    title: 'MW3 Project Memories',
    game: 'Modern Warfare 3',
    category: 'Mod',
    price: 14.99,
    image: '/images/memories0.png',
    images: ['/images/memories0.png'],
    contact: 'DOMIGEN Team',
    published: '2016-01-01',
    badge: 'Bestseller',
    featured: true,
    version: '1.8',
    description:
      'A nostalgic rebuild of the classic MW3 experience, packed with community favourites.',
    features: ['Classic map line-up', 'Community favourite settings', 'Clean modern interface'],
  },
  {
    id: 39,
    slug: 'bo3-fatality',
    title: 'BO3 Fatality',
    game: 'Black Ops III',
    category: 'Mod',
    price: 19.99,
    image: '/images/fatality0.png',
    images: ['/images/fatality0.png'],
    contact: 'DOMIGEN Team',
    published: '2017-09-18',
    badge: 'New',
    latest: true,
    version: '1.2',
    description:
      'Our latest Black Ops III release: refined menus, custom gametypes and a brutal new look.',
  },
  {
    id: 37,
    slug: 'bo2-destiny',
    title: 'BO2 Destiny',
    game: 'Black Ops II',
    category: 'Mod',
    price: 19.99,
    image: '/images/destiny0.png',
    images: ['/images/destiny0.png'],
    contact: 'DOMIGEN Team',
    published: '2017-03-12',
    latest: true,
    version: '1.5',
    description: 'A sci-fi themed transformation for BO2 with exotic weapons and futuristic maps.',
  },
  {
    id: 35,
    slug: 'aw-fury',
    title: 'AW Fury',
    game: 'Advanced Warfare',
    category: 'Mod',
    price: 19.99,
    image: '/images/fury0.png',
    images: ['/images/fury0.png'],
    contact: 'DOMIGEN Team',
    published: '2016-07-04',
    latest: true,
    version: '3.1',
    description: 'Unleash fury in Advanced Warfare with boosted movement and a fully custom HUD.',
  },
  {
    id: 34,
    slug: 'ghosts-eternity',
    title: 'GHOSTS Eternity',
    game: 'Ghosts',
    category: 'Mod',
    price: 19.99,
    image: '/images/eternity0.png',
    images: ['/images/eternity0.png'],
    contact: 'DOMIGEN Team',
    published: '2016-03-30',
    version: '1.0',
    description: 'The ultimate Ghosts mod: extended maps, new modes and a clean, modern interface.',
  },
  {
    id: 30,
    slug: 'bo1-fusion',
    title: 'BO1 Fusion',
    game: 'Black Ops I',
    category: 'Mod',
    price: 19.99,
    image: '/images/fusion0.png',
    images: ['/images/fusion0.png'],
    contact: 'DOMIGEN Team',
    published: '2016-03-01',
    version: '2.0',
    description: 'Classic Black Ops fused with modern features. A fan-favourite community release.',
  },
  {
    id: 20,
    slug: 'control-console-api',
    title: 'Control Console API 2.80r14 — RTE CEX + DEX',
    game: 'PS3 Tool',
    category: 'Tool',
    price: 0,
    image: '/images/ccapi0.png',
    images: ['/images/ccapi0.png'],
    contact: 'DOMIGEN Team',
    published: '2013-11-11',
    badge: 'Free',
    version: '2.80r14',
    description: 'A free control console API for RTE CEX + DEX. Built for developers and modders.',
  },
  {
    id: 19,
    slug: 'mw2-reborn',
    title: 'MW2 Reborn',
    game: 'Modern Warfare 2',
    category: 'Mod',
    price: 14.99,
    image: '/images/reborn0.png',
    images: ['/images/reborn0.png'],
    contact: 'DOMIGEN Team',
    published: '2016-01-01',
    version: '1.3',
    description:
      'Modern Warfare 2 is reborn with restored maps, scrapped content and quality-of-life fixes.',
  },
]

export const mostSold = products.filter((p) => p.featured)
export const latestApps = products.filter((p) => p.latest)

export function formatPrice(price) {
  return price === 0 ? 'FREE' : `$${Number(price).toFixed(2)}`
}

export function formatDate(value) {
  if (!value) return '—'
  const [year, month, day] = value.split('-')
  const monthName = new Date(year, month - 1, day).toLocaleString('en', {
    month: 'short',
  })
  return `${monthName} ${day}, ${year}`
}

/** Main image plus three screenshots for any product. */
export function galleryFor(product) {
  const own = (product.images?.length ? product.images : [product.image]).filter(Boolean)
  const pool = products
    .map((item) => item.image)
    .filter((src) => src && !own.includes(src))
  if (!pool.length) return own

  const start = product.id % pool.length
  const extras = [0, 1, 2].map((offset) => pool[(start + offset) % pool.length])
  return [...own, ...extras].filter(Boolean)
}

export function youtubeEmbed(value) {
  if (!value) return null
  const input = String(value).trim()
  const watch = input.match(/[?&]v=([^&#]+)/)
  const short = input.match(/youtu\.be\/([^?&#]+)/)
  const embed = input.match(/\/embed\/([^?&#]+)/)
  const id = watch?.[1] || short?.[1] || embed?.[1] || (/^[a-zA-Z0-9_-]{11}$/.test(input) ? input : '')
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}
