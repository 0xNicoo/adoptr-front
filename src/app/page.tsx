"use client";

import { loginAction } from "@/actions/auth";
import { useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export default function LoginPage() {

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-btn")!,
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleCredentialResponse = async (response: { credential: string }) => {
    console.log("response", response);
    const token = response.credential;

    try {
      await loginAction({ token, provider: 'google' });
      window.location.href = "/profile";
    } catch (err) {
      console.error("Error en login:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
      <div id="google-btn"></div>
    </div>
  );
}
