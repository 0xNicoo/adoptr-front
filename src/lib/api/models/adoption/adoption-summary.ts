import { Locality } from "../locality/locality";
import { Province } from "../locality/province";
import { AdoptionStatus } from "./adoption-status";
import { LifeStage } from "./life-stage";
import { PetSex } from "./pet-sex";
import { PetSize } from "./pet-size";
import { Species } from "./species";

/** Tarjeta de listado (`GET /adoptions` y `GET /adoptions/mine`): la ficha sin descripción ni responsable. */
export interface AdoptionSummary {
  id: number;
  petName: string;
  species: Species;
  sex: PetSex;
  /** Solo perros; `null` para gatos. */
  size: PetSize | null;
  /** "aaaa-mm" */
  estimatedBirthDate: string;
  lifeStage: LifeStage;
  vaccinated: boolean;
  dewormed: boolean;
  neutered: boolean;
  status: AdoptionStatus;
  /** `null` si no tiene fotos. El detalle no lo completa: ahí se usa `photos`. */
  coverPhotoUrl: string | null;
  locality: Locality;
  province: Province;
  /** ISO local sin zona (hora de Argentina). */
  createdAt: string;
  updatedAt: string;
}
