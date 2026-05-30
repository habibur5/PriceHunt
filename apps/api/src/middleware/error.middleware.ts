import type { ErrorRequestHandler } from 'express';

export const errorMiddleware = (logger: { error(message: string, meta?: unknown): void }): ErrorRequestHandler =>
  (error, _request, response, _next) => {
    logger.error('Unhandled API error', { error });
    response.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred.',
      },
    });
  };
