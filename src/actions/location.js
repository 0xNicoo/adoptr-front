'use server';

import { getProvinces } from "@/lib/api/location"
import { getLocalities } from "@/lib/api/location"

export async function getProvinceAction() {
    const {data, headers} = await getProvinces()
    return data
}
  
export async function getLocalitiesAction(provinceId) {
    const {data, headers} = await getLocalities(provinceId)
    return data
}