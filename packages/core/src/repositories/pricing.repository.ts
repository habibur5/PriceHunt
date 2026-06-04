import type {
  AvailabilityHistoryEntry,
  PriceHistoryEntry,
  PriceObservation,
  PriceStatistics,
  StoreProduct,
  StockStatus,
} from '../domain/pricing.js';

export interface StoreProductWriteRepository {
  save(storeProduct: StoreProduct): Promise<StoreProduct>;
  updateCurrentSnapshot(input: {
    storeProductId: string;
    currentPrice: number;
    originalPrice?: number | null;
    stockStatus: StockStatus;
    availability: StoreProduct['availability'];
    isAvailable: boolean;
    lastCheckedAt: Date;
  }): Promise<StoreProduct>;
}

export interface PriceHistoryRepository {
  append(entry: PriceHistoryEntry): Promise<PriceHistoryEntry>;
  listByStoreProductId(storeProductId: string, options?: { limit?: number; offset?: number }): Promise<PriceHistoryEntry[]>;
  listByProductId(productId: string, options?: { limit?: number; offset?: number }): Promise<PriceHistoryEntry[]>;
  findLatestByStoreProductId(storeProductId: string): Promise<PriceHistoryEntry | null>;
  findLatestByProductId(productId: string): Promise<PriceHistoryEntry | null>;
}

export interface PriceStatisticsRepository {
  save(statistics: PriceStatistics): Promise<PriceStatistics>;
  findByProductId(productId: string): Promise<PriceStatistics | null>;
  findByStoreProductId(storeProductId: string): Promise<PriceStatistics | null>;
  listByProductId(productId: string): Promise<PriceStatistics[]>;
}

export interface AvailabilityHistoryRepository {
  append(entry: AvailabilityHistoryEntry): Promise<AvailabilityHistoryEntry>;
  listByStoreProductId(
    storeProductId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<AvailabilityHistoryEntry[]>;
  listByProductId(productId: string, options?: { limit?: number; offset?: number }): Promise<AvailabilityHistoryEntry[]>;
  findLatestByStoreProductId(storeProductId: string): Promise<AvailabilityHistoryEntry | null>;
}

export interface PriceCollectionRepository {
  recordObservation(input: PriceObservation): Promise<PriceHistoryEntry>;
}