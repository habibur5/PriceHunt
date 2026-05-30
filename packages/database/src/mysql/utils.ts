import type { RowDataPacket } from 'mysql2/promise';

const jsonFieldSuffixes = ['Json', 'Payload', 'Metadata', 'Metrics', 'Data', 'Before', 'After'];

export const camelToSnake = (value: string) =>
  value.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();

export const snakeToCamel = (value: string) =>
  value.replace(/_([a-z0-9])/g, (_, character: string) => character.toUpperCase());

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date);

export const toDatabaseValue = (key: string, value: unknown) => {
  if (value === undefined) {
    return undefined;
  }

  if (value instanceof Date) {
    return value;
  }

  if (isPlainObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }

  if (typeof value === 'string' && jsonFieldSuffixes.some((suffix) => key.endsWith(suffix))) {
    return value;
  }

  return value;
};

export const fromDatabaseValue = (key: string, value: unknown) => {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const looksJson = trimmed.startsWith('{') || trimmed.startsWith('[');

    if (looksJson && jsonFieldSuffixes.some((suffix) => key.endsWith(suffix))) {
      try {
        return JSON.parse(trimmed) as unknown;
      } catch {
        return value;
      }
    }
  }

  return value;
};

export const mapRowToEntity = <TEntity extends Record<string, unknown>>(row: RowDataPacket) => {
  const entity: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(row)) {
    entity[snakeToCamel(key)] = fromDatabaseValue(snakeToCamel(key), value);
  }

  return entity as TEntity;
};

export const mapEntityToRow = <TEntity extends Record<string, unknown>>(entity: TEntity) => {
  const row: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(entity)) {
    if (value === undefined) {
      continue;
    }

    row[camelToSnake(key)] = toDatabaseValue(key, value);
  }

  return row;
};
