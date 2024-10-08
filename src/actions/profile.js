'use server'

import { createProfile, editProfile, getProfile, getProfileByUserId } from "@/lib/api/profile";

export async function getProfilByUserIdAction(userId) {
    const {data, headers} = await getProfileByUserId(userId)
    return data
}

export async function editProfileAction(id, fromData) {
    const {data, headers} = await editProfile(id, fromData)
    return data
}

export async function getProfileAction() {
    const {data, headers} = await getProfile()
    return data
}

export async function createProfileAction(fromData) {
    const {data, headers} = await createProfile(fromData)
    return data
}
  