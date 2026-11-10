import { adoptedLabel, healthChips, knowMoreLabel, summaryLine } from "@/lib/adoption/labels";
import { AdoptionSummary } from "@/lib/api/models/adoption/adoption-summary";
import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import Badge from "./badge";
import Button from "./button";
import HealthChips from "./health-chips";
import PetArt from "./pet-art";
import SexIcon from "./sex-icon";

// Tarjeta de mascota para grilla (docs/arquitectura/sistema-visual.md#componentes-base): foto 4:3 con el
// estado, nombre con el sexo como ícono, tamaño y edad en una línea, salud en chips chicos y un único botón
// secundario. El botón es crema: con muchas tarjetas juntas, el naranja competiría consigo mismo.

export default function PetCard({ pet }: { pet: AdoptionSummary }) {
  const adopted = pet.status === AdoptionStatus.ADOPTED;

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-card border-3 border-ink bg-surface shadow-card">
      <PetArt id={pet.id} species={pet.species} photoUrl={pet.coverPhotoUrl}>
        <Badge variant={adopted ? "danger" : "surface"} className="px-3 py-1 text-[13px]">
          {adopted ? adoptedLabel(pet.sex) : "En adopción"}
        </Badge>
      </PetArt>
      <div className="flex flex-1 flex-col gap-3 px-5 pt-4 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-[28px] leading-tight text-primary">{pet.petName}</h3>
            <p className="text-[15px] font-semibold">{summaryLine(pet)}</p>
          </div>
          <SexIcon sex={pet.sex} />
        </div>
        <HealthChips chips={healthChips(pet)} size="xs" />
        <div className="mt-auto pt-1">
          <Button href={`/adoptions/${pet.id}`} variant="secondary" className="w-full">
            {knowMoreLabel(pet.sex, adopted)}
            <span className="sr-only">: {pet.petName}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
