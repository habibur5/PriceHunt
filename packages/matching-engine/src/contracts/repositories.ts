import type {
  BrandRepository,
  CategoryRepository,
  PriceHistoryRepository,
  ProductMatchingRepository,
  ProductRepository,
  ProductSpecificationRepository,
  StoreProductRepository,
} from '@pricehunt/database';

export type MatchingRepositoryBundle = {
  brands: BrandRepository;
  categories: CategoryRepository;
  products: ProductRepository;
  productSpecifications: ProductSpecificationRepository;
  storeProducts: StoreProductRepository;
  priceHistory: PriceHistoryRepository;
  productMatches: ProductMatchingRepository;
};
