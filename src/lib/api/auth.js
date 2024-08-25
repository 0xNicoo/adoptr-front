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

export async function  registerAPI(data) {
    const res = await fetch('http://localhost:8080/auth/register',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    
    if (!res.ok){
        throw new Error('Failed to fetch data')
    }

    const contentType = res.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
        return res.json();
    } else {

        return null;
    }
}