import { Gender } from "./gender";
import { ProfileType } from "./profile-type";
import { Locality } from "../locality/locality";
import { Province } from "../locality/province";

interface BaseProfile {
  id: number;
  description: string;
  locality: Locality;
  province: Province;
}

export interface PersonProfile extends BaseProfile {
  profileType: ProfileType.PERSON;
  firstName: string;
  lastName: string;
  genderType: Gender;
  organizationName: null;
  instagram: null;
  facebook: null;
  website: null;
}

export interface OrganizationProfile extends BaseProfile {
  profileType: ProfileType.ORGANIZATION;
  organizationName: string;
  instagram: string | null;
  facebook: string | null;
  website: string | null;
  firstName: null;
  lastName: null;
  genderType: null;
}

export type Profile = PersonProfile | OrganizationProfile;
