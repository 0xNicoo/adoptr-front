'use server';

import { login } from '@/lib/api/calls/auth';
import { setAccessToken } from '@/lib/auth/session';

export async function loginAction({ token, provider }: { token: string; provider: string }) {
  const auth = await login({ token, provider });
  await setAccessToken({ token: auth.token });
  return auth;
}