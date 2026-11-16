import 'server-only';
import { ApiError, apiRequest } from '../api';
import { CreateProfileInput } from '../models/profile/create-profile-input';
import { Profile } from '../models/profile/profile';
import { PublicProfile } from '../models/profile/public-profile';
import { GooglePhoto } from '../models/user/google-photo';

/** Perfil del usuario de la sesión, o `null` si todavía no lo creó. */
export async function getMyProfile(): Promise<Profile | null> {
  try {
    const response = await apiRequest<Profile>('/profile');
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.code === 'PROFILE_NOT_FOUND') {
      return null;
    }
    throw error;
  }
}

export async function createProfile(input: CreateProfileInput): Promise<Profile> {
  const response = await apiRequest<Profile>('/profile', 'POST', input);
  if (!response.data) {
    throw new Error('El alta de perfil no devolvió el perfil creado');
  }
  return response.data;
}

export async function getGooglePhotoUrl(): Promise<string | null> {
  const response = await apiRequest<GooglePhoto>('/user/google-photo');
  return response.data?.url ?? null;
}

export async function setProfilePhoto(file: File): Promise<Profile> {
  const body = new FormData();
  body.append('file', file, file.name);
  const response = await apiRequest<Profile>('/profile/photo', 'PUT', body, 'multipart/form-data');
  if (!response.data) {
    throw new Error('La foto de perfil no devolvió el perfil');
  }
  return response.data;
}

export async function setGoogleProfilePhoto(): Promise<Profile> {
  const response = await apiRequest<Profile>('/profile/photo/google', 'PUT');
  if (!response.data) {
    throw new Error('La foto de Google no devolvió el perfil');
  }
  return response.data;
}

export async function deleteProfilePhoto(): Promise<void> {
  await apiRequest<void>('/profile/photo', 'DELETE');
}

/** Perfil de cualquier usuario, público (va sin token), o `null` si no existe. */
export async function getPublicProfile(id: number): Promise<PublicProfile | null> {
  try {
    const response = await apiRequest<PublicProfile>(`/profiles/${id}`, 'GET', null, 'application/json', false);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.code === 'PROFILE_NOT_FOUND') {
      return null;
    }
    throw error;
  }
}
