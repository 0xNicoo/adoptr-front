import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ProfileAdoptions from "@/app/components/profile/profile-adoptions";
import ProfileCard from "@/app/components/profile/profile-card";
import Button from "@/app/components/ui/button";
import { SearchParams } from "@/lib/adoption/catalog-query";
import { ApiError } from "@/lib/api/api";
import { getMyAdoptions } from "@/lib/api/calls/adoption";
import { getMyProfile } from "@/lib/api/calls/profile";
import { AdoptionSummary } from "@/lib/api/models/adoption/adoption-summary";
import { Page } from "@/lib/api/models/page/page";
import { Profile } from "@/lib/api/models/profile/profile";
import {
  MY_PROFILE_PATH,
  ProfileAdoptionsQuery,
  parseProfileAdoptionsQuery,
} from "@/lib/profile/profile-adoptions-query";

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
    };

function isUnauthenticated(result: PromiseSettledResult<unknown>): boolean {
  return result.status === "rejected" && result.reason instanceof ApiError && result.reason.code === "UNAUTHENTICATED";
}

async function load(query: ProfileAdoptionsQuery): Promise<Loaded> {
  const [profile, list] = await Promise.allSettled([getMyProfile(), getMyAdoptions(query)]);

  if ([profile, list].some(isUnauthenticated)) return { state: "unauthenticated" };
  if (profile.status === "rejected") return { state: "error" };
  if (!profile.value) return { state: "no-profile" };
  return { state: "ok", profile: profile.value, list: list.status === "fulfilled" ? list.value : null };
}

export default async function MyProfilePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = parseProfileAdoptionsQuery(await searchParams);
  const result = await load(query);

  // Quien postergó el alta llega acá desde «Mi perfil»: se lo lleva a completarla.
  // redirect() lanza una excepción interna de Next: se llama fuera del try.
  if (result.state === "no-profile") redirect("/profile/new");
  if (result.state === "unauthenticated") redirect("/login");

  if (result.state !== "ok") {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-16 md:px-6">
        <div role="alert" className="rounded-card border-3 border-ink bg-surface p-8 shadow-panel">
          <h1 className="font-display text-3xl text-primary">No pudimos cargar tu perfil</h1>
          <p className="mt-3 text-[17px]">Probá de nuevo en unos minutos.</p>
        </div>
      </div>
    );
  }

  const { profile, list } = result;

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 pb-16 md:px-6 lg:grid-cols-[380px_1fr] lg:items-start">
      <ProfileCard profile={profile} />
      <ProfileAdoptions
        owner
        basePath={MY_PROFILE_PATH}
        query={query}
        list={list}
        texts={{
          title: "Mis publicaciones",
          loadError: "No pudimos cargar tus publicaciones",
          emptyAll: "Todavía no publicaste ninguna mascota",
          emptyAllHint: "Cuando publiques una, la vas a ver acá.",
          emptyAvailable: "No tenés mascotas en adopción en este momento",
          emptyAdopted: "Ninguna de tus mascotas fue adoptada todavía",
        }}
        action={
          <Button href="/adoptions/new" variant="cta">
            Publicar una mascota
          </Button>
        }
      />
    </div>
  );
}
