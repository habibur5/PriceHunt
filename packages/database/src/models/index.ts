export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export interface JsonArray extends Array<JsonValue> {}
export interface JsonObject {
  [key: string]: JsonValue;
}

export interface AuditFields {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface SoftDeleteFields {
  deletedAt?: Date | null;
  deletedBy?: string | null;
}

export interface BaseEntity extends AuditFields, SoftDeleteFields {
  id: string;
}

export type RoleKey = 'customer' | 'merchant' | 'admin' | 'super_admin';
export type PermissionKey =
  | 'dashboard:view'
  | 'products:manage'
  | 'merges:manage'
  | 'brands:manage'
  | 'categories:manage'
  | 'stores:manage'
  | 'scrapers:manage'
  | 'alerts:manage'
  | 'users:manage'
  | 'audit:read';

export interface UserEntity extends BaseEntity {
  roleId: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  lastLoginAt?: Date | null;
}

export interface RoleEntity extends BaseEntity {
  key: RoleKey;
  name: string;
  description?: string | null;
  isSystem: boolean;
  sortOrder: number;
}

export interface PermissionEntity extends BaseEntity {
  key: PermissionKey;
  name: string;
  description?: string | null;
  module: string;
}

export interface RolePermissionEntity extends BaseEntity {
  roleId: string;
  permissionId: string;
}

export interface CategoryEntity extends BaseEntity {
  parentCategoryId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  iconUrl?: string | null;
  level: number;
  sortOrder: number;
  isActive: boolean;
}

export interface BrandEntity extends BaseEntity {
  name: string;
  slug: string;
  websiteUrl?: string | null;
  countryOfOrigin?: string | null;
  logoUrl?: string | null;
  isActive: boolean;
}

export interface ProductEntity extends BaseEntity {
  brandId: string;
  categoryId: string;
  name: string;
  slug: string;
  modelNumber?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  canonicalProductId?: string | null;
  isCanonical: boolean;
  isActive: boolean;
}

export interface ProductSpecificationEntity extends BaseEntity {
  productId: string;
  specGroup?: string | null;
  specKey: string;
  specValue: string;
  specValueNormalized?: string | null;
  sortOrder: number;
}

export interface StoreEntity extends BaseEntity {
  name: string;
  slug: string;
  websiteUrl: string;
  logoUrl?: string | null;
  supportUrl?: string | null;
  countryCode?: string | null;
  isMarketplace: boolean;
  isActive: boolean;
}

export type StoreProductAvailability = 'in_stock' | 'out_of_stock' | 'pre_order' | 'unknown';

export interface StoreProductEntity extends BaseEntity {
  storeId: string;
  productId: string;
  externalSku: string;
  externalProductId?: string | null;
  sourceUrl: string;
  productUrl?: string | null;
  title: string;
  availability: StoreProductAvailability;
  currentPrice: number;
  originalPrice?: number | null;
  currency: 'BDT';
  isAvailable: boolean;
  lastCheckedAt?: Date | null;
}

export type ProductMatchStatus = 'pending' | 'approved' | 'rejected' | 'auto_matched';
export type ProductMatchType = 'exact' | 'spec_similarity' | 'manual';

export interface ProductMatchingEntity extends BaseEntity {
  sourceStoreProductId: string;
  canonicalProductId: string;
  matchType: ProductMatchType;
  status: ProductMatchStatus;
  confidenceScore: number;
  reviewedBy?: string | null;
  reviewedAt?: Date | null;
  metadata: JsonValue;
}

export interface PriceHistoryEntity extends BaseEntity {
  storeProductId: string;
  productId: string;
  currentPrice: number;
  previousPrice?: number | null;
  originalPrice?: number | null;
  currency: 'BDT';
  availability: StoreProductAvailability;
  recordedAt: Date;
  sourceHash?: string | null;
  sourcePayload?: JsonValue | null;
}

export interface WishlistEntity extends BaseEntity {
  userId: string;
  name: string;
  description?: string | null;
  isDefault: boolean;
}

export interface WishlistItemEntity extends BaseEntity {
  wishlistId: string;
  productId: string;
  notes?: string | null;
}

export type PriceAlertDirection = 'at_or_below' | 'at_or_above';
export type NotificationChannel = 'email' | 'telegram' | 'both';

export interface PriceAlertEntity extends BaseEntity {
  userId: string;
  productId: string;
  targetPrice: number;
  alertDirection: PriceAlertDirection;
  notificationChannel: NotificationChannel;
  isActive: boolean;
  lastTriggeredAt?: Date | null;
  nextEvaluationAt?: Date | null;
}

export type NotificationStatus = 'queued' | 'sent' | 'failed' | 'cancelled';

export interface NotificationEntity extends BaseEntity {
  userId: string;
  priceAlertId?: string | null;
  channel: NotificationChannel;
  notificationType: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string | null;
  status: NotificationStatus;
  deliveredAt?: Date | null;
  failedAt?: Date | null;
  failureReason?: string | null;
  metadata: JsonValue;
}

export type ScraperHealthStatus = 'healthy' | 'degraded' | 'disabled' | 'paused' | 'failed';
export type ScraperRunStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
export type ScraperRunType = 'discovery' | 'refresh' | 'health-check';

export interface ScraperRegistryEntity extends BaseEntity {
  storeId: string;
  scraperKey: string;
  packageName: string;
  currentVersion: string;
  isEnabled: boolean;
  isPaused: boolean;
  healthStatus: ScraperHealthStatus;
  lastHealthyAt?: Date | null;
  lastRunAt?: Date | null;
  lastErrorAt?: Date | null;
}

export interface ScraperConfigurationEntity extends BaseEntity {
  scraperRegistryId: string;
  version: string;
  scheduleCron: string;
  concurrencyLimit: number;
  rateLimitPerMinute: number;
  configJson: JsonValue;
  secretsRef?: string | null;
  isActive: boolean;
}

export interface ScraperExecutionLogEntity extends BaseEntity {
  scraperRegistryId: string;
  scraperConfigurationId?: string | null;
  runType: ScraperRunType;
  status: ScraperRunStatus;
  startedAt?: Date | null;
  finishedAt?: Date | null;
  durationMs?: number | null;
  errorMessage?: string | null;
  errorStack?: string | null;
  metricsJson: JsonValue;
}

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'restore'
  | 'login'
  | 'logout'
  | 'scraper_run'
  | 'notification';

export type AuditStatus = 'success' | 'failure';

export interface AuditLogEntity extends BaseEntity {
  actorUserId?: string | null;
  actorRoleId?: string | null;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  beforeJson?: JsonValue | null;
  afterJson?: JsonValue | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  status: AuditStatus;
  correlationId?: string | null;
}
