import type { DeterministicProductAttributes, MatchCandidate } from './matching.types.js';

export interface CanonicalProductService {
  getCanonicalProduct(productId: string): Promise<MatchCandidate | null>;
  createCanonicalProduct(input: DeterministicProductAttributes): Promise<MatchCandidate>;
  mergeCanonicalProducts(sourceProductId: string, targetProductId: string, reviewerUserId?: string | null): Promise<void>;
  linkStoreProductToCanonicalProduct(storeProductId: string, canonicalProductId: string): Promise<void>;
}
