"use client";

import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ArrowCounterClockwise, Heart } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { changeAdoptionStatusAction } from "@/actions/adoption";
import Button from "@/app/components/ui/button";
import { FieldError } from "@/app/components/ui/form-field";
import { useToast } from "@/app/components/ui/toast";
import {
  nextStatus,
  statusChangeMessage,
  statusChangedMessage,
  statusConfirmButton,
  statusConfirmText,
  statusConfirmTitle,
} from "@/lib/adoption/status-change";
import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";

export interface StatusChangeTarget {
  adoptionId: number;
  petName: string;
  sex: PetSex;
  status: AdoptionStatus;
}

export default function StatusChangeDialog({
  target,
  open,
  onClose,
}: {
  target: StatusChangeTarget;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { adoptionId, petName, sex, status } = target;
  const toAdopted = status === AdoptionStatus.AVAILABLE;

  function close() {
    if (pending) return;
    setError(null);
    onClose();
  }

  function confirm() {
    setError(null);
    const newStatus = nextStatus(status);
    startTransition(async () => {
      const result = await changeAdoptionStatusAction(adoptionId, newStatus);
      if (!result.ok) {
        setError(statusChangeMessage(result.code));
        return;
      }
      onClose();
      toast(statusChangedMessage(petName, sex, newStatus));
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onClose={close} className="relative z-50">
      <div aria-hidden="true" className="fixed inset-0 bg-zinc-900/60" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md overflow-hidden rounded-card border-3 border-ink bg-surface shadow-panel">
          <div
            className={`halftone flex h-24 items-center justify-center border-b-3 border-ink ${
              toAdopted ? "bg-positive" : "bg-accent-mustard"
            }`}
          >
            <span className="flex size-16 items-center justify-center rounded-full border-3 border-ink bg-surface shadow-hard">
              {toAdopted ? (
                <Heart aria-hidden={true} weight="fill" className="h-7 w-7 text-danger" />
              ) : (
                <ArrowCounterClockwise aria-hidden={true} weight="bold" className="h-7 w-7 text-ink" />
              )}
            </span>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <DialogTitle className="font-display text-3xl leading-tight text-primary">
              {statusConfirmTitle(petName, status)}
            </DialogTitle>
            <Description className="text-[15px] leading-relaxed text-ink-soft">{statusConfirmText(sex, status)}</Description>
            {error && <FieldError>{error}</FieldError>}
            <div className="flex flex-wrap justify-end gap-3">
              <Button variant="secondary" onClick={close} disabled={pending}>
                Cancelar
              </Button>
              <Button variant="cta" onClick={confirm} disabled={pending}>
                {pending ? "Guardando…" : statusConfirmButton(sex, status)}
              </Button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
