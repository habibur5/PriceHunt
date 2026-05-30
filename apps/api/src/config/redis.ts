import { createRedisConfig } from '@pricehunt/database';

export const createRedisResources = (environment: Record<string, string | undefined>) => ({
  config: createRedisConfig(environment),
});
