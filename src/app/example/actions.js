'use server'

import { revalidatePath } from 'next/cache'
import { deleteData, updateData } from '../lib/api'
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