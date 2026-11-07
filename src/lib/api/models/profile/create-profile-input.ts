import { Gender } from "./gender";
import { ProfileType } from "./profile-type";

interface BaseCreateProfileInput {
  description: string;
  localityId: number;
}

export interface CreatePersonProfileInput extends BaseCreateProfileInput {
  profileType: ProfileType.PERSON;
  firstName: string;
  lastName: string;
  genderType: Gender;
}

export interface CreateOrganizationProfileInput extends BaseCreateProfileInput {
  profileType: ProfileType.ORGANIZATION;
  organizationName: string;
  instagram?: string;
  facebook?: string;
  website?: string;
}

export type CreateProfileInput = CreatePersonProfileInput | CreateOrganizationProfileInput;
