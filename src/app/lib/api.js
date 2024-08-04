'use server'

export async function getData(){
    const res = await fetch('http://localhost:8080/example')

    if(!res.ok){
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

export async function postData(data){
    const res = await fetch('http://localhost:8080/example',{
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

export async function deleteData(id){
    const res = await fetch(`http://localhost:8080/example/${id}`,{
        method: 'DELETE'
    })

    if(!res.ok){
        throw new Error('Failed to fetch data')
    }
    return
}

export async function updateData(id, data){
    const res = await fetch(`http://localhost:8080/example/${id}`,{
        method: 'PUT',
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