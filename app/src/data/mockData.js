export const PROVIDERS = [
  {
    id: 'p1',
    name: 'Marcus Chen',
    skill: 'Master Electrician • 12 years exp.',
    rating: 4.9,
    distance: '1.2km away • Downtown',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    availability: 'Online',
    bio: 'Certified master electrician with 12 years of experience. Quick response and guaranteed quality.',
    skills: ['Wiring', 'AC Repair', 'Generator Maintenance', 'Plumbing'],
    tags: ['TOP RATED', 'VERIFIED'],
    reviews: [
      { id: 'r1', user: 'Sarah J.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', rating: 5, timeAgo: '2 days ago', comment: '"Marcus was incredibly professional. Fixed our electrical issue within 30 minutes. Highly recommend!"' },
      { id: 'r2', user: 'Marc L.', avatar: 'https://randomuser.me/api/portraits/men/46.jpg', rating: 4, timeAgo: '1 week ago', comment: '"Excellent work on the rewiring of our kitchen. Very thorough."' },
    ]
  },
  {
    id: 'p2',
    name: 'Sarah Jenkins',
    skill: 'Plumbing Specialist • Certified',
    rating: 4.8,
    distance: '2.5km away • West End',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    availability: 'Online',
    bio: 'Certified plumbing specialist. Expert in leak detection, pipe installation and bathroom fixtures.',
    skills: ['Leak Repair', 'Pipe Installation', 'Wiring', 'Painting'],
    tags: ['QUICK RESPONSE'],
    reviews: []
  },
  {
    id: 'p3',
    name: 'David Wilson',
    skill: 'General Contractor • HVAC',
    rating: 4.5,
    distance: '4.1km away • North Side',
    image: 'https://randomuser.me/api/portraits/men/34.jpg',
    availability: 'Offline',
    bio: 'General contractor specializing in HVAC systems and home renovations.',
    skills: ['Plumbing', 'Electrical', 'Masonry', 'Painting'],
    tags: [],
    reviews: []
  },
  {
    id: 'p4',
    name: 'Robert Moore',
    skill: 'Carpentry & Cabinetry',
    rating: 5.0,
    distance: '5.8km away • East Gate',
    image: 'https://randomuser.me/api/portraits/men/35.jpg',
    availability: 'Online',
    bio: 'Master carpenter with 15 years of experience in fine cabinetry and custom woodwork.',
    skills: ['Plumbing', 'Electrical', 'Masonry', 'Painting'],
    tags: ['TOP RATED'],
    reviews: []
  },
];

export const INITIAL_JOBS = [
  {
    id: 'j1234',
    title: 'Fixing Light',
    description: 'The main light in my living room is flickering and needs replacement.',
    category: 'Electrical',
    location: "123 Rue de l'Avenir, Yaoundé",
    budget: '5000 XAF',
    scheduledTime: 'Today • 14:00 - 16:00',
    cost: '€45.00',
    status: 'In Progress',
    createdAt: new Date().toISOString(),
    provider: {
      name: 'Marc Dupont', rating: 4.9, reviews: 124,
      image: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
  }
];

export const INITIAL_MESSAGES = [
  { id: 'm1', senderId: 'p1', receiverId: 'u1', text: "Hello! I'm about 15 minutes away. Is parking available?", timestamp: new Date().toISOString() },
  { id: 'm2', senderId: 'u1', receiverId: 'p1', text: "Yes! I've cleared the driveway for you.", timestamp: new Date().toISOString() },
];

export const WALLET_PACKAGES = [
  { id: 'w1', coins: 1, price: '500 FCFA', label: null, popular: false },
  { id: 'w2', coins: 5, price: '2,250 FCFA', label: 'MOST POPULAR', popular: true },
  { id: 'w3', coins: 10, price: '4,000 FCFA', label: 'BEST VALUE', dark: true },
];
