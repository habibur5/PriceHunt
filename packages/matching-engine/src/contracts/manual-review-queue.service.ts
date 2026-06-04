import type { MatchReviewItem } from './matching.types.js';

export interface ManualReviewQueueService {
  enqueue(match: MatchReviewItem): Promise<void>;
  dequeue(limit?: number): Promise<MatchReviewItem[]>;
  acknowledge(matchId: string): Promise<void>;
  reject(matchId: string, reviewerUserId: string, reason?: string): Promise<void>;
  approve(matchId: string, reviewerUserId: string): Promise<void>;
}
