"use client";

import { Dialog, DialogPanel, DialogTitle, Description } from "@headlessui/react";
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import Button from "@/app/components/ui/button";
import { FieldError } from "@/app/components/ui/form-field";
import { cropToFile } from "@/lib/adoption/crop-image";
import { CropArea, PHOTO_ASPECT, PHOTO_MAX_ZOOM, PHOTO_MIN_ZOOM, clampZoom } from "@/lib/adoption/photo-crop";

// Recorte vertical 3:4 de una foto (docs/producto/flujos-producto.md, paso Fotos del alta). Arranca centrado con
// el mayor marco posible: si así está bien, alcanza con «Usar esta foto». Se mueve arrastrando o, con
// teclado, enfocando la foto y usando las flechas; el zoom, con la rueda, pellizcando o con el control.

const ZOOM_STEP = 0.25;

export interface CropRequest {
  /** URL local de la foto original. */
  imageUrl: string;
  fileName: string;
  /** Recorte anterior, al reajustar una foto ya elegida. */
  initialArea?: CropArea;
  /** «Foto 2 de 3» si se eligieron varias. */
  position?: { current: number; total: number };
}

export default function PhotoCropDialog({
  request,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  request: CropRequest | null;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: (file: File, area: CropArea) => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={request !== null} onClose={onCancel} className="relative z-50">
      <div aria-hidden="true" className="fixed inset-0 bg-ink/70" />
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
        {request && (
          // `key`: cada foto arranca con su propio estado (zoom, posición, errores).
          <CropPanel
            key={request.imageUrl}
            request={request}
            confirmLabel={confirmLabel}
            cancelLabel={cancelLabel}
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        )}
      </div>
    </Dialog>
  );
}

function CropPanel({
  request,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  request: CropRequest;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: (file: File, area: CropArea) => void;
  onCancel: () => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(PHOTO_MIN_ZOOM);
  const [area, setArea] = useState<CropArea | null>(request.initialArea ?? null);
  const [working, setWorking] = useState(false);
  const [failed, setFailed] = useState<"load" | "crop" | null>(null);

  async function confirm() {
    if (!area) return;
    setWorking(true);
    setFailed(null);
    try {
      onConfirm(await cropToFile(request.imageUrl, area, request.fileName), area);
    } catch {
      setFailed("crop");
      setWorking(false);
    }
  }

  return (
    <DialogPanel className="flex w-full max-w-xl flex-col gap-5 rounded-card border-3 border-ink bg-surface p-5 shadow-panel md:p-7">
      <div>
        {request.position && request.position.total > 1 && (
          <p className="text-[13px] font-semibold tracking-[0.08em] text-ink-soft uppercase">
            Foto {request.position.current} de {request.position.total}
          </p>
        )}
        <DialogTitle className="font-display text-3xl text-primary">Ubicá la foto</DialogTitle>
        <Description className="mt-1 text-[15px] text-ink-soft">
          Las fotos van verticales (3:4). Arrastrala para elegir qué parte queda y acercala con la rueda, pellizcando o
          con el zoom. Con teclado: tabulá hasta la foto y usá las flechas.
        </Description>
      </div>

      <div className="relative mx-auto aspect-[3/4] h-[min(60vh,560px)] max-w-full overflow-hidden rounded-field border-3 border-ink bg-ink">
        {failed === "load" ? (
          <p className="absolute inset-0 flex items-center justify-center p-6 text-center font-semibold text-surface">
            No pudimos abrir esta foto. Probá con otra.
          </p>
        ) : (
          <Cropper
            image={request.imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={PHOTO_ASPECT}
            minZoom={PHOTO_MIN_ZOOM}
            maxZoom={PHOTO_MAX_ZOOM}
            keyboardStep={10}
            initialCroppedAreaPixels={request.initialArea}
            onCropChange={setCrop}
            onZoomChange={(value) => setZoom(clampZoom(value))}
            onCropComplete={(_: Area, pixels: Area) => setArea(pixels)}
            mediaProps={{ onError: () => setFailed("load") }}
            cropperProps={{ "aria-label": `Recorte de ${request.fileName}` }}
            classes={{ cropAreaClassName: "focus-visible:outline-3 focus-visible:outline-accent-teal" }}
          />
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setZoom(clampZoom(zoom - ZOOM_STEP))}
          disabled={zoom <= PHOTO_MIN_ZOOM || failed === "load"}
          aria-label="Alejar"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-3 border-ink bg-surface disabled:cursor-not-allowed disabled:border-dashed disabled:border-ink-soft disabled:text-ink-soft focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
        >
          <MagnifyingGlassMinusIcon aria-hidden="true" className="h-5 w-5 stroke-[2.5]" />
        </button>
        <label className="flex flex-1 flex-col gap-1">
          <span className="sr-only">Zoom</span>
          <input
            type="range"
            min={PHOTO_MIN_ZOOM}
            max={PHOTO_MAX_ZOOM}
            step={0.01}
            value={zoom}
            disabled={failed === "load"}
            onChange={(event) => setZoom(clampZoom(Number(event.target.value)))}
            className="w-full accent-primary"
          />
        </label>
        <button
          type="button"
          onClick={() => setZoom(clampZoom(zoom + ZOOM_STEP))}
          disabled={zoom >= PHOTO_MAX_ZOOM || failed === "load"}
          aria-label="Acercar"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-3 border-ink bg-surface disabled:cursor-not-allowed disabled:border-dashed disabled:border-ink-soft disabled:text-ink-soft focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
        >
          <MagnifyingGlassPlusIcon aria-hidden="true" className="h-5 w-5 stroke-[2.5]" />
        </button>
      </div>

      {failed === "crop" && <FieldError>No pudimos recortar la foto. Probá de nuevo.</FieldError>}

      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={working}>
          {cancelLabel}
        </Button>
        <Button variant="primary" onClick={confirm} disabled={working || !area || failed === "load"}>
          {working ? "Recortando…" : confirmLabel}
        </Button>
      </div>
    </DialogPanel>
  );
}
