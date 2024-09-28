'use server'

import { createPost, deletePost, getPosts, getPostsByUserId } from "@/lib/api/post";

export async function getPostsAction(page = 0, size = 10) {
  return await getPosts(page, size);
}

export async function createPostAction(FormData) {
  return await createPost(FormData);
}

export async function deletePostAction(id){
  await deletePost(id)
}

export async function getPostsByUserIdAction(userId) {
  return await getPostsByUserId(userId);
}
