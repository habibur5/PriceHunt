export type PaginationInput = {
  page: number;
  pageSize: number;
};

export type PaginationMeta = PaginationInput & {
  total: number;
  totalPages: number;
};
