import type {
  ScraperConfigurationRepository,
  ScraperRegistryRepository,
} from '@pricehunt/database';

import type { ExecutionTracker } from '../contracts/execution-tracker.js';
import type { HealthMonitor } from '../contracts/health-monitor.js';
import type { PluginLoader } from '../contracts/plugin-loader.js';
import type { PluginManager, PluginManagementResult } from '../contracts/plugin-manager.js';
import type { PluginRegistry } from '../contracts/plugin-registry.js';
import type {
  ScraperPlugin,
  ScraperPluginKey,
  ScraperPluginState,
  ScraperScheduleConfig,
} from '../contracts/plugin.js';
import type { SchedulerIntegration } from '../contracts/scheduler.js';

const resolveState = (isEnabled: boolean, isPaused: boolean, healthStatus?: string): ScraperPluginState => {
  if (!isEnabled) {
    return 'disabled';
  }

  if (isPaused) {
    return 'paused';
  }

  if (healthStatus && healthStatus !== 'healthy') {
    return 'degraded';
  }

  return 'enabled';
};

export type PluginManagerDependencies = {
  registry: PluginRegistry;
  loader: PluginLoader;
  scheduler: SchedulerIntegration;
  healthMonitor: HealthMonitor;
  executionTracker: ExecutionTracker;
  scraperRegistryRepository: ScraperRegistryRepository;
  scraperConfigurationRepository: ScraperConfigurationRepository;
};

export class PluginManagerService implements PluginManager {
  constructor(private readonly dependencies: PluginManagerDependencies) {}

  async register(plugin: ScraperPlugin): Promise<void> {
    this.dependencies.registry.register(plugin);
  }

  async load(pluginKey: ScraperPluginKey): Promise<ScraperPlugin | null> {
    const plugin = await this.dependencies.loader.load(pluginKey);
    if (plugin) {
      this.dependencies.registry.register(plugin);
    }

    return plugin;
  }

  async enable(pluginKey: ScraperPluginKey): Promise<PluginManagementResult> {
    const plugin = await this.ensurePlugin(pluginKey);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginKey}`);
    }

    await plugin.enable();

    const registryRecord = await this.findOrCreateRegistryRecord(plugin);
    registryRecord.isEnabled = true;
    registryRecord.isPaused = false;
    registryRecord.currentVersion = plugin.metadata.version;
    await this.dependencies.scraperRegistryRepository.save(registryRecord);

    await this.dependencies.scheduler.enable(pluginKey, plugin.metadata.defaultSchedule);

    return this.toManagementResult(pluginKey, 'enabled', plugin.metadata.defaultSchedule);
  }

  async disable(pluginKey: ScraperPluginKey): Promise<PluginManagementResult> {
    const plugin = await this.ensurePlugin(pluginKey);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginKey}`);
    }

    await plugin.disable();
    await this.dependencies.scheduler.disable(pluginKey);

    const registryRecord = await this.findOrCreateRegistryRecord(plugin);
    registryRecord.isEnabled = false;
    registryRecord.isPaused = false;
    await this.dependencies.scraperRegistryRepository.save(registryRecord);

    return this.toManagementResult(pluginKey, 'disabled', plugin.metadata.defaultSchedule);
  }

  async pause(pluginKey: ScraperPluginKey): Promise<PluginManagementResult> {
    const plugin = await this.ensurePlugin(pluginKey);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginKey}`);
    }

    await plugin.pause();
    await this.dependencies.scheduler.pause(pluginKey);

    const registryRecord = await this.findOrCreateRegistryRecord(plugin);
    registryRecord.isPaused = true;
    await this.dependencies.scraperRegistryRepository.save(registryRecord);

    return this.toManagementResult(pluginKey, 'paused', plugin.metadata.defaultSchedule);
  }

  async resume(pluginKey: ScraperPluginKey): Promise<PluginManagementResult> {
    const plugin = await this.ensurePlugin(pluginKey);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginKey}`);
    }

    await plugin.resume();
    const registryRecord = await this.findOrCreateRegistryRecord(plugin);
    registryRecord.isPaused = false;
    registryRecord.isEnabled = true;
    await this.dependencies.scraperRegistryRepository.save(registryRecord);

    await this.dependencies.scheduler.resume(pluginKey);

    return this.toManagementResult(pluginKey, 'enabled', plugin.metadata.defaultSchedule);
  }

  async configureSchedule(pluginKey: ScraperPluginKey, config: ScraperScheduleConfig): Promise<PluginManagementResult> {
    const plugin = await this.ensurePlugin(pluginKey);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginKey}`);
    }

    const registryRecord = await this.findOrCreateRegistryRecord(plugin);
    const now = new Date();
    const configuration = {
      id: crypto.randomUUID(),
      scraperRegistryId: registryRecord.id,
      version: plugin.metadata.version,
      scheduleCron: config.cron,
      concurrencyLimit: config.concurrencyLimit ?? 1,
      rateLimitPerMinute: config.rateLimitPerMinute ?? 60,
      configJson: config,
      secretsRef: null,
      isActive: config.enabled,
      createdAt: now,
      updatedAt: now,
      createdBy: null,
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
    };

    await this.dependencies.scraperConfigurationRepository.save(configuration);
    await this.dependencies.scheduler.schedule(pluginKey, config);

    return this.toManagementResult(pluginKey, resolveState(registryRecord.isEnabled, registryRecord.isPaused, registryRecord.healthStatus), config);
  }

  async list(): Promise<PluginManagementResult[]> {
    const records = await this.dependencies.scraperRegistryRepository.list();
    return records.map((record) => ({
      pluginKey: record.scraperKey,
      state: resolveState(record.isEnabled, record.isPaused, record.healthStatus),
    }));
  }

  async get(pluginKey: ScraperPluginKey): Promise<PluginManagementResult | null> {
    const record = await this.dependencies.scraperRegistryRepository.findOneByColumns({ scraperKey: pluginKey });
    if (!record) {
      return null;
    }

    const schedule = (await this.dependencies.scraperConfigurationRepository.findActiveByRegistryId(record.id))?.configJson as
      | ScraperScheduleConfig
      | undefined;

    return {
      pluginKey,
      state: resolveState(record.isEnabled, record.isPaused, record.healthStatus),
      schedule,
    };
  }

  private async ensurePlugin(pluginKey: ScraperPluginKey): Promise<ScraperPlugin | null> {
    const existing = this.dependencies.registry.get(pluginKey);
    if (existing) {
      return existing;
    }

    return this.load(pluginKey);
  }

  private async findOrCreateRegistryRecord(plugin: ScraperPlugin) {
    const existing = await this.dependencies.scraperRegistryRepository.findByStoreAndKey(
      plugin.metadata.storeSlug,
      plugin.metadata.key,
    );
    if (existing) {
      return existing;
    }

    const now = new Date();
    return this.dependencies.scraperRegistryRepository.save({
      id: crypto.randomUUID(),
      storeId: plugin.metadata.storeSlug,
      scraperKey: plugin.metadata.key,
      packageName: plugin.metadata.key,
      currentVersion: plugin.metadata.version,
      isEnabled: false,
      isPaused: false,
      healthStatus: 'disabled',
      lastHealthyAt: null,
      lastRunAt: null,
      lastErrorAt: null,
      createdAt: now,
      updatedAt: now,
      createdBy: null,
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
    });
  }

  private toManagementResult(
    pluginKey: ScraperPluginKey,
    state: ScraperPluginState,
    schedule?: ScraperScheduleConfig,
  ): PluginManagementResult {
    return {
      pluginKey,
      state,
      schedule,
    };
  }
}
import type {
  ScraperConfigurationRepository,
  ScraperRegistryRepository,
} from '@pricehunt/database';

import type { PluginManager, PluginManagementResult } from '../contracts/plugin-manager.js';
import type { ScraperPlugin, ScraperPluginKey, ScraperScheduleConfig, ScraperPluginState } from '../contracts/plugin.js';
import type { PluginLoader } from '../contracts/plugin-loader.js';
import type { PluginRegistry } from '../contracts/plugin-registry.js';
import type { SchedulerIntegration } from '../contracts/scheduler.js';
import type { HealthMonitor } from '../contracts/health-monitor.js';
import type { ExecutionTracker } from '../contracts/execution-tracker.js';

const resolveState = (isEnabled: boolean, isPaused: boolean, healthStatus?: string): ScraperPluginState => {
  if (!isEnabled) {
    return 'disabled';
  }
  if (isPaused) {
    return 'paused';
  }
  if (healthStatus && healthStatus !== 'healthy') {
    return 'degraded';
  }
  return 'enabled';
};

export type PluginManagerDependencies = {
  registry: PluginRegistry;
  loader: PluginLoader;
  scheduler: SchedulerIntegration;
  healthMonitor: HealthMonitor;
  executionTracker: ExecutionTracker;
  scraperRegistryRepository: ScraperRegistryRepository;
  scraperConfigurationRepository: ScraperConfigurationRepository;
};

export class PluginManagerService implements PluginManager {
  constructor(private readonly dependencies: PluginManagerDependencies) {}

  async register(plugin: ScraperPlugin): Promise<void> {
    this.dependencies.registry.register(plugin);
  }

  async load(pluginKey: ScraperPluginKey): Promise<ScraperPlugin | null> {
    const plugin = await this.dependencies.loader.load(pluginKey);
    if (plugin) {
      this.dependencies.registry.register(plugin);
    }
    return plugin;
  }

  async enable(pluginKey: ScraperPluginKey): Promise<PluginManagementResult> {
    const plugin = await this.ensurePlugin(pluginKey);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginKey}`);
    }

    await plugin.enable();

    const registryRecord = await this.findOrCreateRegistryRecord(plugin);
    registryRecord.isEnabled = true;
    registryRecord.isPaused = false;
    registryRecord.currentVersion = plugin.metadata.version;
    await this.dependencies.scraperRegistryRepository.save(registryRecord);

    await this.dependencies.scheduler.enable(pluginKey, plugin.metadata.defaultSchedule);

    return this.toManagementResult(pluginKey, 'enabled', plugin.metadata.defaultSchedule);
  }

  async disable(pluginKey: ScraperPluginKey): Promise<PluginManagementResult> {
    const plugin = await this.ensurePlugin(pluginKey);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginKey}`);
    }

    await plugin.disable();
    await this.dependencies.scheduler.disable(pluginKey);

    const registryRecord = await this.findOrCreateRegistryRecord(plugin);
    registryRecord.isEnabled = false;
    registryRecord.isPaused = false;
    await this.dependencies.scraperRegistryRepository.save(registryRecord);

    return this.toManagementResult(pluginKey, 'disabled', plugin.metadata.defaultSchedule);
  }

  async pause(pluginKey: ScraperPluginKey): Promise<PluginManagementResult> {
    const plugin = await this.ensurePlugin(pluginKey);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginKey}`);
    }

    await plugin.pause();
    await this.dependencies.scheduler.pause(pluginKey);

    const registryRecord = await this.findOrCreateRegistryRecord(plugin);
    registryRecord.isPaused = true;
    await this.dependencies.scraperRegistryRepository.save(registryRecord);

    return this.toManagementResult(pluginKey, 'paused', plugin.metadata.defaultSchedule);
  }

  async resume(pluginKey: ScraperPluginKey): Promise<PluginManagementResult> {
    const plugin = await this.ensurePlugin(pluginKey);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginKey}`);
    }

    await plugin.resume();
    const registryRecord = await this.findOrCreateRegistryRecord(plugin);
    registryRecord.isPaused = false;
    registryRecord.isEnabled = true;
    await this.dependencies.scraperRegistryRepository.save(registryRecord);

    await this.dependencies.scheduler.resume(pluginKey);

    return this.toManagementResult(pluginKey, 'enabled', plugin.metadata.defaultSchedule);
  }

  async configureSchedule(pluginKey: ScraperPluginKey, config: ScraperScheduleConfig): Promise<PluginManagementResult> {
    const plugin = await this.ensurePlugin(pluginKey);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginKey}`);
    }

    const registryRecord = await this.findOrCreateRegistryRecord(plugin);
    const configuration = {
      id: crypto.randomUUID(),
      scraperRegistryId: registryRecord.id,
      version: plugin.metadata.version,
      scheduleCron: config.cron,
      concurrencyLimit: config.concurrencyLimit ?? 1,
      rateLimitPerMinute: config.rateLimitPerMinute ?? 60,
      configJson: config,
      secretsRef: null,
      isActive: config.enabled,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: null,
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
    };

    await this.dependencies.scraperConfigurationRepository.save(configuration);
    await this.dependencies.scheduler.schedule(pluginKey, config);

    return this.toManagementResult(pluginKey, resolveState(registryRecord.isEnabled, registryRecord.isPaused, registryRecord.healthStatus), config);
  }

  async list(): Promise<PluginManagementResult[]> {
    const records = await this.dependencies.scraperRegistryRepository.list();
    return records.map((record) => ({
      pluginKey: record.scraperKey,
      state: resolveState(record.isEnabled, record.isPaused, record.healthStatus),
    }));
  }

  async get(pluginKey: ScraperPluginKey): Promise<PluginManagementResult | null> {
    const record = await this.dependencies.scraperRegistryRepository.findByStoreAndKey('', pluginKey).catch(() => null);
    if (!record) {
      return null;
    }

    return {
      pluginKey,
      state: resolveState(record.isEnabled, record.isPaused, record.healthStatus),
    };
  }

  private async ensurePlugin(pluginKey: ScraperPluginKey): Promise<ScraperPlugin | null> {
    const existing = this.dependencies.registry.get(pluginKey);
    if (existing) {
      return existing;
    }

    return this.load(pluginKey);
  }

  private async findOrCreateRegistryRecord(plugin: ScraperPlugin) {
    const existing = await this.dependencies.scraperRegistryRepository.findByStoreAndKey(plugin.metadata.storeSlug, plugin.metadata.key);
    if (existing) {
      return existing;
    }

    return this.dependencies.scraperRegistryRepository.save({
      id: crypto.randomUUID(),
      storeId: plugin.metadata.storeSlug,
      scraperKey: plugin.metadata.key,
      packageName: plugin.metadata.key,
      currentVersion: plugin.metadata.version,
      isEnabled: false,
      isPaused: false,
      healthStatus: 'disabled',
      lastHealthyAt: null,
      lastRunAt: null,
      lastErrorAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: null,
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
    });
  }

  private toManagementResult(
    pluginKey: ScraperPluginKey,
    state: ScraperPluginState,
    schedule?: ScraperScheduleConfig,
  ): PluginManagementResult {
    return {
      pluginKey,
      state,
      schedule,
    };
  }
}
