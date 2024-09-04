'use server';

import { getAdoptions } from "@/lib/api/adoption";

export async function getAdoption(filter, page) {
  const resp = await getAdoptions(filter, page, 3); 
  const total  = resp.headers.get('x-total-count');
  const data = await resp.json();
  return { total, data };
}
