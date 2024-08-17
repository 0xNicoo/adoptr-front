import 'server-only'

export async function loginAPI(data){
    const res = await fetch('http://localhost:8080/auth/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if(!res.ok){
        throw new Error('Failed to fetch data')
    }

    return res.json()
}