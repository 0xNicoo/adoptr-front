'use server';

import { login } from '@/lib/api/calls/auth';

export async function loginAction({ token, provider }: { token: string; provider: string }) {
  return await login({ token, provider });
}