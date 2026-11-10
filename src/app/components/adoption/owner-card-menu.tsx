"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ArrowCounterClockwise, DotsThree, House } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { statusActionLabel } from "@/lib/adoption/status-change";
import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import StatusChangeDialog, { type StatusChangeTarget } from "./status-change-dialog";

export default function OwnerCardMenu({ target }: { target: StatusChangeTarget }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const StatusIcon = target.status === AdoptionStatus.ADOPTED ? ArrowCounterClockwise : House;

  return (
    <>
      <Menu as="div" className="relative">
        <MenuButton
          aria-label={`Opciones de ${target.petName}`}
          className="flex size-11 cursor-pointer items-center justify-center rounded-full border-3 border-ink bg-surface shadow-hard focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-teal data-open:bg-accent-mustard"
        >
          <DotsThree aria-hidden={true} weight="bold" className="h-6 w-6" />
        </MenuButton>
        <MenuItems
          anchor="bottom end"
          className="z-40 w-60 overflow-hidden rounded-field border-3 border-ink bg-surface py-1 shadow-card [--anchor-gap:8px] focus:outline-none"
        >
          <MenuItem>
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-[15px] font-semibold data-focus:bg-positive-soft"
            >
              <StatusIcon aria-hidden={true} weight="bold" className="h-5 w-5 shrink-0" />
              {statusActionLabel(target.sex, target.status)}
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
      <StatusChangeDialog target={target} open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}
