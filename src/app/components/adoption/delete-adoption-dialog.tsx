"use client";

import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteAdoptionAction } from "@/actions/adoption";
import Button from "@/app/components/ui/button";
import { FieldError } from "@/app/components/ui/form-field";
import { useToast } from "@/app/components/ui/toast";
import {
  DELETE_CONFIRM_BUTTON,
  DELETE_CONFIRM_TEXT,
  deleteConfirmTitle,
  deletedMessage,
  deleteErrorMessage,
} from "@/lib/adoption/delete";

export interface DeleteTarget {
  adoptionId: number;
  petName: string;
}

export default function DeleteAdoptionDialog({
  target,
  open,
  onClose,
  redirectTo,
}: {
  target: DeleteTarget;
  open: boolean;
  onClose: () => void;
  redirectTo?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { adoptionId, petName } = target;

  function close() {
    if (pending) return;
    setError(null);
    onClose();
  }

  function confirm() {
    setError(null);
    startTransition(async () => {
      const result = await deleteAdoptionAction(adoptionId);
      if (!result.ok) {
        setError(deleteErrorMessage(result.code));
        return;
      }
      onClose();
      toast(deletedMessage(petName));
      if (redirectTo) {
        router.replace(redirectTo);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <Dialog open={open} onClose={close} className="relative z-50">
      <div aria-hidden="true" className="fixed inset-0 bg-zinc-900/60" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md overflow-hidden rounded-card border-3 border-ink bg-surface shadow-panel">
          <div className="halftone flex h-24 items-center justify-center border-b-3 border-ink bg-danger">
            <span className="flex size-16 items-center justify-center rounded-full border-3 border-ink bg-surface shadow-hard">
              <Trash aria-hidden={true} weight="bold" className="h-7 w-7 text-ink" />
            </span>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <DialogTitle className="font-display text-3xl leading-tight text-primary">
              {deleteConfirmTitle(petName)}
            </DialogTitle>
            <Description className="text-[15px] leading-relaxed text-ink-soft">{DELETE_CONFIRM_TEXT}</Description>
            {error && <FieldError>{error}</FieldError>}
            <div className="flex flex-wrap justify-end gap-3">
              <Button variant="secondary" onClick={close} disabled={pending}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirm} disabled={pending}>
                {pending ? "Eliminando…" : DELETE_CONFIRM_BUTTON}
              </Button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
