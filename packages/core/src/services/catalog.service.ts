import type { Brand, Category, Product } from '../domain/catalog.js';
import type { Offer, StoreProduct } from '../domain/pricing.js';

export interface CatalogService {
  searchProducts(input: { query: string; categorySlug?: string; page?: number; pageSize?: number }): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getProductComparison(productId: string): Promise<{ product: Product; offers: Offer[]; storeProducts: StoreProduct[] }>;
  listCategories(): Promise<Category[]>;
  listBrands(): Promise<Brand[]>;
}
