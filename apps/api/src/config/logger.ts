import pino from 'pino';

export const createLogger = (environment: string) =>
  pino({
    level: environment === 'production' ? 'info' : 'debug',
    transport:
      environment === 'production'
        ? undefined
        : {
            target: 'pino-pretty',
            options: { colorize: true },
          },
  });
