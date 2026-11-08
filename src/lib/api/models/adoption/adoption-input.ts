import { PetSex } from "./pet-sex";
import { PetSize } from "./pet-size";
import { Species } from "./species";

/** Body de `POST /adoptions` y `PUT /adoptions/{id}`. */
export interface AdoptionInput {
  /** Hasta 50 caracteres. */
  petName: string;
  /** Hasta 2000 caracteres. */
  description: string;
  species: Species;
  sex: PetSex;
  /** Obligatorio para perros; `null` para gatos. */
  size: PetSize | null;
  /** "aaaa-mm"; no futura ni de hace más de 30 años. */
  estimatedBirthDate: string;
  /** Sí o no: si no se sabe, `false`. */
  vaccinated: boolean;
  dewormed: boolean;
  neutered: boolean;
  localityId: number;
}
