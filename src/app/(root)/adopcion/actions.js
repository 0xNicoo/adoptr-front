'use server';

import { getAdoptions } from "@/lib/api/adoption";

export async function getAdoption(filter, page) {
  const data = await getAdoptions(filter, page-1, 10)
  return data;
}
