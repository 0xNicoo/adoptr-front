'use server';

import { getAdoptionById } from "@/lib/api/adoption";

export async function getAdoptionDetail(adoptionId) {
    return await getAdoptionById(adoptionId); 
  }
  