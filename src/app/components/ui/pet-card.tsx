import { MapPinIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { healthChips, summaryLine } from "@/lib/adoption/labels";
import { AdoptionSummary } from "@/lib/api/models/adoption/adoption-summary";
import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import Badge from "./badge";
import HealthIcons from "./health-icons";
import PetArt from "./pet-art";
import SexIcon from "./sex-icon";

// Tarjeta de mascota para grilla (docs/arquitectura/sistema-visual.md#componentes-base), compacta:
// foto 4:3, nombre con el sexo como ícono, salud en íconos, datos y localidad. Toda la tarjeta lleva
// al detalle: el link es el nombre y se estira sobre la tarjeta (`after:inset-0`), así el lector de
// pantalla anuncia un solo link con el nombre. Los íconos quedan por encima para que se lea su tooltip.

export default function PetCard({ pet }: { pet: AdoptionSummary }) {
  const adopted = pet.status === AdoptionStatus.ADOPTED;

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-card border-3 border-ink bg-surface shadow-card transition-transform duration-100 has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-accent-teal hover:-translate-y-1">
      <PetArt id={pet.id} species={pet.species} photoUrl={pet.coverPhotoUrl}>
        <Badge variant="surface" className="px-3 py-1 text-[13px]">
          {adopted ? "Adoptado" : "En adopción"}
        </Badge>
      </PetArt>
      <div className="flex flex-col gap-1.5 px-4 pt-3 pb-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex min-w-0 items-center gap-1.5 font-display text-[26px] leading-tight text-primary">
            <Link
              href={`/adoptions/${pet.id}`}
              className="truncate outline-none after:absolute after:inset-0 after:content-['']"
            >
              {pet.petName}
            </Link>
            <SexIcon sex={pet.sex} className="relative z-10" />
          </h3>
          <HealthIcons chips={healthChips(pet)} className="relative z-10" />
        </div>
        <p className="text-[15px] font-semibold">{summaryLine(pet)}</p>
        <p className="flex min-w-0 items-center gap-1.5 text-sm text-ink-soft">
          <MapPinIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {pet.locality.displayName}, {pet.province.name}
          </span>
        </p>
      </div>
    </article>
  );
}
