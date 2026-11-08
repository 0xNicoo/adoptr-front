import { MapPinIcon } from "@heroicons/react/24/outline";
import { healthChips, knowMoreLabel, summaryLine } from "@/lib/adoption/labels";
import { AdoptionSummary } from "@/lib/api/models/adoption/adoption-summary";
import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import Badge from "./badge";
import Button from "./button";
import HealthChips from "./health-chips";
import PetArt from "./pet-art";

// Tarjeta de mascota para grilla (docs/arquitectura/sistema-visual.md#componentes-base).
// El botón es crema: con muchas tarjetas juntas, el naranja competiría consigo mismo.

export default function PetCard({ pet }: { pet: AdoptionSummary }) {
  const adopted = pet.status === AdoptionStatus.ADOPTED;

  return (
    <article className="flex flex-col overflow-hidden rounded-card border-3 border-ink bg-surface shadow-card">
      <PetArt id={pet.id} species={pet.species}>
        <Badge variant="surface" className="px-3 py-1 text-[13px]">
          {adopted ? "Adoptado" : "En adopción"}
        </Badge>
      </PetArt>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-[28px] leading-tight text-primary">{pet.petName}</h3>
        <p className="text-[15px] font-semibold">{summaryLine(pet)}</p>
        <p className="flex items-center gap-1.5 text-[15px] text-ink-soft">
          <MapPinIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
          {pet.locality.displayName}, {pet.province.name}
        </p>
        <HealthChips chips={healthChips(pet)} />
        <div className="mt-auto pt-2">
          <Button href={`/adoptions/${pet.id}`} variant="secondary" className="w-full">
            {knowMoreLabel(pet.sex)}
            <span className="sr-only">: {pet.petName}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
