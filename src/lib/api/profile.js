'use server-only'
import { getToken } from '../session';

export async function createProfile(data) {
    const token = await getToken()
    const res = await fetch('http://localhost:8080/profile',
        {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            method: 'POST',
            body: data,
        })
        if (!res.ok) {
            const errorData = await res.json()
            console.log(errorData)
            throw new Error('Failed to fetch data', errorData)
        }
        return res.json()
}

export async function getProfile() {
    const token = await getToken()
    const res = await fetch(`http://localhost:8080/profile`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!res.ok) {
            const errorData = await res.json()
            console.log(errorData)
            throw new Error('Failed to fetch data', errorData)
        }
        return res.json()
}

export async function getProfileByUserId(userId) {
    const token = await getToken()
    const res = await fetch(`http://localhost:8080/profile/user/${userId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!res.ok) {
            const errorData = await res.json()
            console.log(errorData)
            throw new Error('Failed to fetch data', errorData)
        }
        return res.json()
}