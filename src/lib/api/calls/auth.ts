import 'server-only';
import { apiRequest } from '../api';
import { Auth } from '../models/auth';
import { setAccessToken } from '@/lib/auth/session';

export async function login({ token, provider }: { token: string; provider: string }): Promise<Auth> {
  const response = await apiRequest<Auth>('/auth/oauth', 'POST', { token, provider }, 'application/json', false);
  if (!response.data) {
    throw new Error('Error al iniciar sesión');
  }
  setAccessToken({ token: response.data.token });
  return response.data;
}