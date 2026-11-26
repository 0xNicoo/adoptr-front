"use client";

import { Trash } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import Button from "@/app/components/ui/button";
import DeleteAdoptionDialog, { type DeleteTarget } from "./delete-adoption-dialog";

export default function DeleteAdoptionButton({ target }: { target: DeleteTarget }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <Trash aria-hidden={true} weight="bold" className="h-5 w-5" />
        Eliminar
      </Button>
      <DeleteAdoptionDialog target={target} open={open} onClose={() => setOpen(false)} redirectTo="/profile" />
    </>
  );
}
