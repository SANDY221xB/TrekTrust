
export type Role = 'USER' | 'ADMIN';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type Difficulty = 'Easy' | 'Moderate' | 'Hard' | 'Difficult';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Trek {
  id: string;
  name: string;
  region: string;
  difficulty: Difficulty;
  duration: number; // in days
  description: string;
  imageUrl?: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  website: string;
  logoUrl?: string;
}

export interface Verification {
  id: string;
  userId: string;
  trekId: string;
  companyId: string;
  certificateUrl: string;
  status: VerificationStatus;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  trekId: string;
  companyId: string;
  rating: number;
  text: string;
  photos: string[];
  verificationId: string;
  createdAt: string;
}

export interface AppState {
  currentUser: User | null;
  treks: Trek[];
  companies: Company[];
  verifications: Verification[];
  reviews: Review[];
}
