export type ScraperPluginKey = string;
export type ScraperPluginState = 'enabled' | 'disabled' | 'paused' | 'degraded';
export type ScraperPluginRunMode = 'manual' | 'scheduled' | 'health-check';

export type ScraperSearchProductInput = {
  query: string;
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  brandSlug?: string;
};

export type ScraperSearchProductResult = {
  externalProductId: string;
  title: string;
  url: string;
  brandName?: string | null;
  categoryName?: string | null;
  price?: number | null;
  currency: 'BDT';
  isAvailable: boolean;
  availabilityText?: string | null;
  score?: number | null;
};

export type ScraperProductDetails = {
  externalProductId: string;
  title: string;
  description?: string | null;
  images: string[];
  specifications: Record<string, string>;
  brandName?: string | null;
  categoryName?: string | null;
  modelNumber?: string | null;
  canonicalUrl?: string | null;
};

export type ScraperCurrentPrice = {
  externalProductId: string;
  currentPrice: number;
  originalPrice?: number | null;
  currency: 'BDT';
  capturedAt: Date;
  sourceUrl: string;
};

export type ScraperAvailability = {
  externalProductId: string;
  isAvailable: boolean;
  availabilityText: 'in_stock' | 'out_of_stock' | 'pre_order' | 'unknown';
  checkedAt: Date;
  sourceUrl: string;
};

export type ScraperHealthReport = {
  healthy: boolean;
  status: 'healthy' | 'degraded' | 'disabled' | 'paused' | 'failed';
  message?: string | null;
  checkedAt: Date;
  latencyMs?: number | null;
  metadata?: Record<string, unknown>;
};

export type ScraperScheduleConfig = {
  cron: string;
  timezone?: string;
  enabled: boolean;
  concurrencyLimit?: number;
  rateLimitPerMinute?: number;
  priority?: number;
};

export type ScraperPluginMetadata = {
  key: ScraperPluginKey;
  name: string;
  version: string;
  storeName: string;
  storeSlug: string;
  supportedCategories: string[];
  defaultSchedule: ScraperScheduleConfig;
};

export type ScraperPluginContext = {
  pluginKey: ScraperPluginKey;
  logger: {
    info(message: string, meta?: Record<string, unknown>): void;
    warn(message: string, meta?: Record<string, unknown>): void;
    error(message: string, meta?: Record<string, unknown>): void;
    debug?(message: string, meta?: Record<string, unknown>): void;
  };
  runtime: {
    environment: 'development' | 'test' | 'production';
    appName: string;
  };
};

export interface ScraperPlugin {
  readonly metadata: ScraperPluginMetadata;
  initialize(context: ScraperPluginContext): Promise<void>;
  searchProducts(input: ScraperSearchProductInput): Promise<ScraperSearchProductResult[]>;
  getProductDetails(externalProductId: string): Promise<ScraperProductDetails | null>;
  getCurrentPrice(externalProductId: string): Promise<ScraperCurrentPrice | null>;
  getAvailability(externalProductId: string): Promise<ScraperAvailability | null>;
  healthCheck(): Promise<ScraperHealthReport>;
  enable(): Promise<void>;
  disable(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  destroy(): Promise<void>;
}
