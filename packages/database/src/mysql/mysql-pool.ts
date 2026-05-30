import mysql from 'mysql2/promise';

import type { MysqlConfig } from '../config/mysql.config.js';

export const createMysqlPool = (config: MysqlConfig) =>
  mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    connectionLimit: config.connectionLimit,
    namedPlaceholders: true,
  });
