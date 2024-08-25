import 'server-only';
import { getToken } from '../session';

export async function getAdoptions() {
  const token = await getToken()
  console.log("Token:", token);
  const res = await fetch('http://localhost:8080/adoption', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  
  console.log("Token:", token);

  if (!res.ok) {
    throw new Error('Failed to fetch adoptions');
    console.log("Token:", token);
  }

  return res.json(); 
}