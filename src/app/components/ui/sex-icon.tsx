import { GenderFemale, GenderMale, Question } from "@phosphor-icons/react/dist/ssr";
import { SEX_LABEL } from "@/lib/adoption/labels";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";

// Sexo de la mascota como ícono en un círculo: ♂ en azul, ♀ en naranja (con el ícono en tinta: el naranja
// no lleva blanco) y «?» en papel si no se sabe. El texto va para lectores de pantalla y como tooltip.

const STYLES = {
  [PetSex.MALE]: { Icon: GenderMale, className: "bg-primary text-white" },
  [PetSex.FEMALE]: { Icon: GenderFemale, className: "bg-cta text-ink" },
  [PetSex.UNKNOWN]: { Icon: Question, className: "bg-surface text-ink" },
};

export default function SexIcon({ sex }: { sex: PetSex }) {
  const { Icon, className } = STYLES[sex];
  return (
    <span
      role="img"
      aria-label={SEX_LABEL[sex]}
      title={SEX_LABEL[sex]}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink ${className}`}
    >
      <Icon aria-hidden={true} weight="bold" className="h-6 w-6" />
    </span>
  );
}
