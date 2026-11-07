'use server';

import { login } from '@/lib/api/calls/auth';
import { LoginInput } from '@/lib/api/models/auth/auth';
import { setAccessToken, clearAccessToken } from '@/lib/auth/session';

/**
 * Canjea el ID token de Google por el JWT de Adoptr y lo guarda en la cookie HttpOnly.
 * No devuelve nada: lo que retorna una server action llega al navegador, y el JWT
 * solo debe vivir en la cookie.
 */
export async function loginAction({ token, provider }: LoginInput): Promise<void> {
  const auth = await login({ token, provider });
  await setAccessToken({ token: auth.token });
}

export async function logoutAction() {
  await clearAccessToken();
}
