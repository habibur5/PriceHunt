export type Brand = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  parentCategoryId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Product = {
  id: string;
  brandId: string;
  categoryId: string;
  name: string;
  slug: string;
  modelNumber?: string | null;
  description?: string | null;
  isCanonical: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductSpecification = {
  id: string;
  productId: string;
  key: string;
  value: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};
