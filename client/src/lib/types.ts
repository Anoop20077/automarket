export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  banned?: boolean;
  createdAt: string;
}

export interface Listing {
  id: string;
  title: string;
  type: 'CAR' | 'BIKE';
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  condition: string;
  color: string;
  ownerCount: number;
  location: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SOLD';
  views: number;
  sellerId: string;
  seller?: { id: string; name: string; phone?: string; email: string; createdAt: string };
  images: ListingImage[];
  isFavorited?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListingImage {
  id: string;
  url: string;
  listingId: string;
}

export interface Conversation {
  id: string;
  listing: { id: string; title: string; images: ListingImage[] };
  participants: { user: User }[];
  messages: Message[];
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  read: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface AdminStats {
  totalUsers: number;
  totalListings: number;
  pendingListings: number;
  approvedListings: number;
  soldListings: number;
  totalReports: number;
}

export interface Report {
  id: string;
  reason: string;
  description?: string;
  status: string;
  listingId: string;
  userId: string;
  listing?: Listing;
  user?: User;
  createdAt: string;
}
