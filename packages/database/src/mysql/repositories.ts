import type {
  AuditLogEntity,
  BrandEntity,
  CategoryEntity,
  NotificationEntity,
  PermissionEntity,
  PriceAlertEntity,
  PriceHistoryEntity,
  ProductEntity,
  ProductMatchingEntity,
  ProductSpecificationEntity,
  RoleEntity,
  RolePermissionEntity,
  ScraperConfigurationEntity,
  ScraperExecutionLogEntity,
  ScraperRegistryEntity,
  StoreEntity,
  StoreProductEntity,
  UserEntity,
  WishlistEntity,
  WishlistItemEntity,
} from '../models/index.js';
import type {
  AuditLogRepository,
  BrandRepository,
  CategoryRepository,
  NotificationRepository,
  PermissionRepository,
  PriceAlertRepository,
  PriceHistoryRepository,
  ProductMatchingRepository,
  ProductRepository,
  ProductSpecificationRepository,
  RolePermissionRepository,
  RoleRepository,
  ScraperConfigurationRepository,
  ScraperExecutionLogRepository,
  ScraperRegistryRepository,
  StoreProductRepository,
  StoreRepository,
  UserRepository,
  WishlistItemRepository,
  WishlistRepository,
} from '../contracts/repositories.js';
import { createMysqlCrudRepository, type MysqlExecutor } from './base-repository.js';

export const createUserRepository = (executor: MysqlExecutor): UserRepository => {
  const base = createMysqlCrudRepository<UserEntity>(executor, 'users');

  return {
    ...base,
    findByEmail: (email) => base.findOneBy('email', email),
    listByRoleId: (roleId) => base.listBy('roleId', roleId),
  };
};

export const createRoleRepository = (executor: MysqlExecutor): RoleRepository => {
  const base = createMysqlCrudRepository<RoleEntity>(executor, 'roles');
  return {
    ...base,
    findByKey: (key) => base.findOneBy('key', key),
  };
};

export const createPermissionRepository = (executor: MysqlExecutor): PermissionRepository => {
  const base = createMysqlCrudRepository<PermissionEntity>(executor, 'permissions');
  return {
    ...base,
    findByKey: (key) => base.findOneBy('key', key),
  };
};

export const createRolePermissionRepository = (executor: MysqlExecutor): RolePermissionRepository => {
  const base = createMysqlCrudRepository<RolePermissionEntity>(executor, 'role_permissions');
  return {
    ...base,
    listByRoleId: (roleId) => base.listBy('roleId', roleId),
    listByPermissionId: (permissionId) => base.listBy('permissionId', permissionId),
  };
};

export const createCategoryRepository = (executor: MysqlExecutor): CategoryRepository => {
  const base = createMysqlCrudRepository<CategoryEntity>(executor, 'categories');
  return {
    ...base,
    findBySlug: (slug) => base.findOneBy('slug', slug),
    listByParentCategoryId: (parentCategoryId) =>
      base.listBy('parentCategoryId', parentCategoryId, { includeDeleted: false, limit: 1000 }),
  };
};

export const createBrandRepository = (executor: MysqlExecutor): BrandRepository => {
  const base = createMysqlCrudRepository<BrandEntity>(executor, 'brands');
  return {
    ...base,
    findBySlug: (slug) => base.findOneBy('slug', slug),
  };
};

export const createProductRepository = (executor: MysqlExecutor): ProductRepository => {
  const base = createMysqlCrudRepository<ProductEntity>(executor, 'products');
  return {
    ...base,
    findBySlug: (slug) => base.findOneBy('slug', slug),
    listByCategoryId: (categoryId) => base.listBy('categoryId', categoryId),
    listByBrandId: (brandId) => base.listBy('brandId', brandId),
  };
};

export const createProductSpecificationRepository = (
  executor: MysqlExecutor,
): ProductSpecificationRepository => {
  const base = createMysqlCrudRepository<ProductSpecificationEntity>(executor, 'product_specifications');
  return {
    ...base,
    listByProductId: (productId) => base.listBy('productId', productId),
  };
};

export const createStoreRepository = (executor: MysqlExecutor): StoreRepository => {
  const base = createMysqlCrudRepository<StoreEntity>(executor, 'stores');
  return {
    ...base,
    findBySlug: (slug) => base.findOneBy('slug', slug),
  };
};

export const createStoreProductRepository = (executor: MysqlExecutor): StoreProductRepository => {
  const base = createMysqlCrudRepository<StoreProductEntity>(executor, 'store_products');
  return {
    ...base,
    findByStoreAndSku: (storeId, externalSku) =>
      base.findOneByColumns({ storeId, externalSku }, { includeDeleted: false }),
    listByStoreId: (storeId) => base.listBy('storeId', storeId),
    listByProductId: (productId) => base.listBy('productId', productId),
  };
};

export const createProductMatchingRepository = (executor: MysqlExecutor): ProductMatchingRepository => {
  const base = createMysqlCrudRepository<ProductMatchingEntity>(executor, 'product_matching');
  return {
    ...base,
    listBySourceStoreProductId: (sourceStoreProductId) => base.listBy('sourceStoreProductId', sourceStoreProductId),
    listByCanonicalProductId: (canonicalProductId) => base.listBy('canonicalProductId', canonicalProductId),
  };
};

export const createPriceHistoryRepository = (executor: MysqlExecutor): PriceHistoryRepository => {
  const base = createMysqlCrudRepository<PriceHistoryEntity>(executor, 'price_history');
  return {
    ...base,
    listByStoreProductId: (storeProductId) => base.listBy('storeProductId', storeProductId),
    listByProductId: (productId) => base.listBy('productId', productId),
  };
};

export const createWishlistRepository = (executor: MysqlExecutor): WishlistRepository => {
  const base = createMysqlCrudRepository<WishlistEntity>(executor, 'wishlists');
  return {
    ...base,
    listByUserId: (userId) => base.listBy('userId', userId),
  };
};

export const createWishlistItemRepository = (executor: MysqlExecutor): WishlistItemRepository => {
  const base = createMysqlCrudRepository<WishlistItemEntity>(executor, 'wishlist_items');
  return {
    ...base,
    listByWishlistId: (wishlistId) => base.listBy('wishlistId', wishlistId),
    listByProductId: (productId) => base.listBy('productId', productId),
  };
};

export const createPriceAlertRepository = (executor: MysqlExecutor): PriceAlertRepository => {
  const base = createMysqlCrudRepository<PriceAlertEntity>(executor, 'price_alerts');
  return {
    ...base,
    listByUserId: (userId) => base.listBy('userId', userId),
    listByProductId: (productId) => base.listBy('productId', productId),
  };
};

export const createNotificationRepository = (executor: MysqlExecutor): NotificationRepository => {
  const base = createMysqlCrudRepository<NotificationEntity>(executor, 'notifications');
  return {
    ...base,
    listByUserId: (userId) => base.listBy('userId', userId),
    listByPriceAlertId: (priceAlertId) => base.listBy('priceAlertId', priceAlertId),
  };
};

export const createScraperRegistryRepository = (executor: MysqlExecutor): ScraperRegistryRepository => {
  const base = createMysqlCrudRepository<ScraperRegistryEntity>(executor, 'scraper_registry');
  return {
    ...base,
    findByStoreAndKey: (storeId, scraperKey) =>
      base.findOneByColumns({ storeId, scraperKey }, { includeDeleted: false }),
    listByStoreId: (storeId) => base.listBy('storeId', storeId),
  };
};

export const createScraperConfigurationRepository = (
  executor: MysqlExecutor,
): ScraperConfigurationRepository => {
  const base = createMysqlCrudRepository<ScraperConfigurationEntity>(executor, 'scraper_configurations');
  return {
    ...base,
    listByRegistryId: (scraperRegistryId) => base.listBy('scraperRegistryId', scraperRegistryId),
    findActiveByRegistryId: (scraperRegistryId) =>
      base.findOneBy('scraperRegistryId', scraperRegistryId).then((entity) =>
        entity && entity.isActive ? entity : null,
      ),
  };
};

export const createScraperExecutionLogRepository = (
  executor: MysqlExecutor,
): ScraperExecutionLogRepository => {
  const base = createMysqlCrudRepository<ScraperExecutionLogEntity>(executor, 'scraper_execution_logs');
  return {
    ...base,
    listByRegistryId: (scraperRegistryId) => base.listBy('scraperRegistryId', scraperRegistryId),
    listByStatus: (status) => base.listBy('status', status),
  };
};

export const createAuditLogRepository = (executor: MysqlExecutor): AuditLogRepository => {
  const base = createMysqlCrudRepository<AuditLogEntity>(executor, 'audit_logs');
  return {
    ...base,
    listByEntity: (entityType, entityId) => base.listByColumns({ entityType, entityId }, { limit: 500 }),
    listByActor: (actorUserId) => base.listBy('actorUserId', actorUserId),
  };
};
