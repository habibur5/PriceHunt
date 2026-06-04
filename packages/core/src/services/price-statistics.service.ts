import type { PriceStatistics } from '../domain/pricing.js';

export interface PriceStatisticsService {
  generateForProduct(productId: string): Promise<PriceStatistics | null>;
  generateForStoreProduct(storeProductId: string): Promise<PriceStatistics | null>;
  generateBatch(input?: { productIds?: string[]; storeProductIds?: string[] }): Promise<PriceStatistics[]>;
  rebuildForProduct(productId: string): Promise<PriceStatistics | null>;
}