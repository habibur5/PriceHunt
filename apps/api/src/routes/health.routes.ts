import { Router } from 'express';

import type { ReturnTypeOfContainer } from '../types/container.js';

export const healthRouter = (_container: ReturnTypeOfContainer) => {
  const router = Router();

  router.get('/', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });

  return router;
};
