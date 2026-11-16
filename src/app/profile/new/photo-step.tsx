"use client";

import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import Button from "@/app/components/ui/button";
import { FieldError, FieldHelp } from "@/app/components/ui/form-field";
import PhotoCropDialog, { CropRequest } from "@/app/components/ui/photo-crop-dialog";
import { ACCEPTED_PHOTO_TYPES } from "@/lib/adoption/photos";
import { initials } from "@/lib/profile/display";
import { PROFILE_PHOTO_FORMAT, PhotoChoice, photoPreviewUrl, profilePhotoFileError } from "@/lib/profile/photo";

export function PhotoCircle({ url, name, size }: { url: string | null; name: string; size: "lg" | "sm" }) {
  const box = size === "lg" ? "h-36 w-36 border-4 text-5xl" : "h-12 w-12 border-3 text-lg";
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-ink bg-accent-teal font-display text-ink ${box}`}
    >
      {url ? (
        <Image src={url} alt="" fill unoptimized className="object-cover" />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </div>
  );
}

const STATUS: Record<PhotoChoice["kind"], string> = {
  none: "Sin foto: en tu perfil se van a ver tus iniciales.",
  current: "Es tu foto actual.",
  google: "Vas a usar tu foto de Google.",
  upload: "Vas a usar la foto que subiste.",
};

export default function PhotoStep({
  value,
  onChange,
  googlePhotoUrl,
  currentPhotoUrl = null,
  name,
}: {
  value: PhotoChoice;
  onChange: (choice: PhotoChoice) => void;
  googlePhotoUrl: string | null;
  currentPhotoUrl?: string | null;
  name: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cropRequest, setCropRequest] = useState<CropRequest | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  function pickFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const error = profilePhotoFileError(file);
    setFileError(error);
    if (error) return;
    setCropRequest({ imageUrl: URL.createObjectURL(file), fileName: file.name });
  }

  function closeCrop() {
    if (cropRequest) URL.revokeObjectURL(cropRequest.imageUrl);
    setCropRequest(null);
  }

  function confirmCrop(file: File) {
    onChange({ kind: "upload", file, previewUrl: URL.createObjectURL(file) });
    closeCrop();
  }

  function choose(choice: PhotoChoice) {
    setFileError(null);
    onChange(choice);
  }

  return (
    <div id="photo" className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
      <PhotoCircle url={photoPreviewUrl(value, googlePhotoUrl, currentPhotoUrl)} name={name} size="lg" />

      <div className="flex w-full flex-col gap-4">
        <FieldHelp id="photo-help">
          Es opcional. Se ve en un círculo en tu perfil y en los chats. JPG, PNG o WebP, hasta 5 MB.
        </FieldHelp>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
            {value.kind === "upload" || value.kind === "current" ? "Elegir otra foto" : "Subir una foto"}
          </Button>
          {googlePhotoUrl && value.kind !== "google" && (
            <Button variant="secondary" size="sm" onClick={() => choose({ kind: "google" })}>
              <span className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-ink">
                <Image src={googlePhotoUrl} alt="" fill unoptimized className="object-cover" />
              </span>
              Usar mi foto de Google
            </Button>
          )}
          {value.kind !== "none" && (
            <Button variant="secondary" size="sm" onClick={() => choose({ kind: "none" })}>
              Quitar foto
            </Button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_PHOTO_TYPES.join(",")}
          onChange={pickFile}
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
        />

        <p aria-live="polite" className="font-semibold">
          {STATUS[value.kind]}
        </p>
        {fileError && <FieldError id="photo-error">{fileError}</FieldError>}
      </div>

      <PhotoCropDialog
        request={cropRequest}
        format={PROFILE_PHOTO_FORMAT}
        shape="round"
        confirmLabel="Usar esta foto"
        cancelLabel="Cancelar"
        onConfirm={confirmCrop}
        onCancel={closeCrop}
      />
    </div>
  );
}
