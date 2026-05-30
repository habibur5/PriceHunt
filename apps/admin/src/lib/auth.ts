export type AdminSession = {
  userId: string;
  email: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
};
