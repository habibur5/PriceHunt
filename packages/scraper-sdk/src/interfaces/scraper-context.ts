import type { Browser, BrowserContext, Page } from 'playwright';

export type ScraperContext = {
  browser: Browser;
  browserContext: BrowserContext;
  page: Page;
  storeId: string;
  pluginVersion: string;
  logger: {
    info(message: string, meta?: Record<string, unknown>): void;
    error(message: string, meta?: Record<string, unknown>): void;
    warn(message: string, meta?: Record<string, unknown>): void;
  };
};
