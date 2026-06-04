import type { DeterministicProductAttributes, MatchCandidate, ProductMatchDecision } from './matching.types.js';

export interface DuplicateDetectionService {
  findDuplicateCandidates(input: DeterministicProductAttributes): Promise<MatchCandidate[]>;
  detect(input: DeterministicProductAttributes): Promise<ProductMatchDecision>;
}
