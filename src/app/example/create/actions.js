'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {postData} from '@/app/lib/api'

const EXAMPLE_PATH = "/example"

export async function createExample(data){
    await postData(data)
    revalidatePath(EXAMPLE_PATH)
    redirect(EXAMPLE_PATH)
}