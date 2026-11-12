export type Removed<T> = { item: T; index: number };

export function removeItem<T extends { id: number }>(
  items: T[],
  id: number,
): { items: T[]; removed: Removed<T> | null } {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return { items, removed: null };
  return { items: items.filter((_, i) => i !== index), removed: { item: items[index], index } };
}

export function restoreItem<T extends { id: number }>(items: T[], removed: Removed<T>): T[] {
  if (items.some((item) => item.id === removed.item.id)) return items;
  const index = Math.min(removed.index, items.length);
  return [...items.slice(0, index), removed.item, ...items.slice(index)];
}
