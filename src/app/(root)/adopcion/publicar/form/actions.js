'use server'

import { createAdoption } from "@/lib/api/adoption"

export async function handleCreateAdoption(data){
    console.log(data)
    await createAdoption(data)
}