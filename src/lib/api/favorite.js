import 'server-only';
import { getToken } from '../session';

export async function setFavorite(adoptionId) {
    const token = await getToken();
    const res = await fetch(`http://localhost:8080/favorite/${adoptionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'PATCH'
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData)
      throw new Error(`Failed to fetch data: `, errorData)
    }
  
    const isJson = res.headers.get('content-type')?.includes('application/json');
    if (isJson) {
      return res.json();
    }
    
    return null;
}

export async function getFavorite(adoptionId) {
    const token = await getToken();
    const res = await fetch(`http://localhost:8080/favorite/${adoptionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'GET'
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData)
      throw new Error(`Failed to fetch data: `, errorData)
    }

    const isJson = res.headers.get('content-type')?.includes('application/json');
    if (isJson) {
      return res.json();
    }
    
    return null;
}

export async function getAllFavorites() {
    const token = await getToken();
    const res = await fetch(`http://localhost:8080/favorite/all`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'GET'
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData)
      throw new Error(`Failed to fetch data: `, errorData)
    }
    
    return res.json();
}