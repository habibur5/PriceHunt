export type Store = {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'unknown';

export type StoreProduct = {
  id: string;
  storeId: string;
  productId: string;
  externalSku: string;
  sourceUrl: string;
  title: string;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order' | 'unknown';
  createdAt: Date;
  updatedAt: Date;
};

export type PriceObservationSource = 'scraper' | 'manual' | 'import' | 'backfill';

export type PriceHistoryRecordType = 'initial' | 'price_change' | 'stock_change' | 'availability_change' | 'snapshot';

export type Offer = {
  id: string;
  storeProductId: string;
  currentPrice: number;
  originalPrice?: number | null;
  currency: 'BDT';
  isAvailable: boolean;
  capturedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type PriceObservation = {
  storeProductId: string;
  productId: string;
  currentPrice: number;
  previousPrice?: number | null;
  originalPrice?: number | null;
  currency: 'BDT';
  stockStatus: StockStatus;
  availability: StoreProduct['availability'];
  isAvailable: boolean;
  observedAt: Date;
  source: PriceObservationSource;
  sourceHash?: string | null;
  sourcePayload?: unknown;
};

export type PriceHistoryEntry = {
  id: string;
  storeProductId: string;
  productId: string;
  currentPrice: number;
  previousPrice?: number | null;
  originalPrice?: number | null;
  currency: 'BDT';
  stockStatus: StockStatus;
  availability: StoreProduct['availability'];
  isAvailable: boolean;
  recordType: PriceHistoryRecordType;
  capturedAt: Date;
  source: PriceObservationSource;
  sourceHash?: string | null;
  sourcePayload?: unknown;
  createdAt: Date;
};

export type PriceStatistics = {
  productId: string;
  storeProductId?: string | null;
  currentPrice: number;
  previousPrice?: number | null;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  priceChangePercentage: number;
  observationCount: number;
  firstCapturedAt: Date;
  lastCapturedAt: Date;
  currency: 'BDT';
  stockStatus: StockStatus;
  availability: StoreProduct['availability'];
  isAvailable: boolean;
};

export type AvailabilityHistoryEntry = {
  id: string;
  storeProductId: string;
  productId: string;
  stockStatus: StockStatus;
  availability: StoreProduct['availability'];
  isAvailable: boolean;
  previousStockStatus?: StockStatus | null;
  previousAvailability?: StoreProduct['availability'] | null;
  capturedAt: Date;
  source: PriceObservationSource;
  sourceHash?: string | null;
  sourcePayload?: unknown;
  createdAt: Date;
};

export type PriceUpdateResult = {
  observation: PriceObservation;
  priceChanged: boolean;
  stockChanged: boolean;
  availabilityChanged: boolean;
  historyEntry: PriceHistoryEntry;
  availabilityEntry?: AvailabilityHistoryEntry | null;
  statistics?: PriceStatistics | null;
};

export type PriceCollectionResult = {
  productId: string;
  storeProductId: string;
  processedAt: Date;
  update: PriceUpdateResult;
};
