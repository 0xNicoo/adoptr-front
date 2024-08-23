'use server'

import { getToken , logout } from "@/lib/session";

export async function isLoggedIn() {
    const token = await getToken();
    return !!token;
}

export async function logOut(){
    await logout()
}