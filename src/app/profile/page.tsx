import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Button from "@/app/components/ui/button";
import Pagination from "@/app/components/ui/pagination";
import PetCard from "@/app/components/ui/pet-card";
import { SearchParams } from "@/lib/adoption/catalog-query";
import { ApiError } from "@/lib/api/api";
import { getMyAdoptions } from "@/lib/api/calls/adoption";
import { getMyProfile } from "@/lib/api/calls/profile";
import { AdoptionSummary } from "@/lib/api/models/adoption/adoption-summary";
import { Page } from "@/lib/api/models/page/page";
import { Profile } from "@/lib/api/models/profile/profile";
import { myAdoptionsCountText } from "@/lib/profile/display";
import { MyAdoptionsQuery, myProfileHref, parseMyAdoptionsQuery } from "@/lib/profile/my-adoptions-query";
import ProfileCard from "./profile-card";

export const metadata: Metadata = {
  title: "Mi perfil — Adoptr",
};

type Loaded =
  | { state: "unauthenticated" | "no-profile" | "error" }
  | {
      state: "ok";
      profile: Profile;
      /** `null` si falló el listado: el perfil se muestra igual. */
      list: Page<AdoptionSummary> | null;
      counts: { available: number; adopted: number } | null;
    };

function isUnauthenticated(result: PromiseSettledResult<unknown>): boolean {
  return result.status === "rejected" && result.reason instanceof ApiError && result.reason.code === "UNAUTHENTICATED";
}

async function load(query: MyAdoptionsQuery): Promise<Loaded> {
  // Además de la página pedida, se cuenta el otro conjunto (todas o solo en adopción) con una página de 1,
  // para mostrar los dos contadores sea cual sea el filtro.
  const [profile, list, other] = await Promise.allSettled([
    getMyProfile(),
    getMyAdoptions(query),
    getMyAdoptions({ onlyAvailable: !query.onlyAvailable, page: 1 }, 1),
  ]);

  if ([profile, list, other].some(isUnauthenticated)) return { state: "unauthenticated" };
  if (profile.status === "rejected") return { state: "error" };
  if (!profile.value) return { state: "no-profile" };

  const page = list.status === "fulfilled" ? list.value : null;
  let counts = null;
  if (page && other.status === "fulfilled") {
    const available = query.onlyAvailable ? page.totalItems : other.value.totalItems;
    const total = query.onlyAvailable ? other.value.totalItems : page.totalItems;
    counts = { available, adopted: Math.max(total - available, 0) };
  }
  return { state: "ok", profile: profile.value, list: page, counts };
}

export default async function MyProfilePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = parseMyAdoptionsQuery(await searchParams);
  const result = await load(query);

  // Quien postergó el alta llega acá desde «Mi perfil»: se lo lleva a completarla.
  // redirect() lanza una excepción interna de Next: se llama fuera del try.
  if (result.state === "no-profile") redirect("/profile/new");
  if (result.state === "unauthenticated") redirect("/login");

  if (result.state !== "ok") {
    return (
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-16 md:px-6">
        <div role="alert" className="rounded-card border-3 border-ink bg-surface p-8 shadow-panel">
          <h1 className="font-display text-3xl text-primary">No pudimos cargar tu perfil</h1>
          <p className="mt-3 text-[17px]">Probá de nuevo en unos minutos.</p>
        </div>
      </div>
    );
  }

  const { profile, list, counts } = result;

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-12 pb-16 md:px-6 lg:grid-cols-[300px_1fr] lg:items-start">
      <ProfileCard profile={profile} counts={counts} />

      <section aria-labelledby="my-adoptions-title" className="flex min-w-0 flex-col gap-7">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="my-adoptions-title" className="font-display text-[42px] leading-tight text-primary">
              Mis publicaciones
            </h2>
            {list && list.totalItems > 0 && (
              <p className="mt-1 text-[17px] text-ink-soft">{myAdoptionsCountText(list.totalItems, query.onlyAvailable)}</p>
            )}
          </div>
          <Button href="/adoptions/new" variant="cta">
            Publicar una mascota
          </Button>
        </header>

        <StatusFilter onlyAvailable={query.onlyAvailable} />

        {!list ? (
          <div role="alert" className="rounded-card border-3 border-ink bg-surface p-8 shadow-panel">
            <h3 className="font-display text-3xl text-primary">No pudimos cargar tus publicaciones</h3>
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
            <Pagination
              page={query.page}
              totalPages={list.totalPages}
              href={(page) => myProfileHref({ ...query, page })}
            />
          </>
        ) : (
          <EmptyState query={query} totalItems={list.totalItems} />
        )}
      </section>
    </div>
  );
}

const pill =
  "inline-flex min-h-11 items-center justify-center rounded-full border-3 border-ink px-5 font-bold " +
  "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-teal";

function StatusFilter({ onlyAvailable }: { onlyAvailable: boolean }) {
  const options = [
    { label: "Todas", active: !onlyAvailable, href: myProfileHref({ onlyAvailable: false, page: 1 }) },
    { label: "En adopción", active: onlyAvailable, href: myProfileHref({ onlyAvailable: true, page: 1 }) },
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

function EmptyState({ query, totalItems }: { query: MyAdoptionsQuery; totalItems: number }) {
  if (totalItems > 0) {
    return (
      <div className="rounded-card border-3 border-ink bg-surface p-8 text-center shadow-panel">
        <h3 className="font-display text-3xl text-primary">Esta página no existe</h3>
        <div className="mt-5 flex justify-center">
          <Button href={myProfileHref({ ...query, page: 1 })} variant="secondary">
            Ir a la primera página
          </Button>
        </div>
      </div>
    );
  }
  if (query.onlyAvailable) {
    return (
      <div className="halftone rounded-card border-3 border-ink bg-accent-mustard p-8 text-center shadow-panel">
        <h3 className="font-display text-3xl">No tenés mascotas en adopción en este momento</h3>
        <div className="mt-5 flex justify-center">
          <Button href={myProfileHref({ onlyAvailable: false, page: 1 })} variant="secondary">
            Ver todas
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="halftone rounded-card border-3 border-ink bg-accent-mustard p-8 text-center shadow-panel">
      <h3 className="font-display text-3xl">Todavía no publicaste ninguna mascota</h3>
      <p className="mt-3 text-[17px]">Cuando publiques una, la vas a ver acá.</p>
    </div>
  );
}
