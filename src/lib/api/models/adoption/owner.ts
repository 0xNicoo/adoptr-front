import { ProfileType } from "../profile/profile-type";

/** Responsable visible de una publicación: nunca trae email ni ids. */
export interface Owner {
  displayName: string;
  profileType: ProfileType;
}
