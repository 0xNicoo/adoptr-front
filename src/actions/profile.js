'use server'

import { createProfile, editProfile, getProfile, getProfileByUserId } from "@/lib/api/profile";

export async function getProfilByUserIdAction(userId) {
    return await getProfileByUserId(userId);
}

export async function editProfileAction(id, data) {
    return await editProfile(id, data); 
}

export async function getProfileAction() {
    return await getProfile();
}

export async function createProfileAction(data) {
    await createProfile(data); 
}
  