import type { ScraperPluginKey, ScraperHealthReport } from './plugin.js';

export interface HealthMonitor {
  check(pluginKey: ScraperPluginKey): Promise<ScraperHealthReport | null>;
  checkAll(): Promise<ScraperHealthReport[]>;
}
