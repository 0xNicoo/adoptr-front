"use client";

import { loginAction } from "@/actions/auth";
import { useCallback, useEffect, useState } from "react";

/** Lo mínimo que usamos de Google Identity Services. */
interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleAccountsId {
  initialize(config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }): void;
  renderButton(parent: HTMLElement, options: { theme: string; size: string }): void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

export default function LoginPage() {
  const [error, setError] = useState(false);

  // No registrar la respuesta de Google: incluye el ID token.
  const handleCredentialResponse = useCallback(async (response: GoogleCredentialResponse) => {
    setError(false);
    try {
      await loginAction({ token: response.credential, provider: "google" });
      window.location.href = "/profile";
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    const button = document.getElementById("google-btn");
    if (!window.google || !button) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(button, { theme: "outline", size: "large" });
  }, [handleCredentialResponse]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
      <div id="google-btn"></div>
      {error && (
        <p role="alert" className="text-danger font-semibold">
          No pudimos iniciar sesión. Probá de nuevo.
        </p>
      )}
    </div>
  );
}
