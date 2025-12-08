'use server';
import { apiRequest } from '../api';
import { Auth } from '../models/auth';

export async function login({ token, provider }: { token: string; provider: string }): Promise<Auth> {
  const response = await apiRequest<Auth>('/auth/oauth', 'POST', { token, provider }, 'application/json', false);
  if (!response.data) {
    throw new Error('Error al consultar a la api');
  }
  return response.data;
}