"use client";

import { LockSimple } from "@phosphor-icons/react";
import Image from "next/image";
import Script from "next/script";
import { useCallback, useRef, useState } from "react";
import { loginAction } from "@/actions/auth";

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleButtonOptions {
  theme: "outline" | "filled_blue" | "filled_black";
  size: "large" | "medium" | "small";
  shape: "pill" | "rectangular";
  text: "continue_with" | "signin_with" | "signup_with";
  locale: string;
  width: number;
}

interface GoogleAccountsId {
  initialize(config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }): void;
  renderButton(parent: HTMLElement, options: GoogleButtonOptions): void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

type Status = "loading" | "ready" | "signing-in" | "unavailable" | "error";

export default function LoginPage() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");

  const handleCredentialResponse = useCallback(async (response: GoogleCredentialResponse) => {
    setStatus("signing-in");
    try {
      const { hasProfile } = await loginAction({ token: response.credential, provider: "google" });
      window.location.href = hasProfile ? "/profile" : "/profile/new";
    } catch {
      setStatus("error");
    }
  }, []);

  const renderGoogleButton = useCallback(() => {
    const container = buttonRef.current;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!window.google || !container || !clientId) {
      setStatus("unavailable");
      return;
    }

    window.google.accounts.id.initialize({ client_id: clientId, callback: handleCredentialResponse });
    window.google.accounts.id.renderButton(container, {
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "continue_with",
      locale: "es",
      width: Math.min(400, Math.max(200, container.offsetWidth)),
    });
    setStatus("ready");
  }, [handleCredentialResponse]);

  return (
    <div className="px-4 py-10 sm:px-6 md:py-16">
      <div aria-hidden="true" className="halftone fixed inset-0 -z-10" />
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={renderGoogleButton}
        onError={() => setStatus("unavailable")}
      />

      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-card border-3 border-ink bg-surface shadow-panel md:grid-cols-2">
        <div
          aria-hidden="true"
          className="halftone relative flex min-h-60 items-center justify-center border-b-3 border-ink bg-primary md:min-h-[640px] md:border-b-0 md:border-r-3"
        >
          <Image
            src="/illustrations/decoracion/starburst.svg"
            alt=""
            width={340}
            height={340}
            unoptimized
            className="absolute h-auto w-56 md:w-[340px]"
          />
          <div className="relative flex items-end">
            <Image
              src="/illustrations/perros/perro-azul.svg"
              alt=""
              width={160}
              height={160}
              unoptimized
              className="h-auto w-28 md:w-40"
            />
            <Image
              src="/illustrations/gatos/gato-turquesa.svg"
              alt=""
              width={130}
              height={130}
              unoptimized
              className="-ml-5 h-auto w-24 md:w-32"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-10 px-6 py-12 sm:px-10 md:px-14 md:py-16">
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-4xl leading-tight text-primary sm:text-5xl">Ingresá a Adoptr</h1>
            <p className="text-[17px] leading-[1.55]">
              Para adoptar a tu nuevo compañero o publicar animales en adopción, primero necesitamos que inicies sesión.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-full border-3 border-ink bg-white p-1.5 shadow-hard">
              <div className="relative flex min-h-11 items-center justify-center">
                <div ref={buttonRef} className="w-full [&>div]:mx-auto" />
                {status === "loading" && (
                  <p className="absolute inset-0 flex items-center justify-center text-base font-bold text-ink-soft">
                    Cargando…
                  </p>
                )}
              </div>
            </div>
            <p className="text-center text-[15px] text-ink-soft">
              ¿Es tu primera vez? Con el mismo botón creás tu cuenta.
            </p>
            <div aria-live="polite">
              {status === "signing-in" && <p className="text-center font-bold">Ingresando…</p>}
            </div>
            {status === "error" && (
              <p role="alert" className="text-center font-semibold text-danger">
                No pudimos iniciar sesión. Probá de nuevo.
              </p>
            )}
            {status === "unavailable" && (
              <p role="alert" className="text-center font-semibold text-danger">
                No pudimos cargar el botón de Google. Recargá la página para intentar de nuevo.
              </p>
            )}
          </div>

          <div className="flex items-start gap-3 rounded-field border-2 border-dashed border-ink p-4 text-[15px] leading-normal">
            <LockSimple aria-hidden="true" weight="bold" className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              De tu cuenta de Google solo usamos tu nombre, tu email y tu foto. No vemos tu contraseña ni publicamos nada
              por vos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
