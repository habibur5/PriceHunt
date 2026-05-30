import type { ScraperPlugin, ScraperPluginKey, ScraperPluginState, ScraperScheduleConfig } from './plugin.js';

export type PluginLifecycleAction = 'enable' | 'disable' | 'pause' | 'resume' | 'configure-schedule';

export type PluginManagementResult = {
  pluginKey: ScraperPluginKey;
  state: ScraperPluginState;
  schedule?: ScraperScheduleConfig;
};

export interface PluginManager {
  register(plugin: ScraperPlugin): Promise<void>;
  load(pluginKey: ScraperPluginKey): Promise<ScraperPlugin | null>;
  enable(pluginKey: ScraperPluginKey): Promise<PluginManagementResult>;
  disable(pluginKey: ScraperPluginKey): Promise<PluginManagementResult>;
  pause(pluginKey: ScraperPluginKey): Promise<PluginManagementResult>;
  resume(pluginKey: ScraperPluginKey): Promise<PluginManagementResult>;
  configureSchedule(pluginKey: ScraperPluginKey, config: ScraperScheduleConfig): Promise<PluginManagementResult>;
  list(): Promise<PluginManagementResult[]>;
  get(pluginKey: ScraperPluginKey): Promise<PluginManagementResult | null>;
}
