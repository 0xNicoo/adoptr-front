'use server';

import { getProfile } from "@/lib/api/profile";

export async function handleGetProfile() {
  return await getProfile();
}