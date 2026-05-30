import { Router } from 'express';

import type { ReturnTypeOfContainer } from '../types/container.js';

import { healthRouter } from './health.routes.js';

export const createApiRouter = (container: ReturnTypeOfContainer) => {
  const router = Router();

  router.use('/health', healthRouter(container));

  return router;
};
