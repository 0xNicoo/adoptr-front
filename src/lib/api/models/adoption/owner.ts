import { ProfileType } from "../profile/profile-type";

/** Responsable visible de una publicación: nunca trae email ni ids del usuario. */
export interface Owner {
  /** Para enlazar a su perfil (`/profiles/{profileId}`). */
  profileId: number;
  displayName: string;
  profileType: ProfileType;
}
