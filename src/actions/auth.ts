'use server';

import { login } from '@/lib/api/calls/auth';
import { LoginInput } from '@/lib/api/models/auth/auth';
import { setAccessToken, clearAccessToken } from '@/lib/auth/session';

export type LoginResult = { hasProfile: boolean };

/**
 * Canjea el ID token de Google por el JWT de Adoptr y lo guarda en la cookie HttpOnly.
 * Devuelve solo si el usuario ya tiene perfil, para decidir adónde ir: lo que retorna
 * una server action llega al navegador, y el JWT solo debe vivir en la cookie.
 */
export async function loginAction({ token, provider }: LoginInput): Promise<LoginResult> {
  const auth = await login({ token, provider });
  await setAccessToken({ token: auth.token });
  return { hasProfile: auth.user.profile !== null };
}

export async function logoutAction() {
  await clearAccessToken();
}
