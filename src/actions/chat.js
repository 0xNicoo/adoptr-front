'use server';


import { getChatByPublication } from "@/lib/api/chat";

export async function getChatByPublicationIdAction(publicationId){
    return await getChatByPublication(publicationId)
  }