import type { ScraperExecutionLogEntity } from '@pricehunt/database';

import type { ScraperPluginKey, ScraperPluginRunMode, ScraperHealthReport } from './plugin.js';

export type ExecutionStartInput = {
  pluginKey: ScraperPluginKey;
  runMode: ScraperPluginRunMode;
  scraperRegistryId: string;
  scraperConfigurationId?: string | null;
  correlationId?: string | null;
};

export type ExecutionFinishInput = {
  executionId: string;
  status: ScraperExecutionLogEntity['status'];
  metrics?: Record<string, unknown>;
  errorMessage?: string | null;
  errorStack?: string | null;
};

export interface ExecutionTracker {
  start(input: ExecutionStartInput): Promise<ScraperExecutionLogEntity>;
  finish(input: ExecutionFinishInput): Promise<ScraperExecutionLogEntity>;
  recordHealthCheck(pluginKey: ScraperPluginKey, report: ScraperHealthReport): Promise<void>;
  listByPlugin(pluginKey: ScraperPluginKey): Promise<ScraperExecutionLogEntity[]>;
}
