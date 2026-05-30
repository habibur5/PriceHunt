import type { Pool, PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import type { BaseEntity } from '../models/index.js';
import { camelToSnake, mapEntityToRow, mapRowToEntity } from './utils.js';

export type MysqlExecutor = Pick<Pool | PoolConnection, 'execute'>;

export type ListOptions = {
  limit?: number;
  offset?: number;
  includeDeleted?: boolean;
};

export interface CrudRepository<TEntity extends BaseEntity> {
  findById(id: string, options?: { includeDeleted?: boolean }): Promise<TEntity | null>;
  list(options?: ListOptions): Promise<TEntity[]>;
  findOneBy(column: keyof TEntity, value: unknown, options?: { includeDeleted?: boolean }): Promise<TEntity | null>;
  findOneByColumns(
    filters: Partial<Record<keyof TEntity, unknown>>,
    options?: { includeDeleted?: boolean },
  ): Promise<TEntity | null>;
  listBy(column: keyof TEntity, value: unknown, options?: ListOptions): Promise<TEntity[]>;
  listByColumns(filters: Partial<Record<keyof TEntity, unknown>>, options?: ListOptions): Promise<TEntity[]>;
  save(entity: TEntity): Promise<TEntity>;
  softDelete(id: string, deletedBy?: string | null): Promise<void>;
  restore(id: string, restoredBy?: string | null): Promise<void>;
}

const normalizeOptions = (options?: ListOptions) => ({
  limit: options?.limit ?? 100,
  offset: options?.offset ?? 0,
  includeDeleted: options?.includeDeleted ?? false,
});

const buildWhereClause = (filters: Record<string, unknown>) => {
  const entries = Object.entries(filters).filter(([, value]) => value !== undefined);
  const clause = entries.map(([key]) => `\`${camelToSnake(key)}\` = ?`).join(' AND ');
  const params = entries.map(([, value]) => value);
  return { clause, params };
};

export const createMysqlCrudRepository = <TEntity extends BaseEntity>(
  executor: MysqlExecutor,
  tableName: string,
): CrudRepository<TEntity> => {
  const findById = async (id: string, options?: { includeDeleted?: boolean }) => {
    const sql = `SELECT * FROM \`${tableName}\` WHERE id = ? ${options?.includeDeleted ? '' : 'AND deleted_at IS NULL'} LIMIT 1`;
    const [rows] = await executor.execute<RowDataPacket[]>(sql, [id]);
    return rows[0] ? mapRowToEntity<TEntity>(rows[0]) : null;
  };

  const list = async (options?: ListOptions) => {
    const normalized = normalizeOptions(options);
    const sql = `SELECT * FROM \`${tableName}\` ${normalized.includeDeleted ? '' : 'WHERE deleted_at IS NULL'} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const [rows] = await executor.execute<RowDataPacket[]>(sql, [normalized.limit, normalized.offset]);
    return rows.map((row) => mapRowToEntity<TEntity>(row));
  };

  const findOneBy = async (
    column: keyof TEntity,
    value: unknown,
    options?: { includeDeleted?: boolean },
  ) => {
    const sql = `SELECT * FROM \`${tableName}\` WHERE \`${camelToSnake(String(column))}\` = ? ${options?.includeDeleted ? '' : 'AND deleted_at IS NULL'} LIMIT 1`;
    const [rows] = await executor.execute<RowDataPacket[]>(sql, [value]);
    return rows[0] ? mapRowToEntity<TEntity>(rows[0]) : null;
  };

  const findOneByColumns = async (
    filters: Partial<Record<keyof TEntity, unknown>>,
    options?: { includeDeleted?: boolean },
  ) => {
    const { clause, params } = buildWhereClause(filters as Record<string, unknown>);
    const whereClause = clause ? `WHERE ${clause}` : '';
    const sql = `SELECT * FROM \`${tableName}\` ${whereClause} ${options?.includeDeleted ? '' : `${clause ? 'AND' : 'WHERE'} deleted_at IS NULL`} LIMIT 1`;
    const [rows] = await executor.execute<RowDataPacket[]>(sql, params);
    return rows[0] ? mapRowToEntity<TEntity>(rows[0]) : null;
  };

  const listBy = async (column: keyof TEntity, value: unknown, options?: ListOptions) => {
    const normalized = normalizeOptions(options);
    const sql = `SELECT * FROM \`${tableName}\` WHERE \`${camelToSnake(String(column))}\` = ? ${normalized.includeDeleted ? '' : 'AND deleted_at IS NULL'} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const [rows] = await executor.execute<RowDataPacket[]>(sql, [value, normalized.limit, normalized.offset]);
    return rows.map((row) => mapRowToEntity<TEntity>(row));
  };

  const listByColumns = async (filters: Partial<Record<keyof TEntity, unknown>>, options?: ListOptions) => {
    const normalized = normalizeOptions(options);
    const { clause, params } = buildWhereClause(filters as Record<string, unknown>);
    const whereClause = clause ? `WHERE ${clause}` : '';
    const sql = `SELECT * FROM \`${tableName}\` ${whereClause} ${normalized.includeDeleted ? '' : `${clause ? 'AND' : 'WHERE'} deleted_at IS NULL`} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const [rows] = await executor.execute<RowDataPacket[]>(sql, [...params, normalized.limit, normalized.offset]);
    return rows.map((row) => mapRowToEntity<TEntity>(row));
  };

  const save = async (entity: TEntity) => {
    const now = new Date();
    const hydratedEntity: TEntity = {
      ...entity,
      createdAt: entity.createdAt ?? now,
      updatedAt: now,
    };

    const row = mapEntityToRow(hydratedEntity);
    const columns = Object.keys(row);
    const insertColumns = columns.map((column) => `\`${column}\``).join(', ');
    const insertPlaceholders = columns.map((column) => `:${column}`).join(', ');
    const updateColumns = columns
      .filter((column) => column !== 'id' && column !== 'created_at')
      .map((column) => `\`${column}\` = VALUES(\`${column}\`)`)
      .join(', ');

    const sql = `INSERT INTO \`${tableName}\` (${insertColumns}) VALUES (${insertPlaceholders}) ON DUPLICATE KEY UPDATE ${updateColumns}`;
    await executor.execute<ResultSetHeader>(sql, row);
    return hydratedEntity;
  };

  const softDelete = async (id: string, deletedBy?: string | null) => {
    const sql = `UPDATE \`${tableName}\` SET deleted_at = NOW(), deleted_by = ?, updated_at = NOW() WHERE id = ?`;
    await executor.execute<ResultSetHeader>(sql, [deletedBy ?? null, id]);
  };

  const restore = async (id: string, restoredBy?: string | null) => {
    const sql = `UPDATE \`${tableName}\` SET deleted_at = NULL, deleted_by = ?, updated_at = NOW() WHERE id = ?`;
    await executor.execute<ResultSetHeader>(sql, [restoredBy ?? null, id]);
  };

  return {
    findById,
    list,
    findOneBy,
    findOneByColumns,
    listBy,
    listByColumns,
    save,
    softDelete,
    restore,
  };
};
