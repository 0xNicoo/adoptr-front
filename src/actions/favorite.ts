'use server';

import { redirect } from 'next/navigation';
import { ApiError, UNKNOWN_ERROR_CODE } from '@/lib/api/api';
import { addFavorite, removeFavorite } from '@/lib/api/calls/favorite';
import { clearAccessToken } from '@/lib/auth/session';
import type { FavoriteResult } from '@/lib/saved/favorite-call';

async function run(publicationId: number, call: (id: number) => Promise<void>): Promise<FavoriteResult> {
  if (!Number.isInteger(publicationId)) {
    return { ok: false, code: 'VALIDATION_ERROR' };
  }
  let code: string;
  try {
    await call(publicationId);
    return { ok: true };
  } catch (error) {
    code = error instanceof ApiError ? error.code : UNKNOWN_ERROR_CODE;
  }
  if (code === 'UNAUTHENTICATED') {
    await clearAccessToken();
    redirect('/login');
  }
  return { ok: false, code };
}

export async function addFavoriteAction(publicationId: number): Promise<FavoriteResult> {
  return run(publicationId, addFavorite);
}

export async function removeFavoriteAction(publicationId: number): Promise<FavoriteResult> {
  return run(publicationId, removeFavorite);
}
