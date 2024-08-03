'use server'

import { revalidatePath } from 'next/cache'
import { deleteData } from '../lib/api'

const EXAMPLE_PATH = "/example"

export async function deleteExample(id){
    await deleteData(id)
    revalidatePath(EXAMPLE_PATH)
}