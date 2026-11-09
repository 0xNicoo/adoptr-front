import { AdoptionPhoto } from "./adoption-photo";
import { AdoptionSummary } from "./adoption-summary";
import { Owner } from "./owner";

/** Detalle público (`GET /adoptions/{id}`) y respuesta de alta, edición y cambio de estado. */
export interface Adoption extends AdoptionSummary {
  description: string;
  /** `null` solo si el autor no tuviera perfil (no debería ocurrir: publicar lo exige). */
  owner: Owner | null;
  /** En orden: la primera es la portada. Vacía si no tiene fotos. */
  photos: AdoptionPhoto[];
  /**
   * `true` si quien mira es quien publicó. Solo decide qué acciones mostrar; el backend
   * verifica permisos en cada operación. La respuesta varía por usuario: no cachearla compartida.
   */
  viewerIsOwner: boolean;
}
