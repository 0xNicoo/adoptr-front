import 'server-only';
import { getToken } from '../session';

export async function getServiceTypes() {
  const res = await fetch('http://localhost:8080/serviceType?page=0&size=20', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch service type');
  }

  return res.json(); 
}

export async function createService(data){
    const token = await getToken()
    const res = await fetch('http://localhost:8080/service',{
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

export async function getServiceById(id) {
  const token = await getToken();
  console.log("Token:", token);

  const res = await fetch(`http://localhost:8080/service/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch service`);
  }
  return res.json();
}