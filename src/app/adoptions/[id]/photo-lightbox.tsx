"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { type KeyboardEvent, type TouchEvent, useRef } from "react";
import { swipeDelta } from "@/lib/adoption/gallery";
import { AdoptionPhoto } from "@/lib/api/models/adoption/adoption-photo";

const roundButton =
  "flex size-12 cursor-pointer items-center justify-center rounded-full border-3 border-ink bg-surface shadow-hard " +
  "hover:bg-accent-mustard focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal";

export default function PhotoLightbox({
  open,
  photos,
  selected,
  petName,
  onSelect,
  onMove,
  onClose,
}: {
  open: boolean;
  photos: AdoptionPhoto[];
  selected: number;
  petName: string;
  onSelect: (index: number) => void;
  onMove: (delta: number) => void;
  onClose: () => void;
}) {
  const touchStartX = useRef<number | null>(null);
  const photo = photos[selected];
  const several = photos.length > 1;

  function keyDown(event: KeyboardEvent) {
    if (!several) return;
    if (event.key === "ArrowLeft") onMove(-1);
    if (event.key === "ArrowRight") onMove(1);
  }

  function endSwipe(event: TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = swipeDelta(event.changedTouches[0].clientX - touchStartX.current);
    touchStartX.current = null;
    if (delta !== 0) onMove(delta);
  }

  return (
    <Dialog open={open && Boolean(photo)} onClose={onClose} className="relative z-50">
      <div aria-hidden="true" className="fixed inset-0 bg-zinc-900/85" />
      <div className="fixed inset-0 flex items-center justify-center p-3 md:p-6">
        <DialogPanel onKeyDown={keyDown} className="flex h-full w-full max-w-6xl flex-col gap-3">
          <div className="flex items-center justify-end gap-3">
            <DialogTitle className="sr-only">Fotos de {petName}</DialogTitle>
            <div className="flex items-center gap-3">
              {several && (
                <p aria-live="polite" className="rounded-full border-2 border-surface px-3 py-0.5 text-sm font-bold text-surface">
                  <span className="sr-only">Foto </span>
                  {selected + 1}
                  <span aria-hidden="true"> / </span>
                  <span className="sr-only"> de </span>
                  {photos.length}
                </p>
              )}
              <button type="button" onClick={onClose} aria-label="Cerrar" className={roundButton}>
                <XMarkIcon aria-hidden="true" className="h-6 w-6 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div
            className={`relative min-h-0 flex-1 ${several ? "touch-pan-y" : ""}`}
            onTouchStart={several ? (event) => (touchStartX.current = event.touches[0].clientX) : undefined}
            onTouchEnd={several ? endSwipe : undefined}
          >
            {photo && (
              <Image
                key={photo.id}
                src={photo.url}
                alt={`Foto ${selected + 1} de ${photos.length} de ${petName}`}
                fill
                unoptimized
                className="object-contain"
              />
            )}
            {several && (
              <>
                <button
                  type="button"
                  onClick={() => onMove(-1)}
                  aria-label="Foto anterior"
                  className={`${roundButton} absolute top-1/2 left-0 -translate-y-1/2 md:left-2`}
                >
                  <ChevronLeftIcon aria-hidden="true" className="h-6 w-6 stroke-[3]" />
                </button>
                <button
                  type="button"
                  onClick={() => onMove(1)}
                  aria-label="Foto siguiente"
                  className={`${roundButton} absolute top-1/2 right-0 -translate-y-1/2 md:right-2`}
                >
                  <ChevronRightIcon aria-hidden="true" className="h-6 w-6 stroke-[3]" />
                </button>
              </>
            )}
          </div>

          {several && (
            <ul aria-label="Elegir foto" className="flex justify-center gap-2 overflow-x-auto pb-1">
              {photos.map((thumbnail, index) => {
                const current = index === selected;
                return (
                  <li key={thumbnail.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelect(index)}
                      aria-label={`Ver foto ${index + 1} de ${photos.length}`}
                      aria-current={current ? "true" : undefined}
                      className={
                        "relative block aspect-[3/4] w-12 cursor-pointer overflow-hidden rounded-field border-2 md:w-14 " +
                        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal " +
                        (current ? "border-surface ring-3 ring-accent-mustard" : "border-ink-soft opacity-60 hover:opacity-100")
                      }
                    >
                      <Image src={thumbnail.url} alt="" fill unoptimized className="object-cover" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
