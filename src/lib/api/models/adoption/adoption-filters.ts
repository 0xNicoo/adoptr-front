import { LifeStage } from "./life-stage";
import { PetSex } from "./pet-sex";
import { PetSize } from "./pet-size";
import { Species } from "./species";

/** Query de `GET /adoptions` (catálogo público). Todos opcionales; se combinan con Y. */
export interface AdoptionFilters {
  species?: Species;
  sex?: PetSex;
  /** Solo tiene sentido con perros: con `CAT` el resultado es vacío. */
  size?: PetSize;
  provinceId?: number;
  localityId?: number;
  lifeStage?: LifeStage;
  /** Desde 0. */
  page?: number;
  /** De 1 a 50; por defecto 20. */
  pageSize?: number;
}
