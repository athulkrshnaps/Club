export const heroImage =
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1800&q=85';

export const moduleCards = [
  {
    title: 'Library Management',
    description: 'Catalog search, reservations, borrow history, and admin book controls.',
    path: '/library',
    accent: 'from-teal-600 to-emerald-500',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Sports & Events',
    description: 'Tournament schedules, community events, registrations, and galleries.',
    path: '/sports-events',
    accent: 'from-sky-600 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Charity & Medical Support',
    description: 'Medical equipment requests, availability tracking, and emergency support.',
    path: '/charity-medical',
    accent: 'from-rose-600 to-amber-500',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80'
  }
];

export const homeStats = [
  { label: 'Active members', value: '420+' },
  { label: 'Books cataloged', value: '2,800+' },
  { label: 'Medical aid items', value: '15' },
  { label: 'Annual events', value: '35+' }
];

export const announcements = [
  {
    title: 'Library evening hours extended',
    message: 'Reading hall remains open until 8:30 PM on weekdays.',
    type: 'announcement'
  },
  {
    title: 'Football Sevens registrations',
    message: 'Team registrations close this Sunday at the club office.',
    type: 'event'
  },
  {
    title: 'Medical equipment desk',
    message: 'Emergency requests are reviewed daily by the volunteer team.',
    type: 'emergency'
  }
];

export const books = [
  {
    _id: 'book-1',
    title: 'Wings of Fire',
    author: 'A. P. J. Abdul Kalam',
    category: 'Biography',
    availableCopies: 3,
    totalCopies: 4,
    shelf: 'A1',
    tags: ['inspiration', 'science'],
    description: 'A favorite among students and young readers.'
  },
  {
    _id: 'book-2',
    title: 'Randamoozham',
    author: 'M. T. Vasudevan Nair',
    category: 'Malayalam Literature',
    availableCopies: 2,
    totalCopies: 3,
    shelf: 'M2',
    tags: ['classic', 'fiction'],
    description: 'A celebrated Malayalam retelling from Bhima perspective.'
  },
  {
    _id: 'book-3',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Fiction',
    availableCopies: 5,
    totalCopies: 5,
    shelf: 'F4',
    tags: ['fiction', 'journey'],
    description: 'A compact, widely loved novel about purpose and travel.'
  },
  {
    _id: 'book-4',
    title: 'Kerala Charithram',
    author: 'A. Sreedhara Menon',
    category: 'History',
    availableCopies: 2,
    totalCopies: 2,
    shelf: 'H1',
    tags: ['kerala', 'history'],
    description: 'Reference material for local history reading circles.'
  },
  {
    _id: 'book-5',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self Help',
    availableCopies: 3,
    totalCopies: 3,
    shelf: 'S2',
    tags: ['habits', 'productivity'],
    description: 'Practical lessons for building better routines.'
  },
  {
    _id: 'book-6',
    title: 'Aadujeevitham',
    author: 'Benyamin',
    category: 'Malayalam Literature',
    availableCopies: 4,
    totalCopies: 4,
    shelf: 'M1',
    tags: ['malayalam', 'novel'],
    description: 'A powerful contemporary Malayalam novel.'
  }
];

export const events = [
  {
    _id: 'event-1',
    title: 'Reading Circle: Malayalam Classics',
    type: 'library',
    description: 'Monthly reading circle featuring Malayalam classics and member discussion.',
    location: 'Library Hall',
    startsAt: '2026-06-02T17:00:00.000Z',
    capacity: 40,
    registrations: [{ member: 'demo-member' }],
    imageUrl: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=900&q=80'
  },
  {
    _id: 'event-2',
    title: 'Amarakuni Football Sevens',
    type: 'sports',
    description: 'Local youth football tournament with evening fixtures and community cheering.',
    location: 'Community Ground',
    startsAt: '2026-06-08T16:00:00.000Z',
    capacity: 120,
    registrations: [],
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=80'
  },
  {
    _id: 'event-3',
    title: 'Blood Donation and Medical Aid Camp',
    type: 'medical',
    description: 'Medical support camp with blood donation coordination and equipment awareness.',
    location: 'Club Auditorium',
    startsAt: '2026-06-14T09:00:00.000Z',
    capacity: 100,
    registrations: [],
    imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80'
  },
  {
    _id: 'event-4',
    title: 'Community Clean Drive',
    type: 'community',
    description: 'Volunteer-led public space cleaning and awareness session.',
    location: 'Amarakuni Junction',
    startsAt: '2026-06-21T07:00:00.000Z',
    capacity: 80,
    registrations: [],
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80'
  }
];

export const sportsUpdates = [
  {
    _id: 'sports-1',
    title: 'Junior volleyball practice begins',
    sport: 'Volleyball',
    summary: 'Weekly coaching slots are open for school and college students.',
    scheduleAt: '2026-05-30T18:00:00.000Z',
    venue: 'Indoor Court',
    isHighlight: true
  },
  {
    _id: 'sports-2',
    title: 'Cricket friendly match scheduled',
    sport: 'Cricket',
    summary: 'Senior team friendly against neighboring club this Sunday.',
    scheduleAt: '2026-06-01T15:00:00.000Z',
    venue: 'Community Ground',
    score: 'Fixture pending'
  },
  {
    _id: 'sports-3',
    title: 'Badminton doubles winners announced',
    sport: 'Badminton',
    summary: 'Congratulations to the weekend doubles champions from Ward 6.',
    scheduleAt: '2026-05-24T19:00:00.000Z',
    venue: 'Club Hall',
    score: '21-17, 18-21, 21-15',
    isHighlight: true
  }
];

export const equipment = [
  {
    _id: 'equip-1',
    name: 'Adjustable Medical Bed',
    type: 'medical-bed',
    description: 'Manual adjustable bed for temporary home care support.',
    totalUnits: 3,
    availableUnits: 2,
    condition: 'good',
    isEmergencyReady: true
  },
  {
    _id: 'equip-2',
    name: 'Foldable Wheelchair',
    type: 'wheelchair',
    description: 'Lightweight wheelchair for short-term mobility support.',
    totalUnits: 6,
    availableUnits: 4,
    condition: 'excellent',
    isEmergencyReady: true
  },
  {
    _id: 'equip-3',
    name: 'Nebulizer Kit',
    type: 'nebulizer',
    description: 'Portable nebulizer kit available through medical support volunteers.',
    totalUnits: 4,
    availableUnits: 3,
    condition: 'excellent'
  },
  {
    _id: 'equip-4',
    name: 'Oxygen Concentrator',
    type: 'oxygen-concentrator',
    description: 'Issued after admin verification for urgent home care cases.',
    totalUnits: 2,
    availableUnits: 1,
    condition: 'good',
    isEmergencyReady: true
  }
];

export const notifications = [
  {
    _id: 'note-1',
    title: 'Emergency contact desk active',
    message: 'Medical equipment requests are monitored daily by the volunteer team.',
    type: 'emergency',
    createdAt: '2026-05-26T09:30:00.000Z'
  },
  {
    _id: 'note-2',
    title: 'New books added',
    message: 'Malayalam literature and student biography titles have been added this week.',
    type: 'book',
    createdAt: '2026-05-25T11:00:00.000Z'
  },
  {
    _id: 'note-3',
    title: 'Sports registrations open',
    message: 'Football Sevens registrations are open until this weekend.',
    type: 'event',
    createdAt: '2026-05-24T15:20:00.000Z'
  }
];

export const adminAnalytics = {
  totalMembers: 420,
  totalBooks: 2800,
  activeReservations: 37,
  upcomingEvents: 8,
  sportsUpdates: 12,
  equipmentItems: 15,
  pendingEquipmentRequests: 6,
  emergencyRequests: 2
};

export const memberHistory = [
  {
    _id: 'res-1',
    status: 'borrowed',
    borrowedAt: '2026-05-22T09:00:00.000Z',
    dueAt: '2026-06-05T09:00:00.000Z',
    book: books[0]
  },
  {
    _id: 'res-2',
    status: 'returned',
    borrowedAt: '2026-04-12T09:00:00.000Z',
    returnedAt: '2026-04-25T09:00:00.000Z',
    book: books[3]
  }
];

export const galleryImages = [
  {
    url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
    title: 'Volunteer planning meet'
  },
  {
    url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=900&q=80',
    title: 'Reading circle'
  },
  {
    url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80',
    title: 'Sports evening'
  }
];
