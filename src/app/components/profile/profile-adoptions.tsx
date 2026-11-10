import Link from "next/link";
import type { ReactNode } from "react";
import Button from "@/app/components/ui/button";
import Pagination from "@/app/components/ui/pagination";
import PetCard from "@/app/components/ui/pet-card";
import { AdoptionSummary } from "@/lib/api/models/adoption/adoption-summary";
import { Page } from "@/lib/api/models/page/page";
import { profileAdoptionsCountText } from "@/lib/profile/display";
import { ProfileAdoptionsQuery, profileAdoptionsHref } from "@/lib/profile/profile-adoptions-query";

// Publicaciones de un perfil: filtro «Todas / En adopción», grilla, paginación y estados vacío y de error.
// Lo usan «Mi perfil» y el perfil de otra persona; cambian la ruta, los textos y la acción del encabezado.

export interface ProfileAdoptionsTexts {
  title: string;
  loadError: string;
  /** Sin ninguna publicación. */
  emptyAll: string;
  emptyAllHint?: string;
  /** Con el filtro «En adopción», sin resultados. */
  emptyAvailable: string;
}

export default function ProfileAdoptions({
  basePath,
  query,
  list,
  texts,
  action,
}: {
  /** Ruta de la página del perfil, para los links del filtro y la paginación. */
  basePath: string;
  query: ProfileAdoptionsQuery;
  /** `null` si no se pudo cargar. */
  list: Page<AdoptionSummary> | null;
  texts: ProfileAdoptionsTexts;
  action?: ReactNode;
}) {
  const href = (target: ProfileAdoptionsQuery) => profileAdoptionsHref(basePath, target);

  return (
    <section aria-labelledby="profile-adoptions-title" className="flex min-w-0 flex-col gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="profile-adoptions-title" className="font-display text-[42px] leading-tight text-primary">
            {texts.title}
          </h2>
          {list && list.totalItems > 0 && (
            <p className="mt-1 text-[17px] text-ink-soft">{profileAdoptionsCountText(list.totalItems, query.onlyAvailable)}</p>
          )}
        </div>
        {action}
      </header>

      <StatusFilter onlyAvailable={query.onlyAvailable} href={href} />

      {!list ? (
        <div role="alert" className="rounded-card border-3 border-ink bg-surface p-8 shadow-panel">
          <h3 className="font-display text-3xl text-primary">{texts.loadError}</h3>
          <p className="mt-3 text-[17px]">Probá de nuevo en unos minutos.</p>
        </div>
      ) : list.items.length > 0 ? (
        <>
          <ul className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
            {list.items.map((pet) => (
              <li key={pet.id} className="flex">
                <div className="w-full">
                  <PetCard pet={pet} />
                </div>
              </li>
            ))}
          </ul>
          <Pagination page={query.page} totalPages={list.totalPages} href={(page) => href({ ...query, page })} />
        </>
      ) : (
        <EmptyState query={query} totalItems={list.totalItems} texts={texts} href={href} />
      )}
    </section>
  );
}

const pill =
  "inline-flex min-h-11 items-center justify-center rounded-full border-3 border-ink px-5 font-bold " +
  "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-teal";

function StatusFilter({
  onlyAvailable,
  href,
}: {
  onlyAvailable: boolean;
  href: (query: ProfileAdoptionsQuery) => string;
}) {
  const options = [
    { label: "Todas", active: !onlyAvailable, href: href({ onlyAvailable: false, page: 1 }) },
    { label: "En adopción", active: onlyAvailable, href: href({ onlyAvailable: true, page: 1 }) },
  ];
  return (
    <nav aria-label="Filtrar publicaciones">
      <ul className="flex flex-wrap gap-2.5">
        {options.map((option) => (
          <li key={option.label}>
            <Link
              href={option.href}
              aria-current={option.active ? "page" : undefined}
              className={`${pill} ${option.active ? "bg-ink text-surface" : "bg-surface"}`}
            >
              {option.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function EmptyState({
  query,
  totalItems,
  texts,
  href,
}: {
  query: ProfileAdoptionsQuery;
  totalItems: number;
  texts: ProfileAdoptionsTexts;
  href: (query: ProfileAdoptionsQuery) => string;
}) {
  if (totalItems > 0) {
    return (
      <div className="rounded-card border-3 border-ink bg-surface p-8 text-center shadow-panel">
        <h3 className="font-display text-3xl text-primary">Esta página no existe</h3>
        <div className="mt-5 flex justify-center">
          <Button href={href({ ...query, page: 1 })} variant="secondary">
            Ir a la primera página
          </Button>
        </div>
      </div>
    );
  }
  if (query.onlyAvailable) {
    return (
      <div className="halftone rounded-card border-3 border-ink bg-accent-mustard p-8 text-center shadow-panel">
        <h3 className="font-display text-3xl">{texts.emptyAvailable}</h3>
        <div className="mt-5 flex justify-center">
          <Button href={href({ onlyAvailable: false, page: 1 })} variant="secondary">
            Ver todas
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="halftone rounded-card border-3 border-ink bg-accent-mustard p-8 text-center shadow-panel">
      <h3 className="font-display text-3xl">{texts.emptyAll}</h3>
      {texts.emptyAllHint && <p className="mt-3 text-[17px]">{texts.emptyAllHint}</p>}
    </div>
  );
}
