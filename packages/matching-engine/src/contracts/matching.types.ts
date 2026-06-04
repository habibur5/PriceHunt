import type {
  BrandEntity,
  CategoryEntity,
  JsonValue,
  PriceHistoryEntity,
  ProductEntity,
  ProductMatchingEntity,
  ProductSpecificationEntity,
  StoreProductEntity,
} from '@pricehunt/database';

export type MatchConfidenceLevel = 'exact' | 'high' | 'medium' | 'low' | 'no_match';

export type MatchFactor =
  | 'brand'
  | 'model'
  | 'storage'
  | 'ram'
  | 'color'
  | 'category'
  | 'sku'
  | 'upc'
  | 'ean';

export type NormalizedProductProfile = {
  sourceText: string;
  normalizedText: string;
  brandName?: string | null;
  normalizedBrandName?: string | null;
  modelName?: string | null;
  normalizedModelName?: string | null;
  storage?: string | null;
  ram?: string | null;
  color?: string | null;
  tokens: string[];
  signatures: string[];
};

export type DeterministicProductAttributes = {
  brandId: string;
  categoryId: string;
  brandName?: string | null;
  categoryName?: string | null;
  title: string;
  modelNumber?: string | null;
  sku?: string | null;
  upc?: string | null;
  ean?: string | null;
  description?: string | null;
  specs?: ProductSpecificationEntity[];
  color?: string | null;
  storeProduct?: StoreProductEntity | null;
};

export type MatchConfidenceScore = {
  score: number;
  level: MatchConfidenceLevel;
  reasons: string[];
  factorMatches: Record<MatchFactor, boolean>;
  factorScores: Partial<Record<MatchFactor, number>>;
};

export type MatchCandidate = {
  canonicalProduct: ProductEntity;
  brand?: BrandEntity | null;
  category?: CategoryEntity | null;
  priceHistory?: PriceHistoryEntity[];
  score: MatchConfidenceScore;
  profile: NormalizedProductProfile;
};

export type ProductMatchDecision = {
  shouldAutoMatch: boolean;
  shouldReview: boolean;
  shouldCreateCanonical: boolean;
  selectedCandidate?: MatchCandidate | null;
  score: MatchConfidenceScore;
};

export type ReviewAction = 'approve' | 'reject' | 'merge';

export type MatchReviewItem = {
  match: ProductMatchingEntity;
  score: MatchConfidenceScore;
  canonicalProduct?: ProductEntity | null;
  storeProduct?: StoreProductEntity | null;
};

export type MatchingHistoryEntry = {
  match: ProductMatchingEntity;
  canonicalProduct?: ProductEntity | null;
  storeProduct?: StoreProductEntity | null;
};
