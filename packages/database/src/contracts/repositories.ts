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
import type { CrudRepository } from '../mysql/base-repository.js';

export interface UserRepository extends CrudRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
  listByRoleId(roleId: string): Promise<UserEntity[]>;
}

export interface RoleRepository extends CrudRepository<RoleEntity> {
  findByKey(key: RoleEntity['key']): Promise<RoleEntity | null>;
}

export interface PermissionRepository extends CrudRepository<PermissionEntity> {
  findByKey(key: PermissionEntity['key']): Promise<PermissionEntity | null>;
}

export interface RolePermissionRepository extends CrudRepository<RolePermissionEntity> {
  listByRoleId(roleId: string): Promise<RolePermissionEntity[]>;
  listByPermissionId(permissionId: string): Promise<RolePermissionEntity[]>;
}

export interface CategoryRepository extends CrudRepository<CategoryEntity> {
  findBySlug(slug: string): Promise<CategoryEntity | null>;
  listByParentCategoryId(parentCategoryId: string | null): Promise<CategoryEntity[]>;
}

export interface BrandRepository extends CrudRepository<BrandEntity> {
  findBySlug(slug: string): Promise<BrandEntity | null>;
}

export interface ProductRepository extends CrudRepository<ProductEntity> {
  findBySlug(slug: string): Promise<ProductEntity | null>;
  listByCategoryId(categoryId: string): Promise<ProductEntity[]>;
  listByBrandId(brandId: string): Promise<ProductEntity[]>;
}

export interface ProductSpecificationRepository extends CrudRepository<ProductSpecificationEntity> {
  listByProductId(productId: string): Promise<ProductSpecificationEntity[]>;
}

export interface StoreRepository extends CrudRepository<StoreEntity> {
  findBySlug(slug: string): Promise<StoreEntity | null>;
}

export interface StoreProductRepository extends CrudRepository<StoreProductEntity> {
  findById(id: string): Promise<StoreProductEntity | null>;
  findByStoreAndSku(storeId: string, externalSku: string): Promise<StoreProductEntity | null>;
  listByStoreId(storeId: string): Promise<StoreProductEntity[]>;
  listByProductId(productId: string): Promise<StoreProductEntity[]>;
  save(entity: StoreProductEntity): Promise<StoreProductEntity>;
}

export interface ProductMatchingRepository extends CrudRepository<ProductMatchingEntity> {
  findBySourceStoreProductId(sourceStoreProductId: string): Promise<ProductMatchingEntity | null>;
  listBySourceStoreProductId(sourceStoreProductId: string): Promise<ProductMatchingEntity[]>;
  listByCanonicalProductId(canonicalProductId: string): Promise<ProductMatchingEntity[]>;
  listByStatus(status: ProductMatchingEntity['status']): Promise<ProductMatchingEntity[]>;
  listPending(): Promise<ProductMatchingEntity[]>;
}

export interface PriceHistoryRepository extends CrudRepository<PriceHistoryEntity> {
  append(entry: PriceHistoryEntity): Promise<PriceHistoryEntity>;
  findLatestByStoreProductId(storeProductId: string): Promise<PriceHistoryEntity | null>;
  findLatestByProductId(productId: string): Promise<PriceHistoryEntity | null>;
  listByStoreProductId(storeProductId: string): Promise<PriceHistoryEntity[]>;
  listByProductId(productId: string): Promise<PriceHistoryEntity[]>;
}

export interface WishlistRepository extends CrudRepository<WishlistEntity> {
  listByUserId(userId: string): Promise<WishlistEntity[]>;
}

export interface WishlistItemRepository extends CrudRepository<WishlistItemEntity> {
  listByWishlistId(wishlistId: string): Promise<WishlistItemEntity[]>;
  listByProductId(productId: string): Promise<WishlistItemEntity[]>;
}

export interface PriceAlertRepository extends CrudRepository<PriceAlertEntity> {
  listByUserId(userId: string): Promise<PriceAlertEntity[]>;
  listByProductId(productId: string): Promise<PriceAlertEntity[]>;
}

export interface NotificationRepository extends CrudRepository<NotificationEntity> {
  listByUserId(userId: string): Promise<NotificationEntity[]>;
  listByPriceAlertId(priceAlertId: string): Promise<NotificationEntity[]>;
}

export interface ScraperRegistryRepository extends CrudRepository<ScraperRegistryEntity> {
  findByStoreAndKey(storeId: string, scraperKey: string): Promise<ScraperRegistryEntity | null>;
  listByStoreId(storeId: string): Promise<ScraperRegistryEntity[]>;
}

export interface ScraperConfigurationRepository extends CrudRepository<ScraperConfigurationEntity> {
  listByRegistryId(scraperRegistryId: string): Promise<ScraperConfigurationEntity[]>;
  findActiveByRegistryId(scraperRegistryId: string): Promise<ScraperConfigurationEntity | null>;
}

export interface ScraperExecutionLogRepository extends CrudRepository<ScraperExecutionLogEntity> {
  listByRegistryId(scraperRegistryId: string): Promise<ScraperExecutionLogEntity[]>;
  listByStatus(status: ScraperExecutionLogEntity['status']): Promise<ScraperExecutionLogEntity[]>;
}

export interface AuditLogRepository extends CrudRepository<AuditLogEntity> {
  listByEntity(entityType: string, entityId: string): Promise<AuditLogEntity[]>;
  listByActor(actorUserId: string): Promise<AuditLogEntity[]>;
}
