export type Store = {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

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

export type PriceHistoryEntry = {
  id: string;
  offerId: string;
  price: number;
  capturedAt: Date;
  createdAt: Date;
};
