'use server';

import { redirect } from 'next/navigation';
import { MAX_PHOTO_BYTES } from '@/lib/adoption/photos';
import { ApiError, UNKNOWN_ERROR_CODE } from '@/lib/api/api';
import { addAdoptionPhoto, changeAdoptionStatus, createAdoption, updateAdoption } from '@/lib/api/calls/adoption';
import { AdoptionInput } from '@/lib/api/models/adoption/adoption-input';
import { AdoptionStatus } from '@/lib/api/models/adoption/adoption-status';
import { Species } from '@/lib/api/models/adoption/species';
import { clearAccessToken } from '@/lib/auth/session';

/**
 * Resultado del alta. Devuelve el `code` del back en vez de lanzar el error, porque
 * en producción Next.js oculta el mensaje de los errores que llegan al cliente.
 */
export type CreateAdoptionResult = { ok: true; id: number } | { ok: false; code: string };

/** Arma el body solo con los campos del contrato: lo que llega del navegador no es confiable. */
function toRequestBody(input: AdoptionInput): AdoptionInput {
  return {
    petName: input.petName,
    description: input.description,
    species: input.species,
    sex: input.sex,
    size: input.species === Species.CAT ? null : input.size,
    estimatedBirthDate: input.estimatedBirthDate,
    vaccinated: input.vaccinated,
    dewormed: input.dewormed,
    neutered: input.neutered,
    localityId: input.localityId,
  };
}

export async function createAdoptionAction(input: AdoptionInput): Promise<CreateAdoptionResult> {
  let code: string;
  try {
    const adoption = await createAdoption(toRequestBody(input));
    return { ok: true, id: adoption.id };
  } catch (error) {
    code = error instanceof ApiError ? error.code : UNKNOWN_ERROR_CODE;
  }
  // redirect() lanza una excepción interna de Next, por eso va fuera del try.
  if (code === 'UNAUTHENTICATED') {
    await clearAccessToken();
    redirect('/login');
  }
  if (code === 'PROFILE_REQUIRED') {
    redirect('/profile/new');
  }
  return { ok: false, code };
}

export type AddAdoptionPhotoResult = { ok: true } | { ok: false; code: string };

/**
 * Sube una foto (parte `file`). Pasa por el servidor porque el JWT y la URL de la API solo
 * existen ahí. El tamaño máximo del pedido está en `serverActions.bodySizeLimit` (next.config.ts).
 */
export async function addAdoptionPhotoAction(adoptionId: number, formData: FormData): Promise<AddAdoptionPhotoResult> {
  const file = formData.get('file');
  if (!Number.isInteger(adoptionId) || !(file instanceof File) || file.size === 0) {
    return { ok: false, code: 'IMAGE_INVALID' };
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return { ok: false, code: 'IMAGE_TOO_LARGE' };
  }
  let code: string;
  try {
    await addAdoptionPhoto(adoptionId, file);
    return { ok: true };
  } catch (error) {
    code = error instanceof ApiError ? error.code : UNKNOWN_ERROR_CODE;
  }
  // redirect() lanza una excepción interna de Next, por eso va fuera del try.
  if (code === 'UNAUTHENTICATED') {
    await clearAccessToken();
    redirect('/login');
  }
  return { ok: false, code };
}

export type ChangeAdoptionStatusResult = { ok: true } | { ok: false; code: string };

export async function changeAdoptionStatusAction(
  adoptionId: number,
  status: AdoptionStatus,
): Promise<ChangeAdoptionStatusResult> {
  if (!Number.isInteger(adoptionId) || !Object.values(AdoptionStatus).includes(status)) {
    return { ok: false, code: 'VALIDATION_ERROR' };
  }
  let code: string;
  try {
    await changeAdoptionStatus(adoptionId, status);
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

export type UpdateAdoptionResult = { ok: true } | { ok: false; code: string };

export async function updateAdoptionAction(adoptionId: number, input: AdoptionInput): Promise<UpdateAdoptionResult> {
  if (!Number.isInteger(adoptionId)) {
    return { ok: false, code: 'VALIDATION_ERROR' };
  }
  let code: string;
  try {
    await updateAdoption(adoptionId, toRequestBody(input));
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
