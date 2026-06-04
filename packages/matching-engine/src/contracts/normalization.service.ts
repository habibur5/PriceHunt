import type { DeterministicProductAttributes, NormalizedProductProfile } from './matching.types.js';

export interface ProductNormalizationService {
  normalizeText(input: string): string;
  normalizeBrand(input?: string | null): string | null;
  normalizeModel(input?: string | null): string | null;
  normalizeStorage(input?: string | null): string | null;
  normalizeRam(input?: string | null): string | null;
  normalizeColor(input?: string | null): string | null;
  normalizeAttributes(input: DeterministicProductAttributes): NormalizedProductProfile;
}
