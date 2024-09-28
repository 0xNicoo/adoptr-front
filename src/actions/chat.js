'use server';

import { getChat, getChatByPublication, getChatList } from "@/lib/api/chat";

export async function getChatByPublicationIdAction(publicationId){
  return await getChatByPublication(publicationId)
}

export async function getChatAction(id){
  return await getChat(id)
}

export async function getChatListAction() {
  return await getChatList();
}
