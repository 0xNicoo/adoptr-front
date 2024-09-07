'use server';

import { getProfile } from "@/lib/api/profile";
import { getAdoptions } from "@/lib/api/adoption";
import { deleteAdoption } from "@/lib/api/adoption";

export async function handleGetProfile() {
  return await getProfile();
}

export async function handleGetAdoptions(filter, page, size) {
  const res = await getAdoptions(filter, page, size);
  if (!res.ok) {
    throw new Error('Failed to fetch adoptions');
  }
  return res.json(); 
}

export async function deleteAdoptionAction(id){
  await deleteAdoption(id)
}
