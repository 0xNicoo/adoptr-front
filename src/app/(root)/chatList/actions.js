'use server';

import { handleGetChatList } from "@/lib/api/chat"
import { getProfile } from "@/lib/api/profile";

export async function getChatList(data) {
    return await handleGetChatList(data);
}

export async function getUserId() {
    return await getProfile();
}