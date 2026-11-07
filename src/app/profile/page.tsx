import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/api";
import { getMyProfile } from "@/lib/api/calls/profile";

type ProfileState = "has-profile" | "no-profile" | "unauthenticated" | "error";

async function loadState(): Promise<ProfileState> {
  try {
    return (await getMyProfile()) ? "has-profile" : "no-profile";
  } catch (error) {
    if (error instanceof ApiError && error.code === "UNAUTHENTICATED") {
      return "unauthenticated";
    }
    return "error";
  }
}

export default async function Profile() {
  const state = await loadState();

  // Quien postergó el alta llega acá desde «Mi perfil»: se lo lleva a completarla.
  // redirect() lanza una excepción interna de Next: se llama fuera del try.
  if (state === "no-profile") redirect("/profile/new");
  if (state === "unauthenticated") redirect("/login");

  // Mostrar el perfil es otra card: por ahora la página sigue siendo un placeholder.
  return (
    <div className="container mx-auto p-4">
      <h1>ProfilePage</h1>
      {state === "error" && (
        <p role="alert" className="mt-2 font-semibold text-danger">
          No pudimos cargar tu perfil. Probá de nuevo en unos minutos.
        </p>
      )}
    </div>
  );
}
