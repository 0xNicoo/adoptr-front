import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import ProfileAdoptions from "@/app/components/profile/profile-adoptions";
import ProfileCard from "@/app/components/profile/profile-card";
import { SearchParams } from "@/lib/adoption/catalog-query";
import { getProfileAdoptions } from "@/lib/api/calls/adoption";
import { getMyProfile, getPublicProfile } from "@/lib/api/calls/profile";
import { PublicProfile } from "@/lib/api/models/profile/public-profile";
import { getAccessToken } from "@/lib/auth/session";
import { parseProfileId, profileDisplayName, profileShortName } from "@/lib/profile/display";
import { parseProfileAdoptionsQuery } from "@/lib/profile/profile-adoptions-query";

// Perfil de cualquier usuario: público, sin login. Si quien mira es el dueño, se lo lleva a «Mi perfil».

type Params = Promise<{ id: string }>;

type Loaded = { kind: "ok"; profile: PublicProfile } | { kind: "not-found" } | { kind: "error" };

/** Con `cache`, la página y `generateMetadata` comparten la consulta. */
const loadProfile = cache(async (rawId: string): Promise<Loaded> => {
  const id = parseProfileId(rawId);
  if (id === null) return { kind: "not-found" };
  try {
    const profile = await getPublicProfile(id);
    return profile ? { kind: "ok", profile } : { kind: "not-found" };
  } catch {
    return { kind: "error" };
  }
});

/** Id del perfil propio si hay sesión válida; cualquier falla cuenta como «no es el dueño». */
async function myProfileId(): Promise<number | null> {
  if (!(await getAccessToken())) return null;
  try {
    return (await getMyProfile())?.id ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const result = await loadProfile((await params).id);
  return { title: result.kind === "ok" ? `${profileDisplayName(result.profile)} — Adoptr` : "Perfil — Adoptr" };
}

export default async function ProfilePage({ params, searchParams }: { params: Params; searchParams: Promise<SearchParams> }) {
  const rawId = (await params).id;
  const query = parseProfileAdoptionsQuery(await searchParams);
  const id = parseProfileId(rawId);

  const [result, ownId, list] = await Promise.all([
    loadProfile(rawId),
    myProfileId(),
    id === null ? null : getProfileAdoptions(id, query).catch(() => null),
  ]);

  // notFound() y redirect() lanzan excepciones internas de Next: van fuera de los try.
  if (result.kind === "not-found") notFound();
  if (ownId !== null && ownId === id) redirect("/profile");

  if (result.kind === "error") {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-16 md:px-6">
        <div role="alert" className="rounded-card border-3 border-ink bg-surface p-8 shadow-panel">
          <h1 className="font-display text-3xl text-primary">No pudimos cargar este perfil</h1>
          <p className="mt-3 text-[17px]">Probá de nuevo en unos minutos.</p>
        </div>
      </div>
    );
  }

  const { profile } = result;

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 pb-16 md:px-6 lg:grid-cols-[380px_1fr] lg:items-start">
      <ProfileCard profile={profile} />
      <ProfileAdoptions
        basePath={`/profiles/${profile.id}`}
        query={query}
        list={list}
        texts={{
          title: `Publicaciones de ${profileShortName(profile)}`,
          loadError: "No pudimos cargar sus publicaciones",
          emptyAll: "Todavía no publicó ninguna mascota",
          emptyAvailable: "No tiene mascotas en adopción en este momento",
        }}
      />
    </div>
  );
}
