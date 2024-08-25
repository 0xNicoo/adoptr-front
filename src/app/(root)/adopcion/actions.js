'use server';

import { getAdoptions } from "@/lib/api/adoption";

export async function getAdoption() {
  return await getAdoptions();
}
