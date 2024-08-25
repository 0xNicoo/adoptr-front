import 'server-only';

export async function getProvinces() {
  const res = await fetch('http://localhost:8080/province?page=0&size=25', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch provinces');
  }

  return res.json(); 
}

export async function getLocalitiesByProvince(provinceId) {
  const res = await fetch(`http://localhost:8080/locality?provinceId=${provinceId}&size=10000`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch localities');
  }

  return res.json(); 
}
