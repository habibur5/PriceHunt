import type { AvailabilityHistoryEntry, PriceObservation } from '../domain/pricing.js';

export interface AvailabilityTrackingService {
  trackAvailabilityChange(input: PriceObservation): Promise<AvailabilityHistoryEntry | null>;
  getAvailabilityHistory(productId: string, options?: { limit?: number; offset?: number }): Promise<AvailabilityHistoryEntry[]>;
  getLatestAvailabilityByStoreProduct(storeProductId: string): Promise<AvailabilityHistoryEntry | null>;
}