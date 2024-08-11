'use server'

import { revalidatePath } from 'next/cache'
import { deleteData, getData, updateData } from '../lib/api'
import { redirect } from 'next/navigation'

const EXAMPLE_PATH = "/example"

export async function deleteExample(id){
    await deleteData(id)
}

export async function editExample(id, example){
    await updateData(id, example)
    redirect('/example/edit')
}

export async function getAllExamples(filter){
    const data = await getData(filter, 0, 10)
    return data;
}