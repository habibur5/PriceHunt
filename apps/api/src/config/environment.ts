import { parseEnvironment } from '@pricehunt/shared';

export const loadEnvironment = (input: Record<string, string | undefined>) =>
  parseEnvironment({
    NODE_ENV: input.NODE_ENV,
    APP_NAME: input.APP_NAME,
    PUBLIC_APP_URL: input.PUBLIC_APP_URL,
    API_URL: input.API_URL,
    API_PORT: input.API_PORT,
    DATABASE_URL: input.DATABASE_URL,
    REDIS_URL: input.REDIS_URL,
    MYSQL_HOST: input.MYSQL_HOST,
    MYSQL_PORT: input.MYSQL_PORT,
    MYSQL_USER: input.MYSQL_USER,
    MYSQL_PASSWORD: input.MYSQL_PASSWORD,
    MYSQL_DATABASE: input.MYSQL_DATABASE,
    MYSQL_CONNECTION_LIMIT: input.MYSQL_CONNECTION_LIMIT,
    JWT_ACCESS_SECRET: input.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: input.JWT_REFRESH_SECRET,
    EMAIL_PROVIDER: input.EMAIL_PROVIDER,
    TELEGRAM_BOT_TOKEN: input.TELEGRAM_BOT_TOKEN,
  });
