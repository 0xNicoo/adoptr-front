import { Profile } from "./profile";

export interface User {
  id: string;
  name: string;
  email: string;
  provider: string;
  providerUserId: string;
  profile: Profile;
 createdAt: Date;
}