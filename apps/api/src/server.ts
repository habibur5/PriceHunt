import { createApp } from './app.js';
import { createLogger } from './config/logger.js';
import { loadEnvironment } from './config/environment.js';

export const startServer = async () => {
  const environment = loadEnvironment(process.env);
  const logger = createLogger(environment.NODE_ENV);
  const app = createApp({ environment, logger });
  const port = Number(environment.API_PORT ?? 4000);

  app.listen(port, () => {
    logger.info({ port }, 'API server started');
  });
};
