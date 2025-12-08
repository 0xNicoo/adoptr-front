'use server';

import { login } from '@/lib/api/calls/auth';
import { Auth, LoginInput } from '@/lib/api/models/auth/auth';
import { setAccessToken, clearAccessToken } from '@/lib/auth/session';

export async function loginAction({ token, provider }: LoginInput): Promise<Auth> {
  const auth = await login({ token, provider });
  await setAccessToken({ token: auth.token });
  return auth;
}

export async function logoutAction() {
  await clearAccessToken();
}