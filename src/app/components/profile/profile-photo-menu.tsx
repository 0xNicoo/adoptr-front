"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { GoogleLogo, PencilSimple, Trash, UploadSimple } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState, useTransition } from "react";
import {
  ProfilePhotoResult,
  deleteProfilePhotoAction,
  setGoogleProfilePhotoAction,
  setProfilePhotoAction,
} from "@/actions/profile";
import PhotoCropDialog, { CropRequest } from "@/app/components/ui/photo-crop-dialog";
import { useToast } from "@/app/components/ui/toast";
import { ACCEPTED_PHOTO_TYPES } from "@/lib/adoption/photos";
import { PROFILE_PHOTO_FORMAT, profilePhotoErrorMessage, profilePhotoFileError } from "@/lib/profile/photo";

const itemClass =
  "flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-[15px] font-semibold data-focus:bg-positive-soft";

export default function ProfilePhotoMenu({
  hasPhoto,
  googlePhotoUrl,
}: {
  hasPhoto: boolean;
  googlePhotoUrl: string | null;
}) {
  const router = useRouter();
  const showToast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [cropRequest, setCropRequest] = useState<CropRequest | null>(null);
  const [pending, startTransition] = useTransition();

  function run(request: () => Promise<ProfilePhotoResult>, success: string) {
    startTransition(async () => {
      const result = await request();
      if (result.ok) {
        router.refresh();
        showToast(success);
      } else {
        showToast(profilePhotoErrorMessage(result.code));
      }
    });
  }

  function pickFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const error = profilePhotoFileError(file);
    if (error) {
      showToast(error);
      return;
    }
    setCropRequest({ imageUrl: URL.createObjectURL(file), fileName: file.name });
  }

  function closeCrop() {
    if (cropRequest) URL.revokeObjectURL(cropRequest.imageUrl);
    setCropRequest(null);
  }

  function confirmCrop(file: File) {
    closeCrop();
    const formData = new FormData();
    formData.append("file", file, file.name);
    run(() => setProfilePhotoAction(formData), "Actualizaste tu foto.");
  }

  return (
    <>
      <Menu as="div" className="absolute right-0 bottom-0">
        <MenuButton
          aria-label={pending ? "Guardando la foto…" : "Editar foto de perfil"}
          disabled={pending}
          className="flex size-11 cursor-pointer items-center justify-center rounded-full border-3 border-ink bg-cta shadow-hard focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal disabled:cursor-wait disabled:bg-disabled data-open:bg-accent-mustard"
        >
          <PencilSimple aria-hidden={true} weight="bold" className={`h-5 w-5 ${pending ? "animate-pulse" : ""}`} />
        </MenuButton>
        <MenuItems
          anchor="bottom start"
          className="z-40 w-64 overflow-hidden rounded-field border-3 border-ink bg-surface py-1 shadow-card [--anchor-gap:8px] focus:outline-none"
        >
          <MenuItem>
            <button type="button" onClick={() => inputRef.current?.click()} className={itemClass}>
              <UploadSimple aria-hidden={true} weight="bold" className="h-5 w-5 shrink-0" />
              {hasPhoto ? "Cambiar foto" : "Subir una foto"}
            </button>
          </MenuItem>
          {googlePhotoUrl && (
            <MenuItem>
              <button
                type="button"
                onClick={() => run(setGoogleProfilePhotoAction, "Ahora usás tu foto de Google.")}
                className={itemClass}
              >
                <GoogleLogo aria-hidden={true} weight="bold" className="h-5 w-5 shrink-0" />
                Usar mi foto de Google
              </button>
            </MenuItem>
          )}
          {hasPhoto && (
            <MenuItem>
              <button
                type="button"
                onClick={() => run(deleteProfilePhotoAction, "Quitaste tu foto.")}
                className={itemClass}
              >
                <Trash aria-hidden={true} weight="bold" className="h-5 w-5 shrink-0" />
                Quitar foto
              </button>
            </MenuItem>
          )}
        </MenuItems>
      </Menu>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_PHOTO_TYPES.join(",")}
        onChange={pickFile}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />

      <PhotoCropDialog
        request={cropRequest}
        format={PROFILE_PHOTO_FORMAT}
        shape="round"
        confirmLabel="Usar esta foto"
        cancelLabel="Cancelar"
        onConfirm={confirmCrop}
        onCancel={closeCrop}
      />
    </>
  );
}
