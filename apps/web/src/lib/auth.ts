export type WebAuthSession = {
  userId: string;
  email: string;
  role: 'customer' | 'admin' | 'super_admin';
};

export type WebAuthState = {
  session: WebAuthSession | null;
};
