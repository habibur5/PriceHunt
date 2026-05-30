export type RedisConfig = {
  url: string;
};

export const createRedisConfig = (environment: Record<string, string | undefined>): RedisConfig => ({
  url: environment.REDIS_URL ?? 'redis://localhost:6379',
});
