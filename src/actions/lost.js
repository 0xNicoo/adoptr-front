'use server';

import { createLost, getLosts, getLost, deleteLost, editLost } from "@/lib/api/lost";

export async function createLostAction(formData){
    const {data, headers} = await createLost(formData);
    return data
  }

  export async function getLostsAction(filter, page, size) {
    const {data, headers} = await getLosts(filter, page, size); 
    return { total: headers.totalCount, data };
  }

  export async function getLostAction(lostId) {
    const {data, headers} = await getLost(lostId); 
    return data
  }

  export async function deleteLostAction(id){
    const {data, headers} = await deleteLost(id)
    return data
  }

  export async function editLostAction(id, formData) {
    const {data, headers} = await editLost(id, formData)
    return data
  }