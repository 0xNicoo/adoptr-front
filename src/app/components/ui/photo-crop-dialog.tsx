"use client";

import { Dialog, DialogPanel, DialogTitle, Description } from "@headlessui/react";
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import Button from "@/app/components/ui/button";
import { FieldError } from "@/app/components/ui/form-field";
import { CROP_MAX_ZOOM, CROP_MIN_ZOOM, CropArea, CropFormat, clampZoom, cropAspect } from "@/lib/photo/crop";
import { cropToFile } from "@/lib/photo/crop-image";

const ZOOM_STEP = 0.25;

export interface CropRequest {
  imageUrl: string;
  fileName: string;
  initialArea?: CropArea;
  position?: { current: number; total: number };
}

export type CropShape = "rect" | "round";

export default function PhotoCropDialog({
  request,
  format,
  shape = "rect",
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  request: CropRequest | null;
  format: CropFormat;
  shape?: CropShape;
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
         <CropPanel
            key={request.imageUrl}
            request={request}
            format={format}
            shape={shape}
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
  format,
  shape,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  request: CropRequest;
  format: CropFormat;
  shape: CropShape;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: (file: File, area: CropArea) => void;
  onCancel: () => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(CROP_MIN_ZOOM);
  const [area, setArea] = useState<CropArea | null>(request.initialArea ?? null);
  const [working, setWorking] = useState(false);
  const [failed, setFailed] = useState<"load" | "crop" | null>(null);

  async function confirm() {
    if (!area) return;
    setWorking(true);
    setFailed(null);
    try {
      onConfirm(await cropToFile(request.imageUrl, area, request.fileName, format), area);
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
          Arrastrala para elegir qué parte queda y acercala con la rueda, pellizcando o
          con el zoom.
        </Description>
      </div>

      <div
        style={{ aspectRatio: `${format.aspectWidth} / ${format.aspectHeight}` }}
        className="relative mx-auto h-[min(60vh,560px)] max-w-full overflow-hidden rounded-field border-3 border-ink bg-ink"
      >
        {failed === "load" ? (
          <p className="absolute inset-0 flex items-center justify-center p-6 text-center font-semibold text-surface">
            No pudimos abrir esta foto. Probá con otra.
          </p>
        ) : (
          <Cropper
            image={request.imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={cropAspect(format)}
            cropShape={shape}
            minZoom={CROP_MIN_ZOOM}
            maxZoom={CROP_MAX_ZOOM}
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
          disabled={zoom <= CROP_MIN_ZOOM || failed === "load"}
          aria-label="Alejar"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-3 border-ink bg-surface disabled:cursor-not-allowed disabled:border-dashed disabled:border-ink-soft disabled:text-ink-soft focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
        >
          <MagnifyingGlassMinusIcon aria-hidden="true" className="h-5 w-5 stroke-[2.5]" />
        </button>
        <label className="flex flex-1 flex-col gap-1">
          <span className="sr-only">Zoom</span>
          <input
            type="range"
            min={CROP_MIN_ZOOM}
            max={CROP_MAX_ZOOM}
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
          disabled={zoom >= CROP_MAX_ZOOM || failed === "load"}
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
