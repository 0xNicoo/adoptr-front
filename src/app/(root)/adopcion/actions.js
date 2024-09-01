'use server';

import { getAdoptions } from "@/lib/api/adoption";

export async function getAdoption(filter) {
  const data = await getAdoptions(filter, 0, 10)
  return data;
}
