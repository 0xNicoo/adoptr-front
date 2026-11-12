import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Pagination from "@/app/components/ui/pagination";
import { ApiError } from "@/lib/api/api";
import { getFavorites } from "@/lib/api/calls/favorite";
import { AdoptionSummary } from "@/lib/api/models/adoption/adoption-summary";
import { Species } from "@/lib/api/models/adoption/species";
import { Page } from "@/lib/api/models/page/page";
import { SearchParams } from "@/lib/adoption/catalog-query";
import { SavedQuery, parseSavedQuery, savedHref } from "@/lib/saved/saved-query";
import SavedGrid from "./saved-grid";

export const metadata: Metadata = {
  title: "Guardadas — Adoptr",
};

type Loaded = { kind: "ok"; page: Page<AdoptionSummary> } | { kind: "unauthenticated" } | { kind: "error" };

async function load(query: SavedQuery): Promise<Loaded> {
  try {
    return { kind: "ok", page: await getFavorites(query) };
  } catch (error) {
    return error instanceof ApiError && error.code === "UNAUTHENTICATED" ? { kind: "unauthenticated" } : { kind: "error" };
  }
}

const pill =
  "inline-flex min-h-11 items-center justify-center rounded-full border-3 border-ink px-5 font-bold " +
  "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-teal";

function SpeciesFilter({ species }: { species: Species | null }) {
  const options = [
    { label: "Todas", value: null },
    { label: "Perros", value: Species.DOG },
    { label: "Gatos", value: Species.CAT },
  ];
  return (
    <nav aria-label="Filtrar guardadas">
      <ul className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const active = species === option.value;
          return (
            <li key={option.label}>
              <Link
                href={savedHref({ species: option.value, page: 1 })}
                aria-current={active ? "page" : undefined}
                className={`${pill} ${active ? "bg-ink text-surface" : "bg-surface"}`}
              >
                {option.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default async function SavedPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = parseSavedQuery(await searchParams);
  const result = await load(query);
  if (result.kind === "unauthenticated") redirect("/login");

  return (
    <div className="mx-auto flex max-w-[1560px] flex-col gap-8 px-4 pt-12 pb-16 md:px-6">
      {result.kind === "error" ? (
        <>
          <h1 className="font-display text-[44px] leading-tight text-primary md:text-[52px]">Guardadas</h1>
          <div role="alert" className="rounded-card border-3 border-ink bg-surface p-8 shadow-panel">
            <h2 className="font-display text-3xl text-primary">No pudimos cargar tus guardadas</h2>
            <p className="mt-3 text-[17px]">Probá de nuevo en unos minutos.</p>
          </div>
        </>
      ) : (
        <SavedGrid
          key={`${savedHref(query)}:${result.page.items.map((pet) => pet.id).join(",")}`}
          initial={result.page.items}
          total={result.page.totalItems}
          species={query.species}
          filters={<SpeciesFilter species={query.species} />}
          pagination={
            <Pagination
              page={query.page}
              totalPages={result.page.totalPages}
              href={(page) => savedHref({ ...query, page })}
            />
          }
        />
      )}
    </div>
  );
}
