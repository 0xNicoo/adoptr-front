'use server'

import { redirect } from 'next/navigation'
import {postData} from '../../lib/api/example'

const EXAMPLE_PATH = "/example"

export async function createExample(data){
    await postData(data)
    redirect(EXAMPLE_PATH)
}