'use server'

import { createAdoption } from "@/lib/api/adoption"

export async function handleCreateAdoption(data){
    await createAdoption(data)
}