export type MysqlConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
};

export const createMysqlConfig = (environment: Record<string, string | undefined>): MysqlConfig => ({
  host: environment.MYSQL_HOST ?? 'localhost',
  port: Number(environment.MYSQL_PORT ?? 3306),
  user: environment.MYSQL_USER ?? 'pricehunt',
  password: environment.MYSQL_PASSWORD ?? 'pricehunt',
  database: environment.MYSQL_DATABASE ?? 'pricehunt',
  connectionLimit: Number(environment.MYSQL_CONNECTION_LIMIT ?? 20),
});
