export type ScraperRunResult = {
  storeSlug: string;
  pluginVersion: string;
  success: boolean;
  discoveredCount: number;
  refreshedCount: number;
  errorCount: number;
  startedAt: Date;
  finishedAt: Date;
};
