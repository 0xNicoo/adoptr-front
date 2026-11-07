'use server';

import { redirect } from 'next/navigation';
import { ApiError, UNKNOWN_ERROR_CODE } from '@/lib/api/api';
import { createProfile } from '@/lib/api/calls/profile';
import { CreateProfileInput } from '@/lib/api/models/profile/create-profile-input';
import { ProfileType } from '@/lib/api/models/profile/profile-type';
import { clearAccessToken } from '@/lib/auth/session';

/**
 * Resultado del alta. Devuelve el `code` del back en vez de lanzar el error, porque
 * en producción Next.js oculta el mensaje de los errores que llegan al cliente.
 */
export type CreateProfileResult = { ok: true } | { ok: false; code: string };

/** Arma el body solo con los campos del tipo elegido: lo que llega del navegador no es confiable. */
function toRequestBody(input: CreateProfileInput): CreateProfileInput {
  const common = { description: input.description, localityId: input.localityId };
  if (input.profileType === ProfileType.PERSON) {
    return {
      ...common,
      profileType: ProfileType.PERSON,
      firstName: input.firstName,
      lastName: input.lastName,
      genderType: input.genderType,
    };
  }
  return {
    ...common,
    profileType: ProfileType.ORGANIZATION,
    organizationName: input.organizationName,
    instagram: input.instagram,
    facebook: input.facebook,
    website: input.website,
  };
}

export async function createProfileAction(input: CreateProfileInput): Promise<CreateProfileResult> {
  let code: string;
  try {
    await createProfile(toRequestBody(input));
    return { ok: true };
  } catch (error) {
    code = error instanceof ApiError ? error.code : UNKNOWN_ERROR_CODE;
  }

  // Sesión vencida o inválida: se borra la cookie y se vuelve a iniciar sesión.
  // redirect() lanza una excepción interna de Next, por eso va fuera del try.
  if (code === 'UNAUTHENTICATED') {
    await clearAccessToken();
    redirect('/login');
  }
  return { ok: false, code };
}
