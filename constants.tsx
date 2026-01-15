
import { Trek, Company, User, Review, Verification } from './types';

export const INITIAL_TREKS: Trek[] = [
  {
    id: 't1',
    name: 'Roopkund Trek',
    region: 'Uttarakhand',
    difficulty: 'Hard',
    duration: 8,
    description: 'The famous skeleton lake trek offering views of Mt. Trishul and Nanda Ghunti.',
    imageUrl: 'https://picsum.photos/seed/roopkund/800/600'
  },
  {
    id: 't2',
    name: 'Hampta Pass',
    region: 'Himachal Pradesh',
    difficulty: 'Moderate',
    duration: 5,
    description: 'A dramatic transition trek from green Kullu valley to the barren Spiti landscape.',
    imageUrl: 'https://picsum.photos/seed/hampta/800/600'
  },
  {
    id: 't3',
    name: 'Sandakphu Phalut',
    region: 'West Bengal',
    difficulty: 'Moderate',
    duration: 6,
    description: 'Witness the Sleeping Buddha - Everest, Lhotse, Makalu, and Kanchenjunga.',
    imageUrl: 'https://picsum.photos/seed/sandakphu/800/600'
  },
  {
    id: 't4',
    name: 'Valley of Flowers',
    region: 'Uttarakhand',
    difficulty: 'Easy',
    duration: 4,
    description: 'A UNESCO World Heritage site known for its endemic alpine flowers and diverse flora.',
    imageUrl: 'https://picsum.photos/seed/vof/800/600'
  }
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'c1',
    name: 'IndiaHikes',
    description: 'Indias largest trekking community and organization.',
    website: 'https://indiahikes.com',
    logoUrl: 'https://picsum.photos/seed/ih/200/200'
  },
  {
    id: 'c2',
    name: 'Trek The Himalayas',
    description: 'Premium trekking experiences with focus on safety and local culture.',
    website: 'https://trekthehimalayas.com',
    logoUrl: 'https://picsum.photos/seed/tth/200/200'
  },
  {
    id: 'c3',
    name: 'Bikat Adventures',
    description: 'Learning-based trekking and mountaineering expeditions.',
    website: 'https://bikatadventures.com',
    logoUrl: 'https://picsum.photos/seed/bikat/200/200'
  }
];

export const INITIAL_ADMIN: User = {
  id: 'admin1',
  name: 'System Admin',
  email: 'admin@trektrust.in',
  role: 'ADMIN',
  createdAt: new Date().toISOString()
};

export const INITIAL_USER: User = {
  id: 'user1',
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  role: 'USER',
  createdAt: new Date().toISOString()
};
