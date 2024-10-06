'use server';

import { getChat, getChatsByPublication, getChatList } from "@/lib/api/chat";

export async function getChatsByPublicationIdAction(publicationId){
  const {data, headers} = await getChatsByPublication(publicationId)
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
