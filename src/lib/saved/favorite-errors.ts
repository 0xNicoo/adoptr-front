export type FavoriteAction = "save" | "unsave";

export function favoriteErrorMessage(code: string, petName: string, action: FavoriteAction): string {
  if (code === "FAVORITE_OWN_PUBLICATION") return "Es tu publicación: no hace falta guardarla.";
  return action === "save"
    ? `No pudimos guardar a ${petName}. Probá de nuevo.`
    : `No pudimos quitar a ${petName}. Probá de nuevo.`;
}
