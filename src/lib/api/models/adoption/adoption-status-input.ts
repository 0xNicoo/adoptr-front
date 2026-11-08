import { AdoptionStatus } from "./adoption-status";

/** Body de `PATCH /adoptions/{id}/status`. */
export interface AdoptionStatusInput {
  status: AdoptionStatus;
}
