import type { Brand, Category, Product, ProductSpecification } from '../domain/catalog.js';
import type { Offer, Store, StoreProduct } from '../domain/pricing.js';

export interface BrandRepository {
  findById(id: string): Promise<Brand | null>;
  findBySlug(slug: string): Promise<Brand | null>;
  list(): Promise<Brand[]>;
}

export interface CategoryRepository {
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  list(): Promise<Category[]>;
}

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  listByCategory(categoryId: string): Promise<Product[]>;
}

export interface ProductSpecificationRepository {
  listByProductId(productId: string): Promise<ProductSpecification[]>;
}

export interface StoreRepository {
  findById(id: string): Promise<Store | null>;
  findBySlug(slug: string): Promise<Store | null>;
  list(): Promise<Store[]>;
}

export interface StoreProductRepository {
  findById(id: string): Promise<StoreProduct | null>;
  findByProductId(productId: string): Promise<StoreProduct[]>;
}

export interface OfferRepository {
  findById(id: string): Promise<Offer | null>;
  findLatestByProductId(productId: string): Promise<Offer | null>;
  listByProductId(productId: string): Promise<Offer[]>;
}
