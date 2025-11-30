"use client";

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
      const res = await fetch("http://localhost:8081/auth/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 'token': token, 'provider': 'google' }),
      });

      if (!res.ok) {
        console.error("Error login Google:", await res.text());
        alert("No se pudo iniciar sesión");
        return;
      }

      const data = await res.json();

      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("email", data.user.email);


      window.location.href = "/prueba";
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
