import type { PluginFactory, PluginLoader, PluginSourceMap } from '../contracts/plugin-loader.js';
import type { ScraperPlugin, ScraperPluginKey } from '../contracts/plugin.js';

export class StaticPluginLoader implements PluginLoader {
  constructor(private readonly factories: PluginSourceMap) {}

  async load(pluginKey: ScraperPluginKey): Promise<ScraperPlugin | null> {
    const factory = this.factories[pluginKey];
    if (!factory) {
      return null;
    }

    return Promise.resolve(factory());
  }

  async loadAll(): Promise<ScraperPlugin[]> {
    const entries = Object.entries(this.factories);
    const plugins = await Promise.all(entries.map(([, factory]) => Promise.resolve(factory())));
    return plugins;
  }

  async isAvailable(pluginKey: ScraperPluginKey): Promise<boolean> {
    return pluginKey in this.factories;
  }
}

export const createPluginSourceMap = (...entries: Array<[ScraperPluginKey, PluginFactory]>) =>
  Object.fromEntries(entries) as PluginSourceMap;
