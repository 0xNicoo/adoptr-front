'use server';

import { getChat, getChatByPublication, getChatList } from "@/lib/api/chat";

export async function getChatByPublicationIdAction(publicationId){
  const {data, headers} = await getChatByPublication(publicationId)
  return data
}

export async function getChatAction(id){
  const {data, headers} = await getChat(id)
  return data
}

export async function getChatListAction() {
  const {data, headers} = await getChatList()
  return data
}
