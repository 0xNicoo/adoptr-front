import 'server-only'
import { getToken } from '../session'

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
        throw new Error(`Failed to fetch data`)
    }

    return res.json()
}