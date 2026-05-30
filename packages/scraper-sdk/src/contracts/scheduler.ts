import type { ScraperPluginKey, ScraperScheduleConfig } from './plugin.js';

export type SchedulerJobPayload = {
  pluginKey: ScraperPluginKey;
  runMode: 'manual' | 'scheduled' | 'health-check';
  configurationId?: string | null;
  executionId?: string | null;
};

export interface SchedulerIntegration {
  schedule(pluginKey: ScraperPluginKey, config: ScraperScheduleConfig): Promise<void>;
  pause(pluginKey: ScraperPluginKey): Promise<void>;
  resume(pluginKey: ScraperPluginKey): Promise<void>;
  disable(pluginKey: ScraperPluginKey): Promise<void>;
  enable(pluginKey: ScraperPluginKey, config: ScraperScheduleConfig): Promise<void>;
  enqueue(payload: SchedulerJobPayload): Promise<void>;
}

export interface SchedulerQueueAdapter {
  add(jobName: string, payload: SchedulerJobPayload, options?: Record<string, unknown>): Promise<unknown>;
  removeRepeatable(pluginKey: ScraperPluginKey): Promise<void>;
  upsertRepeatable(pluginKey: ScraperPluginKey, config: ScraperScheduleConfig): Promise<void>;
}
