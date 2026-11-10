import { GenderFemale, GenderMale, Question } from "@phosphor-icons/react/dist/ssr";
import { SEX_LABEL } from "@/lib/adoption/labels";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";

// Sexo de la mascota como ícono (♀, ♂ o «?» si no se sabe), con el texto para lectores de pantalla y tooltip.

const ICONS = {
  [PetSex.FEMALE]: GenderFemale,
  [PetSex.MALE]: GenderMale,
  [PetSex.UNKNOWN]: Question,
};

export default function SexIcon({ sex, className = "" }: { sex: PetSex; className?: string }) {
  const Icon = ICONS[sex];
  return (
    <span role="img" aria-label={SEX_LABEL[sex]} title={SEX_LABEL[sex]} className={`inline-flex shrink-0 ${className}`}>
      <Icon aria-hidden={true} weight="bold" className="h-6 w-6" />
    </span>
  );
}
