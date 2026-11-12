"use client";

import { Heart } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useState } from "react";
import { addFavoriteAction, removeFavoriteAction } from "@/actions/favorite";
import { useToast } from "@/app/components/ui/toast";
import { favoriteErrorMessage } from "@/lib/saved/favorite-errors";

export type FavoriteState = { saved: boolean; loggedIn: boolean };

const circle =
  "flex size-11 shrink-0 items-center justify-center rounded-full border-3 border-ink bg-surface shadow-hard " +
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal";

export default function FavoriteButton({
  adoptionId,
  petName,
  initial,
  onUnsaved,
}: {
  adoptionId: number;
  petName: string;
  initial: FavoriteState;
  onUnsaved?: () => void;
}) {
  const [saved, setSaved] = useState(initial.saved);
  const [pending, setPending] = useState(false);
  const showToast = useToast();

  if (!initial.loggedIn) {
    return (
      <Link href="/login" aria-label={`Guardar a ${petName}`} className={circle}>
        <Heart aria-hidden={true} weight="bold" className="h-5 w-5 text-ink" />
      </Link>
    );
  }

  async function toggle() {
    if (pending) return;
    if (saved && onUnsaved) {
      onUnsaved();
      return;
    }
    const next = !saved;
    setSaved(next);
    setPending(true);
    const result = next ? await addFavoriteAction(adoptionId) : await removeFavoriteAction(adoptionId);
    setPending(false);
    if (!result.ok) {
      setSaved(!next);
      showToast(favoriteErrorMessage(result.code, petName, next ? "save" : "unsave"));
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? `Quitar a ${petName} de guardadas` : `Guardar a ${petName}`}
      className={`${circle} cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none`}
    >
      <Heart
        aria-hidden={true}
        weight={saved ? "fill" : "bold"}
        className={`h-5 w-5 ${saved ? "text-danger" : "text-ink"}`}
      />
    </button>
  );
}
