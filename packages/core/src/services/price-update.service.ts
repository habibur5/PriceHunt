import type { PriceObservation, PriceUpdateResult } from '../domain/pricing.js';

export interface PriceUpdateService {
  processObservation(input: PriceObservation): Promise<PriceUpdateResult>;
  recordPriceChange(input: PriceObservation): Promise<PriceUpdateResult>;
  detectPriceChange(input: PriceObservation): Promise<boolean>;
}