import type {
  DeterministicProductAttributes,
  MatchReviewItem,
  MatchingHistoryEntry,
  ProductMatchDecision,
  ReviewAction,
} from './matching.types.js';

export interface ProductMatchingService {
  matchProduct(input: DeterministicProductAttributes): Promise<ProductMatchDecision>;
  queueForReview(input: DeterministicProductAttributes): Promise<MatchReviewItem>;
  approveMatch(matchId: string, reviewerUserId: string): Promise<void>;
  rejectMatch(matchId: string, reviewerUserId: string, reason?: string): Promise<void>;
  mergeProducts(sourceProductId: string, targetProductId: string, reviewerUserId: string): Promise<void>;
  reviewPendingMatches(limit?: number): Promise<MatchReviewItem[]>;
  viewMatchingHistory(productId: string): Promise<MatchingHistoryEntry[]>;
  applyReviewAction(matchId: string, action: ReviewAction, reviewerUserId: string, reason?: string): Promise<void>;
}
