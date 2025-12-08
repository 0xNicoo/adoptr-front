import 'server-only'
import { apiRequest } from '../api';
import { Auth, LoginInput  } from '../models/auth/auth';

export async function login({ token, provider }: LoginInput): Promise<Auth> {
  const response = await apiRequest<Auth>('/auth/oauth', 'POST', { token, provider }, 'application/json', false);
  if (!response.data) {
    throw new Error('Error al consultar a la api');
  }
  return response.data;
}