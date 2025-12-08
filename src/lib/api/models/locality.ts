import { Province } from "./province";

export interface Locality {
  id: number;
  name: string;
  province: Province;
}