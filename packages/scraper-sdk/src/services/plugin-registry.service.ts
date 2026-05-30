import type { PluginRegistry } from '../contracts/plugin-registry.js';
import type { ScraperPlugin, ScraperPluginKey, ScraperPluginMetadata } from '../contracts/plugin.js';

export class InMemoryPluginRegistry implements PluginRegistry {
  private readonly plugins = new Map<ScraperPluginKey, ScraperPlugin>();

  register(plugin: ScraperPlugin): void {
    this.plugins.set(plugin.metadata.key, plugin);
  }

  unregister(pluginKey: ScraperPluginKey): void {
    this.plugins.delete(pluginKey);
  }

  get(pluginKey: ScraperPluginKey): ScraperPlugin | null {
    return this.plugins.get(pluginKey) ?? null;
  }

  list(): ScraperPlugin[] {
    return [...this.plugins.values()];
  }

  listMetadata(): ScraperPluginMetadata[] {
    return this.list().map((plugin) => plugin.metadata);
  }

  has(pluginKey: ScraperPluginKey): boolean {
    return this.plugins.has(pluginKey);
  }
}
