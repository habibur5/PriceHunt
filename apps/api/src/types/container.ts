export type ReturnTypeOfContainer = {
  environment: Record<string, string | undefined>;
  logger: {
    info: (meta: unknown, message?: string) => void;
    error: (meta: unknown, message?: string) => void;
    warn: (meta: unknown, message?: string) => void;
  };
  mysql: unknown;
  redisConfig: { url: string };
};
