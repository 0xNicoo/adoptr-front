import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ProfileForm from "@/app/profile/new/profile-form";
import { ApiError } from "@/lib/api/api";
import { getProvinces } from "@/lib/api/calls/location";
import { getGooglePhotoUrl, getMyProfile } from "@/lib/api/calls/profile";
import { Province } from "@/lib/api/models/locality/province";
import { Profile } from "@/lib/api/models/profile/profile";

export const metadata: Metadata = {
  title: "Editar perfil — Adoptr",
};

type Loaded =
  | { kind: "ok"; profile: Profile; provinces: Province[]; googlePhotoUrl: string | null }
  | { kind: "no-profile" }
  | { kind: "unauthenticated" }
  | { kind: "error" };

async function load(): Promise<Loaded> {
  try {
    const [profile, provinces, googlePhotoUrl] = await Promise.all([
      getMyProfile(),
      getProvinces(),
      getGooglePhotoUrl().catch(() => null),
    ]);
    if (!profile) return { kind: "no-profile" };
    return { kind: "ok", profile, provinces, googlePhotoUrl };
  } catch (error) {
    if (error instanceof ApiError && error.code === "UNAUTHENTICATED") {
      return { kind: "unauthenticated" };
    }
    return { kind: "error" };
  }
}

export default async function EditProfilePage() {
  const result = await load();

  if (result.kind === "unauthenticated") redirect("/login");
  if (result.kind === "no-profile") redirect("/profile/new");

  return (
    <div className="halftone min-h-[calc(100vh-5rem)] bg-paper px-4 pt-12 pb-16">
      {result.kind === "ok" ? (
        <ProfileForm
          provinces={result.provinces}
          googlePhotoUrl={result.googlePhotoUrl}
          editing={{ profile: result.profile }}
        />
      ) : (
        <div role="alert" className="mx-auto max-w-2xl rounded-card border-3 border-ink bg-surface p-8 shadow-panel">
          <h1 className="font-display text-4xl text-primary">No pudimos cargar tu perfil</h1>
          <p className="mt-3 text-[17px]">Probá de nuevo en unos minutos.</p>
        </div>
      )}
    </div>
  );
}
