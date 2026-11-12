const UNKNOWN_ERROR_CODE = "UNKNOWN_ERROR";

export type FavoriteResult = { ok: true } | { ok: false; code: string };

export async function settleFavorite(call: Promise<FavoriteResult | undefined>): Promise<FavoriteResult> {
  try {
    return (await call) ?? { ok: false, code: UNKNOWN_ERROR_CODE };
  } catch {
    return { ok: false, code: UNKNOWN_ERROR_CODE };
  }
}
