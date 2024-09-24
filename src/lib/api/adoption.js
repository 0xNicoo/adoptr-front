import 'server-only';
import { getToken } from '../session';

export async function getAdoptions(filter, page, size) {
  const queryParams = getQueryParams(filter, page, size);
  const token = await getToken();
  const res = await fetch(`http://localhost:8080/adoption?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch adoptions');
  }
  return res;
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

export async function deleteAdoption(id){
  const token = await getToken();
  const res = await fetch(`http://localhost:8080/adoption/${id}`,{
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
  })

  if(!res.ok){
      throw new Error('Failed to fetch data')
  }
  return
}

export async function editAdoption(id, data) {
  const token = await getToken();
  const res = await fetch(`http://localhost:8080/adoption/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    method: 'PUT',
    body: data
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.log(errorData)
    throw new Error(`Failed to fetch data: `, errorData)
  }

  return res.json();
}

function getQueryParams(filter, page, size) {
  const filteredParams = Object.entries({
    ...filter,
    page: page - 1, // El backend utiliza índice de página 0
    size,
  }).reduce((acc, [key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});

  return new URLSearchParams(filteredParams).toString();
}