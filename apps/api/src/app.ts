import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { createAppContainer } from './bootstrap/container.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { notFoundMiddleware } from './middleware/not-found.middleware.js';
import { createApiRouter } from './routes/index.js';

export const createApp = ({
  environment,
  logger,
}: {
  environment: Record<string, string | undefined>;
  logger: ReturnType<typeof import('./config/logger.js').createLogger>;
}) => {
  const container = createAppContainer({ environment, logger });
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }));
  app.use(pinoHttp({ logger: container.logger }));
  app.use('/api/v1', createApiRouter(container));
  app.use(notFoundMiddleware);
  app.use(errorMiddleware(container.logger));

  return app;
};
