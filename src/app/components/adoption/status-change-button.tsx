"use client";

import { ArrowCounterClockwise, House } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import Button from "@/app/components/ui/button";
import { statusActionLabel } from "@/lib/adoption/status-change";
import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import StatusChangeDialog, { type StatusChangeTarget } from "./status-change-dialog";

export default function StatusChangeButton({ target }: { target: StatusChangeTarget }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        {target.status === AdoptionStatus.ADOPTED ? (
          <ArrowCounterClockwise aria-hidden={true} weight="bold" className="h-5 w-5" />
        ) : (
          <House aria-hidden={true} weight="bold" className="h-5 w-5" />
        )}
        {statusActionLabel(target.sex, target.status)}
      </Button>
      <StatusChangeDialog target={target} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
