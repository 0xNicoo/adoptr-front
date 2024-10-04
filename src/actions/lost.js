'use server';

import { createLost } from "@/lib/api/lost";

export async function createLostAction(formData){
    const {data, headers} = await createLost(formData);
    return data
  }