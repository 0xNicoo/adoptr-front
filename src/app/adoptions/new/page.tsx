import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/api";
import { getProvinces } from "@/lib/api/calls/location";
import { getMyProfile } from "@/lib/api/calls/profile";
import { Province } from "@/lib/api/models/locality/province";
import { Profile } from "@/lib/api/models/profile/profile";
import AdoptionForm from "./adoption-form";

export const metadata: Metadata = {
  title: "Publicar una mascota — Adoptr",
};

type PageState =
  | { kind: "form"; provinces: Province[]; profile: Profile }
  | { kind: "no-profile" }
  | { kind: "unauthenticated" }
  | { kind: "error" };

async function loadState(): Promise<PageState> {
  try {
    const profile = await getMyProfile();
    if (!profile) return { kind: "no-profile" };
    return { kind: "form", provinces: await getProvinces(), profile };
  } catch (error) {
    if (error instanceof ApiError && error.code === "UNAUTHENTICATED") {
      return { kind: "unauthenticated" };
    }
    return { kind: "error" };
  }
}

/** Publicar exige login y perfil (decisión de producto, dominio-y-alcance.md). */
export default async function NewAdoptionPage() {
  const state = await loadState();

  // redirect() lanza una excepción interna de Next: se llama fuera del try.
  if (state.kind === "unauthenticated") redirect("/login");
  if (state.kind === "no-profile") redirect("/profile/new");

  return (
    <div className="halftone min-h-[calc(100vh-5rem)] bg-paper px-4 pt-12 pb-16">
      {state.kind === "form" ? (
        <AdoptionForm
          provinces={state.provinces}
          initialLocation={{ provinceId: state.profile.province.id, locality: state.profile.locality }}
        />
      ) : (
        <div role="alert" className="mx-auto max-w-2xl rounded-card border-3 border-ink bg-surface p-8 shadow-panel">
          <h1 className="font-display text-4xl text-primary">No pudimos cargar el formulario</h1>
          <p className="mt-3 text-[17px]">Probá de nuevo en unos minutos.</p>
        </div>
      )}
    </div>
  );
}
