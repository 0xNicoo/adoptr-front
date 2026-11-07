import 'server-only';
import { ApiError, apiRequest } from '../api';
import { CreateProfileInput } from '../models/profile/create-profile-input';
import { Profile } from '../models/profile/profile';

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
