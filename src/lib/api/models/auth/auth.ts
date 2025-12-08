import { User } from "../user/user";

export interface Auth {
  token: string;
  user: User;
} 

export interface LoginInput {
  token: string;
  provider: string;
}