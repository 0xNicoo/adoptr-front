'use server'

import { revalidatePath } from 'next/cache'
import { deleteData, getData, updateData } from '../lib/api'
import { redirect } from 'next/navigation'

const EXAMPLE_PATH = "/example"

export async function deleteExample(id){
    await deleteData(id)
    revalidatePath(EXAMPLE_PATH)
}

export async function editExample(id, example){
    await updateData(id, example)
    redirect('/example/edit')
}

export async function getAllExamples(){
    const data = await getData()
    return data;
}