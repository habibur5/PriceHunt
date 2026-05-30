export type TransactionContext = {
  commit(): Promise<void>;
  rollback(): Promise<void>;
};
