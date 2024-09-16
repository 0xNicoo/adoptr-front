import 'server-only';
import { getToken } from '../session';


export async function getPosts() {
    const token = await getToken();
    const res = await fetch(`http://localhost:8080/post/all`, {
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

export async function createPost(FormData) {
    const token = await getToken();
    const res = await fetch(`http://localhost:8080/post`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'POST',
      body: FormData
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData)
      throw new Error(`Failed to fetch data: `, errorData)
    }
    
    return res.json();
}

export async function deletePost(id){
  const token = await getToken();
  const res = await fetch(`http://localhost:8080/post/${id}`,{
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
