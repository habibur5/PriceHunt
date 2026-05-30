import type { PriceAlert, User, Wishlist, WishlistItem } from '../domain/users.js';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
}

export interface WishlistRepository {
  findById(id: string): Promise<Wishlist | null>;
  listByUserId(userId: string): Promise<Wishlist[]>;
  save(wishlist: Wishlist): Promise<Wishlist>;
}

export interface WishlistItemRepository {
  listByWishlistId(wishlistId: string): Promise<WishlistItem[]>;
  save(item: WishlistItem): Promise<WishlistItem>;
}

export interface PriceAlertRepository {
  findById(id: string): Promise<PriceAlert | null>;
  listByUserId(userId: string): Promise<PriceAlert[]>;
  save(alert: PriceAlert): Promise<PriceAlert>;
}
