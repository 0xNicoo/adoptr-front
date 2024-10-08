'use server'

import { createPost, deletePost, getPosts, getPost, getPostsByUserId, getAllPosts } from "@/lib/api/post";

export async function getPostsAction(page = 0, size = 10) {
  const {data, headers} = await getPosts(page, size)
  return data
}

export async function getAllPostsAction(page = 0, size = 10) {
  const {data, headers} = await getAllPosts(page, size)
  return data
}

export async function getPostAction(id) {
  const {data, headers} = await getPost(id)
  return data
}

export async function createPostAction(FormData) {
  const {data, headers} =  await createPost(FormData)
  return data
}

export async function deletePostAction(id){
  const {data, headers} = deletePost(id)
  return data
}

export async function getPostsByUserIdAction(userId) {
  const {data, headers} = await getPostsByUserId(userId);
  return data
}
