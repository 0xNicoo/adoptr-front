import { MapPinIcon } from "@heroicons/react/24/outline";
import { adoptedLabel, healthChips, knowMoreLabel, summaryLine } from "@/lib/adoption/labels";
import { AdoptionSummary } from "@/lib/api/models/adoption/adoption-summary";
import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import FavoriteButton, { type FavoriteState } from "@/app/components/adoption/favorite-button";
import OwnerCardMenu from "@/app/components/adoption/owner-card-menu";
import Badge from "./badge";
import Button from "./button";
import HealthChips from "./health-chips";
import PetArt from "./pet-art";
import SexIcon from "./sex-icon";

// Tarjeta de mascota para grilla (docs/arquitectura/sistema-visual.md#componentes-base): foto 4:3 con el
// estado, nombre con el sexo como ícono, ubicación a todo el ancho, tamaño y edad en una línea, salud en
// chips chicos y un único botón secundario. El botón es crema: con muchas tarjetas juntas, el naranja competiría consigo mismo.

export default function PetCard({
  pet,
  owner = false,
  favorite,
  onUnsaved,
}: {
  pet: AdoptionSummary;
  owner?: boolean;
  favorite?: FavoriteState;
  onUnsaved?: () => void;
}) {
  const adopted = pet.status === AdoptionStatus.ADOPTED;

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-card border-3 border-ink bg-surface shadow-card">
      <div className="relative">
        <PetArt id={pet.id} species={pet.species} photoUrl={pet.coverPhotoUrl}>
          <Badge variant={adopted ? "danger" : "surface"} className="px-3 py-1 text-[13px]">
            {adopted ? adoptedLabel(pet.sex) : "En adopción"}
          </Badge>
        </PetArt>
        {owner && (
          <div className="absolute top-3 right-3">
            <OwnerCardMenu target={{ adoptionId: pet.id, petName: pet.petName, sex: pet.sex, status: pet.status }} />
          </div>
        )}
        {!owner && favorite && (
          <div className="absolute top-3 right-3">
            <FavoriteButton adoptionId={pet.id} petName={pet.petName} initial={favorite} onUnsaved={onUnsaved} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 px-4 pt-4 pb-4">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="min-w-0 truncate font-display text-[28px] leading-tight text-primary">{pet.petName}</h3>
            <SexIcon sex={pet.sex} />
          </div>
          <p className="mt-0.5 text-[15px] font-semibold">{summaryLine(pet)}</p>
          <p className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-ink-soft">
            <MapPinIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {pet.locality.displayName}, {pet.province.name}
            </span>
          </p>
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
