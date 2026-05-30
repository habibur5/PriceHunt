export type AdminPermission =
  | 'dashboard:view'
  | 'products:manage'
  | 'merges:manage'
  | 'brands:manage'
  | 'categories:manage'
  | 'stores:manage'
  | 'scrapers:manage'
  | 'alerts:manage'
  | 'users:manage'
  | 'audit:read';

export const rolePermissions: Record<'admin' | 'super_admin', AdminPermission[]> = {
  admin: ['dashboard:view', 'products:manage', 'merges:manage', 'brands:manage', 'categories:manage', 'stores:manage', 'scrapers:manage', 'alerts:manage', 'audit:read'],
  super_admin: ['dashboard:view', 'products:manage', 'merges:manage', 'brands:manage', 'categories:manage', 'stores:manage', 'scrapers:manage', 'alerts:manage', 'users:manage', 'audit:read'],
};
