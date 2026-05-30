import type { ScraperContext } from './scraper-context.js';

export type ScraperCapability =
  | 'catalog-discovery'
  | 'product-refresh'
  | 'price-refresh'
  | 'availability-refresh';

export type ScraperPluginMetadata = {
  name: string;
  storeSlug: string;
  version: string;
  capabilities: ScraperCapability[];
  supportedCategories: string[];
};

export interface ScraperPlugin {
  readonly metadata: ScraperPluginMetadata;
  healthCheck(context: ScraperContext): Promise<{ healthy: boolean; message?: string }>;
  discoverProducts?(context: ScraperContext): Promise<void>;
  refreshProducts?(context: ScraperContext, productIds: string[]): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  enable(): Promise<void>;
  disable(): Promise<void>;
}
