import type { ScraperRegistryRepository } from '@pricehunt/database';

import type { HealthMonitor } from '../contracts/health-monitor.js';
import type { ScraperPluginKey, ScraperHealthReport } from '../contracts/plugin.js';
import type { PluginRegistry } from '../contracts/plugin-registry.js';

export class HealthMonitorService implements HealthMonitor {
  constructor(
    private readonly registry: PluginRegistry,
    private readonly scraperRegistryRepository: ScraperRegistryRepository,
  ) {}

  async check(pluginKey: ScraperPluginKey): Promise<ScraperHealthReport | null> {
    const plugin = this.registry.get(pluginKey);
    if (!plugin) {
      return null;
    }

    const report = await plugin.healthCheck();
    const registryRecord = await this.scraperRegistryRepository.findOneByColumns({ scraperKey: pluginKey });

    if (registryRecord) {
      registryRecord.healthStatus = report.status;
      registryRecord.lastHealthyAt = report.healthy ? report.checkedAt : registryRecord.lastHealthyAt ?? null;
      registryRecord.lastErrorAt = report.healthy ? registryRecord.lastErrorAt ?? null : report.checkedAt;
      await this.scraperRegistryRepository.save(registryRecord);
    }

    return report;
  }

  async checkAll(): Promise<ScraperHealthReport[]> {
    const reports = await Promise.all(this.registry.list().map((plugin) => plugin.healthCheck()));
    return reports;
  }
}
