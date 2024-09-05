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
