'use server'

export async function getData(filter, page, size){

    const queryParams = getQueryParams(filter, page, size)

    const res = await fetch(`http://localhost:8080/example?${queryParams}`)

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


//En caso de que llege un filtro como string vacio; no lo agrega como queryparam
function getQueryParams(filter, page, size){
    const filteredParams = Object.entries({
        ...filter,
        page,
        size
    }).reduce((acc, [key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
            acc[key] = value;
        }
        return acc;
    }, {});

    return new URLSearchParams(filteredParams).toString();
}