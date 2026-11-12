export async function viewerFavoriteIds(load: () => Promise<number[]>, loggedIn: boolean): Promise<Set<number>> {
  if (!loggedIn) return new Set();
  try {
    return new Set(await load());
  } catch {
    return new Set();
  }
}
