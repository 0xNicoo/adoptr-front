'use server'

import { reportProfile, reportPublication } from "@/lib/api/report"

export async function reportProfileAction(fromData) {
    const {data, headers} = await reportProfile(fromData)
    return data
}

export async function reportPublicationAction(fromData) {
    const {data, headers} = await reportPublication(fromData)
    return data
}