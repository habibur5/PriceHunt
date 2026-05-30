import type { ScraperPlugin, ScraperPluginKey } from './plugin.js';

export interface PluginLoader {
  load(pluginKey: ScraperPluginKey): Promise<ScraperPlugin | null>;
  loadAll(): Promise<ScraperPlugin[]>;
  isAvailable(pluginKey: ScraperPluginKey): Promise<boolean>;
}

export type PluginFactory = () => Promise<ScraperPlugin> | ScraperPlugin;
export type PluginSourceMap = Record<ScraperPluginKey, PluginFactory>;
