import { z } from 'zod';

export const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  APP_NAME: z.string().min(1),
  PUBLIC_APP_URL: z.string().url(),
  API_URL: z.string().url(),
  API_PORT: z.string().optional(),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  MYSQL_HOST: z.string().optional(),
  MYSQL_PORT: z.string().optional(),
  MYSQL_USER: z.string().optional(),
  MYSQL_PASSWORD: z.string().optional(),
  MYSQL_DATABASE: z.string().optional(),
  MYSQL_CONNECTION_LIMIT: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  EMAIL_PROVIDER: z.string().min(1),
  TELEGRAM_BOT_TOKEN: z.string().optional().default(''),
});

export type Environment = z.infer<typeof environmentSchema>;

export const parseEnvironment = (input: Record<string, unknown>): Environment =>
  environmentSchema.parse(input);
