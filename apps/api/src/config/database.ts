import { createMysqlConfig, createMysqlPool } from '@pricehunt/database';

export const createDatabaseResources = (environment: Record<string, string | undefined>) => {
  const mysqlConfig = createMysqlConfig(environment);
  return {
    mysqlPool: createMysqlPool(mysqlConfig),
  };
};
