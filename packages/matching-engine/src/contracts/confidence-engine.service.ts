import type { MatchCandidate, MatchConfidenceScore, NormalizedProductProfile } from './matching.types.js';

export interface MatchConfidenceEngine {
  evaluate(source: NormalizedProductProfile, candidate: NormalizedProductProfile, matchContext?: Partial<MatchCandidate>): MatchConfidenceScore;
}
