import { User } from "../user/user";

export interface Auth {
  token: string;
  user: User;
} 