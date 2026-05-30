export type UserRole = 'customer' | 'admin' | 'super_admin';

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Wishlist = {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type WishlistItem = {
  id: string;
  wishlistId: string;
  productId: string;
  createdAt: Date;
};

export type PriceAlert = {
  id: string;
  userId: string;
  productId: string;
  targetPrice: number;
  isActive: boolean;
  lastTriggeredAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
