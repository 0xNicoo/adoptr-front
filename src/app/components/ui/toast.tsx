"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";

const TOAST_MS = 6000;

export type ToastAction = { label: string; onClick: () => void };

type ShowToast = (message: string, action?: ToastAction) => void;

const ToastContext = createContext<ShowToast>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string; action?: ToastAction } | null>(null);
  const show = useCallback<ShowToast>((message, action) => setToast({ id: Date.now(), message, action }), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        {toast && (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-center gap-4 rounded-full border-3 border-ink bg-ink py-3 pr-3 pl-6 text-[15px] font-bold text-surface shadow-[6px_6px_0_var(--color-cta)]"
          >
            {toast.message}
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  setToast(null);
                }}
                className="min-h-9 cursor-pointer rounded-full border-2 border-surface px-4 text-[15px] font-bold underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-accent-teal"
              >
                {toast.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Cerrar aviso"
              className="flex size-9 cursor-pointer items-center justify-center rounded-full focus-visible:outline-3 focus-visible:outline-accent-teal"
            >
              <XMarkIcon aria-hidden="true" className="h-5 w-5 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
