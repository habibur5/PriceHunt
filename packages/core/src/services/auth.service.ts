import type { User } from '../domain/users.js';

export interface AuthService {
  register(input: { email: string; password: string; fullName: string }): Promise<User>;
  login(input: { email: string; password: string }): Promise<{ accessToken: string; refreshToken: string }>;
  refreshToken(input: { refreshToken: string }): Promise<{ accessToken: string; refreshToken: string }>;
  logout(input: { userId: string; sessionId: string }): Promise<void>;
}
