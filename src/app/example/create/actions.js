'use server'

import { redirect } from 'next/navigation'
import {postData} from '@/app/lib/api'

const EXAMPLE_PATH = "/example"

export async function createExample(data){
    await postData(data)
    redirect(EXAMPLE_PATH)
}