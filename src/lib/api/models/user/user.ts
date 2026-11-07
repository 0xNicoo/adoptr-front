import { Profile } from "../profile/profile";

export interface User {
  id: number;
  name: string;
  email: string;
  provider: string;
  providerUserId: string;
  profile: Profile | null;
  createdAt: string;
}
