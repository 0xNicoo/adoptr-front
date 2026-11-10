import type { Metadata } from "next";
import Button from "@/app/components/ui/button";
import PetCard from "@/app/components/ui/pet-card";
import { CatalogQuery, SearchParams, catalogHref, parseCatalogQuery } from "@/lib/adoption/catalog-query";
import { searchAdoptions } from "@/lib/api/calls/adoption";
import { getProvinces } from "@/lib/api/calls/location";
import { AdoptionSummary } from "@/lib/api/models/adoption/adoption-summary";
import { Species } from "@/lib/api/models/adoption/species";
import { Locality } from "@/lib/api/models/locality/locality";
import { Page } from "@/lib/api/models/page/page";
import { Province } from "@/lib/api/models/locality/province";
import Pagination from "@/app/components/ui/pagination";
import CatalogFilters from "./catalog-filters";

export const metadata: Metadata = {
  title: "Mascotas en adopción — Adoptr",
};

type Loaded = { ok: true; page: Page<AdoptionSummary>; provinces: Province[] } | { ok: false };

async function load(query: CatalogQuery): Promise<Loaded> {
  try {
    const [page, provinces] = await Promise.all([searchAdoptions(query), getProvinces()]);
    return { ok: true, page, provinces };
  } catch {
    return { ok: false };
  }
}

function countText(total: number, species?: Species): string {
  const [one, many] =
    species === Species.DOG ? ["perro", "perros"] : species === Species.CAT ? ["gato", "gatos"] : ["mascota", "perros y gatos"];
  return total === 1 ? `1 ${one} esperando una familia` : `${total} ${many} esperando una familia`;
}

function selectedLocality(localityId: number | undefined, items: AdoptionSummary[]): Locality | null {
  if (!localityId) return null;
  return (
    items.find((item) => item.locality.id === localityId)?.locality ?? {
      id: localityId,
      name: "Localidad elegida",
      displayName: "Localidad elegida",
    }
  );
}

export default async function AdoptionsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = parseCatalogQuery(await searchParams);
  const result = await load(query);
  const hasFilters = Object.keys(query.filters).length > 0;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pt-12 pb-16 md:px-6">
      <header>
        <h1 className="font-display text-[44px] leading-tight text-primary md:text-[42px]">Encontrá a tu compañero</h1>
        {result.ok && result.page.totalItems > 0 && (
          <p className="mt-1 text-[17px] text-ink-soft">{countText(result.page.totalItems, query.filters.species)}</p>
        )}
      </header>

      {!result.ok ? (
        <div role="alert" className="rounded-card border-3 border-ink bg-surface p-8 shadow-panel">
          <h2 className="font-display text-3xl text-primary">No pudimos cargar el catálogo</h2>
          <p className="mt-3 text-[17px]">Probá de nuevo en unos minutos.</p>
        </div>
      ) : (
        <>
          <CatalogFilters
            key={catalogHref(query)}
            provinces={result.provinces}
            initial={query.filters}
            initialLocality={selectedLocality(query.filters.localityId, result.page.items)}
          />

          {result.page.items.length > 0 ? (
            <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {result.page.items.map((pet) => (
                <li key={pet.id} className="flex">
                  <div className="w-full">
                    <PetCard pet={pet} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState query={query} hasFilters={hasFilters} totalItems={result.page.totalItems} />
          )}

          <Pagination
            page={query.page}
            totalPages={result.page.totalPages}
            href={(page) => catalogHref({ ...query, page })}
          />
        </>
      )}
    </div>
  );
}

function EmptyState({ query, hasFilters, totalItems }: { query: CatalogQuery; hasFilters: boolean; totalItems: number }) {
  if (totalItems > 0) {
    return (
      <div className="rounded-card border-3 border-ink bg-surface p-8 text-center shadow-panel">
        <h2 className="font-display text-3xl text-primary">Esta página no existe</h2>
        <div className="mt-5 flex justify-center">
          <Button href={catalogHref({ ...query, page: 1 })} variant="secondary">
            Ir a la primera página
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="halftone rounded-card border-3 border-ink bg-accent-mustard p-8 text-center shadow-panel">
      <h2 className="font-display text-3xl">
        {hasFilters ? "No encontramos mascotas con esos filtros" : "Todavía no hay mascotas publicadas"}
      </h2>
      <div className="mt-5 flex justify-center">
        {hasFilters ? (
          <Button href="/adoptions" variant="secondary">
            Limpiar filtros
          </Button>
        ) : (
          <Button href="/adoptions/new" variant="secondary">
            Publicar una mascota
          </Button>
        )}
      </div>
    </div>
  );
}
