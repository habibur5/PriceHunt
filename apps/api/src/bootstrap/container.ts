import { createMysqlConfig, createMysqlPool } from '@pricehunt/database';
import { createRedisConfig } from '@pricehunt/database';

import { createLogger } from '../config/logger.js';

export const createAppContainer = ({
  environment,
  logger,
}: {
  environment: Record<string, string | undefined>;
  logger: ReturnType<typeof createLogger>;
}) => {
  const mysqlConfig = createMysqlConfig(environment);
  const redisConfig = createRedisConfig(environment);

  return {
    environment,
    logger,
    mysql: createMysqlPool(mysqlConfig),
    redisConfig,
  };
};
