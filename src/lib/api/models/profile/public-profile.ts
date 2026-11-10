import { OrganizationProfile, PersonProfile } from "./profile";

/**
 * Perfil de cualquier usuario (`GET /profiles/{id}`): igual que `Profile` sin el género de la persona.
 * Un `Profile` también es un `PublicProfile`, así que los componentes que lo muestran aceptan los dos.
 */
export type PublicProfile = Omit<PersonProfile, "genderType"> | OrganizationProfile;
