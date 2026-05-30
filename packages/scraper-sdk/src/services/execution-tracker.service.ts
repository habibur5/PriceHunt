import type {
  ScraperExecutionLogRepository,
  ScraperRegistryRepository,
} from '@pricehunt/database';
import type { ScraperExecutionLogEntity } from '@pricehunt/database';

import type { ExecutionFinishInput, ExecutionStartInput, ExecutionTracker } from '../contracts/execution-tracker.js';
import type { ScraperHealthReport, ScraperPluginKey } from '../contracts/plugin.js';

export class ExecutionTrackerService implements ExecutionTracker {
  constructor(
    private readonly scraperExecutionLogRepository: ScraperExecutionLogRepository,
    private readonly scraperRegistryRepository: ScraperRegistryRepository,
  ) {}

  async start(input: ExecutionStartInput): Promise<ScraperExecutionLogEntity> {
    const registry = await this.scraperRegistryRepository.findById(input.scraperRegistryId);
    if (!registry) {
      throw new Error(`Unknown scraper registry: ${input.scraperRegistryId}`);
    }

    const startedAt = new Date();
    const record: ScraperExecutionLogEntity = {
      id: crypto.randomUUID(),
      scraperRegistryId: input.scraperRegistryId,
      scraperConfigurationId: input.scraperConfigurationId ?? null,
      runType: input.runMode === 'manual' ? 'refresh' : input.runMode === 'scheduled' ? 'discovery' : 'health-check',
      status: 'running',
      startedAt,
      finishedAt: null,
      durationMs: null,
      errorMessage: null,
      errorStack: null,
      metricsJson: { pluginKey: input.pluginKey, correlationId: input.correlationId ?? null },
      createdAt: startedAt,
      updatedAt: startedAt,
      createdBy: null,
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
    };

    return this.scraperExecutionLogRepository.save(record);
  }

  async finish(input: ExecutionFinishInput): Promise<ScraperExecutionLogEntity> {
    const record = await this.scraperExecutionLogRepository.findById(input.executionId);
    if (!record) {
      throw new Error(`Unknown execution log: ${input.executionId}`);
    }

    const finishedAt = new Date();
    const durationMs = record.startedAt ? finishedAt.getTime() - record.startedAt.getTime() : null;
    record.status = input.status;
    record.finishedAt = finishedAt;
    record.durationMs = durationMs;
    record.errorMessage = input.errorMessage ?? null;
    record.errorStack = input.errorStack ?? null;
    record.metricsJson = input.metrics ?? record.metricsJson;

    return this.scraperExecutionLogRepository.save(record);
  }

  async recordHealthCheck(pluginKey: ScraperPluginKey, report: ScraperHealthReport): Promise<void> {
    const registry = await this.scraperRegistryRepository.findOneByColumns({ scraperKey: pluginKey });
    if (!registry) {
      return;
    }

    registry.healthStatus = report.status;
    registry.lastHealthyAt = report.healthy ? report.checkedAt : registry.lastHealthyAt ?? null;
    registry.lastErrorAt = report.healthy ? registry.lastErrorAt ?? null : report.checkedAt;
    await this.scraperRegistryRepository.save(registry);
  }

  async listByPlugin(pluginKey: ScraperPluginKey): Promise<ScraperExecutionLogEntity[]> {
    const registry = await this.scraperRegistryRepository.findOneByColumns({ scraperKey: pluginKey });
    if (!registry) {
      return [];
    }

    return this.scraperExecutionLogRepository.listByRegistryId(registry.id);
  }
}
