"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { type ReactNode, type TouchEvent, useRef, useState } from "react";
import PetArt from "@/app/components/ui/pet-art";
import { AdoptionPhoto } from "@/lib/api/models/adoption/adoption-photo";
import { Species } from "@/lib/api/models/adoption/species";

const SWIPE_MIN_PX = 40;

const arrowClass =
  "absolute top-1/2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-3 border-ink bg-surface shadow-hard " +
  "hover:bg-accent-mustard focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal";

/** Foto grande con flechas, deslizamiento y miniaturas. Sin fotos, la ilustración de siempre. */
export default function PhotoGallery({
  id,
  species,
  petName,
  photos,
  children,
}: {
  id: number;
  species: Species;
  petName: string;
  photos: AdoptionPhoto[];
  /** Va sobre la foto grande (por ejemplo, el badge de estado). */
  children?: ReactNode;
}) {
  const [selected, setSelected] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const photo = photos[selected];
  const several = photos.length > 1;

  function move(delta: number) {
    setSelected((current) => (current + delta + photos.length) % photos.length);
  }

  function endSwipe(event: TouchEvent) {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) >= SWIPE_MIN_PX) move(distance < 0 ? 1 : -1);
  }

  return (
    <div className="flex flex-col gap-5 self-start">
      <div
        className={`relative ${several ? "touch-pan-y" : ""}`}
        onTouchStart={several ? (event) => (touchStartX.current = event.touches[0].clientX) : undefined}
        onTouchEnd={several ? endSwipe : undefined}
      >
        <PetArt
          id={id}
          species={species}
          size="large"
          photoUrl={photo?.url}
          photoAlt={photo ? `Foto ${selected + 1} de ${photos.length} de ${petName}` : ""}
        >
          {children}
        </PetArt>

        {several && (
          <>
            <button type="button" onClick={() => move(-1)} aria-label="Foto anterior" className={`${arrowClass} left-3`}>
              <ChevronLeftIcon aria-hidden="true" className="h-5 w-5 stroke-[3]" />
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Foto siguiente" className={`${arrowClass} right-3`}>
              <ChevronRightIcon aria-hidden="true" className="h-5 w-5 stroke-[3]" />
            </button>
            <p
              aria-live="polite"
              className="absolute right-3 bottom-3 rounded-full border-2 border-ink bg-surface px-3 py-0.5 text-sm font-bold"
            >
              <span className="sr-only">Foto </span>
              {selected + 1}
              <span aria-hidden="true"> / </span>
              <span className="sr-only"> de </span>
              {photos.length}
            </p>
          </>
        )}
      </div>

      {several && (
        <ul aria-label="Elegir foto" className="grid grid-cols-5 gap-2.5 sm:gap-3">
          {photos.map((thumbnail, index) => {
            const current = index === selected;
            return (
              <li key={thumbnail.id}>
                <button
                  type="button"
                  onClick={() => setSelected(index)}
                  aria-label={`Ver foto ${index + 1} de ${photos.length}`}
                  aria-current={current ? "true" : undefined}
                  className={
                    "group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-field border-3 border-ink bg-disabled " +
                    "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-teal " +
                    (current ? "ring-3 ring-primary ring-offset-2 ring-offset-paper" : "")
                  }
                >
                  <Image
                    src={thumbnail.url}
                    alt=""
                    fill
                    unoptimized
                    className={`object-cover ${current ? "" : "opacity-65 group-hover:opacity-100 group-focus-visible:opacity-100"}`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
