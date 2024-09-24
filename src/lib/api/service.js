import 'server-only';
import { getToken } from '../session';

export async function getServices(filter, page, size) {
  const queryParams = getQueryParams(filter, page, size);
  const token = await getToken();
  const res = await fetch(`http://localhost:8080/service?${queryParams}`, {
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

function getQueryParams(filter, page, size) {
  const filteredParams = Object.entries({
    ...filter,
    page: page - 1, 
    size,
  }).reduce((acc, [key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});

  return new URLSearchParams(filteredParams).toString();
}


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

export async function deleteService(id){
  const token = await getToken();
  const res = await fetch(`http://localhost:8080/service/${id}`,{
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

export async function editService(id, data) {
  console.log(data);
  console.log(id);
  const token = await getToken();
  const res = await fetch(`http://localhost:8080/service/${id}`, {
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
