"use client";

import { useEffect, useState } from "react";

interface UserState {
  id: string;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserState | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    if (id && name && email) {
      setUser({ id, name, email });
    }
  }, []);

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Bienvenido, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>ID: {user.id}</p>
      <p>name: {user.name}</p>
    </div>
  );
}
