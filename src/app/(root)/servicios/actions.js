'use server';

import { getServices } from "@/lib/api/service";

export async function getService(filter, page) {
  const resp = await getServices(filter, page, 8); 
  const total  = resp.headers.get('x-total-count');
  const data = await resp.json();
  return { total, data };
}
