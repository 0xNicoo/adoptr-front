'use server';

import { getServiceById} from "@/lib/api/service";

export async function getServiceDetail(serviceId) {
    return await getServiceById(serviceId); 
}





