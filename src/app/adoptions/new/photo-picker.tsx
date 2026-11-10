"use client";

import { ArrowsPointingOutIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { FieldError, FieldHelp } from "@/app/components/ui/form-field";
import { CropArea } from "@/lib/adoption/photo-crop";
import { ACCEPTED_PHOTO_TYPES, MAX_PHOTOS, PHOTO_RULES_TEXT, selectPhotos } from "@/lib/adoption/photos";
import PhotoCropDialog, { CropRequest } from "./photo-crop-dialog";

export interface DraftPhoto {
  id: string;
  /** Lo que se sube: el recorte 4:3 en JPEG. */
  file: File;
  previewUrl: string;
  /** La foto elegida, para poder reajustar el recorte. */
  original: File;
  originalUrl: string;
  area: CropArea;
}

interface PendingPhoto {
  original: File;
  originalUrl: string;
}

/** URL local de una foto, anotada para liberarla al salir. */
function track(urls: Set<string>, blob: Blob): string {
  const url = URL.createObjectURL(blob);
  urls.add(url);
  return url;
}

function release(urls: Set<string>, url: string) {
  URL.revokeObjectURL(url);
  urls.delete(url);
}

/**
 * Fotos elegidas todavía sin subir. Cada foto pasa por el recorte 4:3 antes de sumarse: si se eligen
 * varias, se recortan una tras otra. Libera las URLs locales al quitar una foto y al salir.
 */
export function useDraftPhotos() {
  const [photos, setPhotos] = useState<DraftPhoto[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [queue, setQueue] = useState<PendingPhoto[]>([]);
  const [queueTotal, setQueueTotal] = useState(0);
  const [adjusting, setAdjusting] = useState<DraftPhoto | null>(null);
  const urls = useRef(new Set<string>());

  useEffect(() => {
    const tracked = urls.current;
    return () => {
      tracked.forEach((url) => URL.revokeObjectURL(url));
      tracked.clear();
    };
  }, []);

  const add = useCallback(
    (files: File[]) => {
      const selection = selectPhotos(files, photos.length + queue.length);
      const pending = selection.accepted.map((original) => ({ original, originalUrl: track(urls.current, original) }));
      setQueue([...queue, ...pending]);
      setQueueTotal(queue.length === 0 ? pending.length : queueTotal + pending.length);
      setRejected(selection.rejected);
    },
    [photos, queue, queueTotal],
  );

  const remove = useCallback(
    (photo: DraftPhoto) => {
      release(urls.current, photo.previewUrl);
      release(urls.current, photo.originalUrl);
      setPhotos(photos.filter((other) => other.id !== photo.id));
      setRejected([]);
    },
    [photos],
  );

  /** La foto que se está recortando: la primera de la cola o la que se reajusta. */
  const cropRequest: CropRequest | null = adjusting
    ? { imageUrl: adjusting.originalUrl, fileName: adjusting.original.name, initialArea: adjusting.area }
    : queue.length > 0
      ? {
          imageUrl: queue[0].originalUrl,
          fileName: queue[0].original.name,
          position: { current: queueTotal - queue.length + 1, total: queueTotal },
        }
      : null;

  const confirmCrop = useCallback(
    (file: File, area: CropArea) => {
      if (adjusting) {
        release(urls.current, adjusting.previewUrl);
        const updated = { ...adjusting, file, area, previewUrl: track(urls.current, file) };
        setPhotos(photos.map((photo) => (photo.id === adjusting.id ? updated : photo)));
        setAdjusting(null);
        return;
      }
      const [current, ...rest] = queue;
      if (!current) return;
      setPhotos([
        ...photos,
        { id: crypto.randomUUID(), file, area, previewUrl: track(urls.current, file), original: current.original, originalUrl: current.originalUrl },
      ]);
      setQueue(rest);
    },
    [adjusting, photos, queue],
  );

  /** Al reajustar, deja la foto como estaba; con una foto nueva, la descarta. */
  const cancelCrop = useCallback(() => {
    if (adjusting) {
      setAdjusting(null);
      return;
    }
    const [current, ...rest] = queue;
    if (!current) return;
    release(urls.current, current.originalUrl);
    setQueue(rest);
  }, [adjusting, queue]);

  return {
    photos,
    rejected,
    add,
    remove,
    adjust: setAdjusting,
    cropRequest,
    cropMode: adjusting ? ("adjust" as const) : ("new" as const),
    confirmCrop,
    cancelCrop,
  };
}

export default function PhotoPicker({
  photos,
  rejected,
  onAdd,
  onRemove,
  onAdjust,
  cropRequest,
  cropMode,
  onConfirmCrop,
  onCancelCrop,
}: {
  photos: DraftPhoto[];
  rejected: string[];
  onAdd: (files: File[]) => void;
  onRemove: (photo: DraftPhoto) => void;
  onAdjust: (photo: DraftPhoto) => void;
  cropRequest: CropRequest | null;
  cropMode: "new" | "adjust";
  onConfirmCrop: (file: File, area: CropArea) => void;
  onCancelCrop: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const full = photos.length >= MAX_PHOTOS;

  function choose(event: ChangeEvent<HTMLInputElement>) {
    onAdd(Array.from(event.target.files ?? []));
    // Sin esto, elegir de nuevo un archivo que se acaba de quitar no dispara el cambio.
    event.target.value = "";
  }

  function remove(photo: DraftPhoto) {
    onRemove(photo);
    // El botón presionado desaparece: el foco no puede quedar perdido.
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div className="flex flex-col gap-5">
      <FieldHelp id="photos-help">
        Opcional. Hasta {MAX_PHOTOS} fotos: {PHOTO_RULES_TEXT} Las fotos se muestran en formato 4:3: al elegir cada una
        vas a poder ubicarla. La primera va a ser la portada. Quitamos la ubicación y los demás datos que traen las
        fotos de celular.
      </FieldHelp>

      <div className="flex flex-wrap items-center gap-4">
        <label
          className={
            "inline-flex min-h-12 items-center gap-2 rounded-full border-3 px-7 text-[17px] font-bold " +
            "has-focus-visible:outline-3 has-focus-visible:outline-offset-4 has-focus-visible:outline-accent-teal " +
            (full
              ? "cursor-not-allowed border-dashed border-ink-soft bg-disabled text-ink-soft"
              : "cursor-pointer border-ink bg-surface text-ink shadow-hard active:translate-x-1 active:translate-y-1 active:shadow-none")
          }
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_PHOTO_TYPES.join(",")}
            multiple
            disabled={full}
            onChange={choose}
            aria-describedby="photos-help"
            className="sr-only"
          />
          <PhotoIcon aria-hidden="true" className="h-6 w-6" />
          Elegir fotos
        </label>
        <p aria-live="polite" className="text-[15px] font-semibold text-ink-soft">
          {photos.length} de {MAX_PHOTOS}
        </p>
      </div>

      {rejected.length > 0 && (
        <div role="alert">
          {rejected.map((message) => (
            <FieldError key={message}>{message}</FieldError>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <ul aria-label="Fotos elegidas" className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((photo, index) => (
            <li key={photo.id} className="relative aspect-[4/3] overflow-hidden rounded-field border-3 border-ink bg-disabled">
              <Image src={photo.previewUrl} alt={`Foto ${index + 1}: ${photo.original.name}`} fill unoptimized className="object-cover" />
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 rounded-full border-2 border-ink bg-accent-mustard px-2 text-[13px] font-bold">
                  Portada
                </span>
              )}
              <div className="absolute top-1 right-1 flex gap-1">
                <button
                  type="button"
                  onClick={() => onAdjust(photo)}
                  aria-label={`Ajustar ${photo.original.name}`}
                  title="Ajustar"
                  className="flex size-11 cursor-pointer items-center justify-center rounded-full border-3 border-ink bg-surface focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
                >
                  <ArrowsPointingOutIcon aria-hidden="true" className="h-5 w-5 stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(photo)}
                  aria-label={`Quitar ${photo.original.name}`}
                  title="Quitar"
                  className="flex size-11 cursor-pointer items-center justify-center rounded-full border-3 border-ink bg-surface focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
                >
                  <XMarkIcon aria-hidden="true" className="h-5 w-5 stroke-[2.5]" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <PhotoCropDialog
        request={cropRequest}
        confirmLabel={cropMode === "adjust" ? "Guardar" : "Usar esta foto"}
        cancelLabel={cropMode === "adjust" ? "Cancelar" : "Descartar esta foto"}
        onConfirm={onConfirmCrop}
        onCancel={onCancelCrop}
      />
    </div>
  );
}
