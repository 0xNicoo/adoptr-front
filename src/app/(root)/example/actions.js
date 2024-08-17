'use server'

import { deleteData, getData, updateData } from '../../../lib/api/example'

const EXAMPLE_PATH = "/example"

export async function deleteExample(id){
    await deleteData(id)
}

export async function getAllExamples(filter){
    const data = await getData(filter, 0, 10)
    return data;
}