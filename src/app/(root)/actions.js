'use server'

import { getToken } from "@/lib/session";

export async function isLoggedIn() {
    const token = await getToken();
    return !!token;
}