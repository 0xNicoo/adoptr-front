'use server';

import { getToken } from "@/lib/session";

export async function getAccessToken() {
    return await getToken();
}