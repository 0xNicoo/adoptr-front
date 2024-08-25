'use server'
import { registerAPI } from "@/lib/api/auth"

export async function registerUser(data){
    await registerAPI(data)
}
