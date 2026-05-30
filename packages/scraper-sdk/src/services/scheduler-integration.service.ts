import type { ScraperPluginKey, ScraperScheduleConfig } from '../contracts/plugin.js';
import type { SchedulerIntegration, SchedulerQueueAdapter } from '../contracts/scheduler.js';

export class SchedulerIntegrationService implements SchedulerIntegration {
  constructor(private readonly queueAdapter: SchedulerQueueAdapter) {}

  async schedule(pluginKey: ScraperPluginKey, config: ScraperScheduleConfig): Promise<void> {
    await this.queueAdapter.upsertRepeatable(pluginKey, config);
  }

  async pause(pluginKey: ScraperPluginKey): Promise<void> {
    await this.queueAdapter.removeRepeatable(pluginKey);
  }

  async resume(pluginKey: ScraperPluginKey): Promise<void> {
    await this.queueAdapter.removeRepeatable(pluginKey);
  }

  async disable(pluginKey: ScraperPluginKey): Promise<void> {
    await this.queueAdapter.removeRepeatable(pluginKey);
  }

  async enable(pluginKey: ScraperPluginKey, config: ScraperScheduleConfig): Promise<void> {
    if (config.enabled) {
      await this.queueAdapter.upsertRepeatable(pluginKey, config);
    }
  }

  async enqueue(payload: { pluginKey: ScraperPluginKey; runMode: 'manual' | 'scheduled' | 'health-check'; configurationId?: string | null; executionId?: string | null; }): Promise<void> {
    await this.queueAdapter.add('scraper-plugin-run', payload, { removeOnComplete: true, removeOnFail: 100 });
  }
}
