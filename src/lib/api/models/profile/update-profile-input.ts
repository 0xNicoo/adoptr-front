import { CreateOrganizationProfileInput, CreatePersonProfileInput } from "./create-profile-input";

export type UpdateProfileInput =
  | Omit<CreatePersonProfileInput, "profileType">
  | Omit<CreateOrganizationProfileInput, "profileType">;
