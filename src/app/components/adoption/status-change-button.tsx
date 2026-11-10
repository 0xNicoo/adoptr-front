"use client";

import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { changeAdoptionStatusAction } from "@/actions/adoption";
import Button, { type ButtonVariant } from "@/app/components/ui/button";
import { FieldError } from "@/app/components/ui/form-field";
import {
  nextStatus,
  statusActionLabel,
  statusChangeMessage,
  statusConfirmText,
  statusConfirmTitle,
  statusShortLabel,
} from "@/lib/adoption/status-change";
import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";

export default function StatusChangeButton({
  adoptionId,
  petName,
  sex,
  status,
  compact = false,
  variant = "secondary",
  className = "",
}: {
  adoptionId: number;
  petName: string;
  sex: PetSex;
  status: AdoptionStatus;
  compact?: boolean;
  variant?: ButtonVariant;
  className?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const confirmLabel = statusActionLabel(sex, status);

  function close() {
    if (pending) return;
    setOpen(false);
    setError(null);
  }

  function confirm() {
    setError(null);
    startTransition(async () => {
      const result = await changeAdoptionStatusAction(adoptionId, nextStatus(status));
      if (!result.ok) {
        setError(statusChangeMessage(result.code));
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)} className={className}>
        {compact ? statusShortLabel(sex, status) : confirmLabel}
        {compact && <span className="sr-only">: {petName}</span>}
      </Button>

      <Dialog open={open} onClose={close} className="relative z-50">
        <div aria-hidden="true" className="fixed inset-0 bg-zinc-900/70" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="flex w-full max-w-md flex-col gap-4 rounded-card border-3 border-ink bg-surface p-6 shadow-panel">
            <DialogTitle className="font-display text-3xl leading-tight text-primary">
              {statusConfirmTitle(petName, sex, status)}
            </DialogTitle>
            <Description className="text-[17px]">{statusConfirmText(status)}</Description>
            {error && <FieldError>{error}</FieldError>}
            <div className="flex flex-wrap justify-end gap-3">
              <Button variant="secondary" onClick={close} disabled={pending}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={confirm} disabled={pending}>
                {pending ? "Guardando…" : confirmLabel}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
