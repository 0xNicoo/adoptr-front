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

  if (!res.ok) {
    throw new Error('Failed to fetch adoptions');
    console.log("Token:", token);
  }
  return res.json(); 
}

export async function createAdoption(data){

    const token = await getToken()
    const res = await fetch('http://localhost:8080/adoption',{
        headers: {
            'Authorization': `Bearer ${token}`
        },
        method: 'POST',
        body: data,
    })

    if(!res.ok){
        const errorData = await res.json();
        throw new Error(`Failed to fetch data: `, errorData)
    }
    return res.json()
}

export async function getAdoptionById(id) {
  const token = await getToken();
  console.log("Token:", token);

  const res = await fetch(`http://localhost:8080/adoption/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch adoption`);
  }
  return res.json();
}