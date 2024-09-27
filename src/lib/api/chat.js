import 'server-only';
import { getToken } from '../session';

export async function handleGetChatList() {
  const token = await getToken()
  const res = await fetch('http://localhost:8080/chat/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch adoptions');
  }
  return res.json(); 
}

export async function getChatByPublication(publicationId) {
  const token = await getToken()
  const res = await fetch(`http://localhost:8080/chat/publication/${publicationId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  if (!res.ok) {
    console.log(await res.json())
    throw new Error('Failed to fetch adoptions');
  }
  return res.json(); 
}

export async function getChat(id) {
  const token = await getToken()
  const res = await fetch(`http://localhost:8080/chat/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  if (!res.ok) {
    console.log(await res.json())
    throw new Error('Failed to fetch adoptions');
  }
  return res.json(); 
}