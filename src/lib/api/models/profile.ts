import { Gender } from "./gender";
import { Locality } from "./locality";

export interface Profile {
    id: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    description: string;
    locality: Locality;
}