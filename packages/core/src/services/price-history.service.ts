import type { PriceHistoryEntry, PriceStatistics } from '../domain/pricing.js';

export interface PriceHistoryService {
  getCurrentPrice(productId: string): Promise<PriceStatistics | null>;
  getPriceHistory(productId: string, options?: { limit?: number; offset?: number }): Promise<PriceHistoryEntry[]>;
  getPriceHistoryByStoreProduct(
    storeProductId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<PriceHistoryEntry[]>;
  getLatestEntryByStoreProduct(storeProductId: string): Promise<PriceHistoryEntry | null>;
}