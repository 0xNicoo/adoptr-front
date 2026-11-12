"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useRef, useState } from "react";
import { addFavoriteAction, removeFavoriteAction } from "@/actions/favorite";
import Button from "@/app/components/ui/button";
import PetCard from "@/app/components/ui/pet-card";
import { useToast } from "@/app/components/ui/toast";
import { AdoptionSummary } from "@/lib/api/models/adoption/adoption-summary";
import { Species } from "@/lib/api/models/adoption/species";
import { settleFavorite } from "@/lib/saved/favorite-call";
import { favoriteErrorMessage } from "@/lib/saved/favorite-errors";
import { needsReload, removeItem, restoreItem } from "@/lib/saved/saved-list";
import { SAVED_PATH, savedCountText, savedHref } from "@/lib/saved/saved-query";

export default function SavedGrid({
  initial,
  total: initialTotal,
  species,
  filters,
  pagination,
}: {
  initial: AdoptionSummary[];
  total: number;
  species: Species | null;
  filters: ReactNode;
  pagination: ReactNode;
}) {
  const [items, setItems] = useState(initial);
  const [total, setTotal] = useState(initialTotal);
  const pending = useRef(new Set<number>());
  const showToast = useToast();
  const router = useRouter();

  async function unsave(pet: AdoptionSummary) {
    if (pending.current.has(pet.id)) return;
    pending.current.add(pet.id);
    const result = await settleFavorite(removeFavoriteAction(pet.id));
    pending.current.delete(pet.id);
    if (!result.ok) {
      showToast(favoriteErrorMessage(result.code, pet.petName, "unsave"));
      return;
    }
    const { items: rest, removed } = removeItem(items, pet.id);
    if (!removed) return;
    setItems((current) => removeItem(current, pet.id).items);
    setTotal((current) => current - 1);
    if (needsReload(rest.length, total - 1)) router.refresh();
    showToast(`Quitaste a ${pet.petName} de guardadas`, {
      label: "Deshacer",
      onClick: () => void undo(pet, removed.index),
    });
  }

  async function undo(pet: AdoptionSummary, index: number) {
    const result = await settleFavorite(addFavoriteAction(pet.id));
    if (!result.ok) {
      showToast(favoriteErrorMessage(result.code, pet.petName, "save"));
      return;
    }
    setItems((current) => restoreItem(current, { item: pet, index }));
    setTotal((current) => current + 1);
  }

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="font-display text-[44px] leading-tight text-primary md:text-[52px]">Guardadas</h1>
          {total > 0 && <p className="mt-1 text-[17px] text-ink-soft">{savedCountText(total, species)}</p>}
        </div>
        {filters}
      </header>

      {items.length > 0 ? (
        <>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(340px,100%),1fr))] gap-6">
            {items.map((pet) => (
              <li key={pet.id} className="flex">
                <div className="w-full">
                  <PetCard pet={pet} favorite={{ saved: true, loggedIn: true }} onUnsaved={() => void unsave(pet)} />
                </div>
              </li>
            ))}
          </ul>
          {pagination}
        </>
      ) : total > 0 ? (
        <div className="rounded-card border-3 border-ink bg-surface p-8 text-center shadow-panel">
          <h2 className="font-display text-3xl text-primary">Esta página no existe</h2>
          <div className="mt-5 flex justify-center">
            <Button href={savedHref({ species, page: 1 })} variant="secondary">
              Ir a la primera página
            </Button>
          </div>
        </div>
      ) : (
        <div className="halftone rounded-card border-3 border-ink bg-accent-mustard p-8 text-center shadow-panel">
          <h2 className="font-display text-3xl">
            {species === Species.DOG
              ? "No guardaste perros"
              : species === Species.CAT
                ? "No guardaste gatos"
                : "Todavía no guardaste ninguna mascota"}
          </h2>
          <div className="mt-5 flex justify-center">
            {species ? (
              <Button href={SAVED_PATH} variant="secondary">
                Ver todas
              </Button>
            ) : (
              <Button href="/adoptions" variant="secondary">
                Ver mascotas en adopción
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
