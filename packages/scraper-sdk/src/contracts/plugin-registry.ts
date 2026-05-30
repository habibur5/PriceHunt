import type { ScraperPlugin, ScraperPluginKey, ScraperPluginMetadata } from './plugin.js';

export interface PluginRegistry {
  register(plugin: ScraperPlugin): void;
  unregister(pluginKey: ScraperPluginKey): void;
  get(pluginKey: ScraperPluginKey): ScraperPlugin | null;
  list(): ScraperPlugin[];
  listMetadata(): ScraperPluginMetadata[];
  has(pluginKey: ScraperPluginKey): boolean;
}

export type RegisteredPluginSnapshot = {
  key: ScraperPluginKey;
  metadata: ScraperPluginMetadata;
};
