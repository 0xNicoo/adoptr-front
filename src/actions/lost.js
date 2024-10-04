'use server';

import { createLost, getLosts, getLost } from "@/lib/api/lost";

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