import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AdoptionForm from "@/app/adoptions/new/adoption-form";
import { draftFromAdoption } from "@/lib/adoption/adoption-form";
import { getAdoption } from "@/lib/api/calls/adoption";
import { getProvinces } from "@/lib/api/calls/location";
import { Adoption } from "@/lib/api/models/adoption/adoption";
import { Province } from "@/lib/api/models/locality/province";

type Params = Promise<{ id: string }>;

type Loaded =
  | { kind: "ok"; adoption: Adoption; provinces: Province[] }
  | { kind: "not-found" }
  | { kind: "not-owner"; id: number }
  | { kind: "error" };

async function load(rawId: string): Promise<Loaded> {
  if (!/^\d+$/.test(rawId)) return { kind: "not-found" };
  const id = Number(rawId);
  try {
    const [adoption, provinces] = await Promise.all([getAdoption(id), getProvinces()]);
    if (!adoption) return { kind: "not-found" };
    if (!adoption.viewerIsOwner) return { kind: "not-owner", id };
    return { kind: "ok", adoption, provinces };
  } catch {
    return { kind: "error" };
  }
}

export const metadata: Metadata = {
  title: "Editar publicación — Adoptr",
};

export default async function EditAdoptionPage({ params }: { params: Params }) {
  const result = await load((await params).id);
  if (result.kind === "not-found") notFound();
  if (result.kind === "not-owner") redirect(`/adoptions/${result.id}`);

  return (
    <div className="halftone min-h-[calc(100vh-5rem)] bg-paper px-4 pt-12 pb-16">
      {result.kind === "ok" ? (
        <AdoptionForm
          provinces={result.provinces}
          initialLocation={{ provinceId: result.adoption.province.id, locality: result.adoption.locality }}
          initialDraft={draftFromAdoption(result.adoption)}
          editing={{ id: result.adoption.id, petName: result.adoption.petName }}
        />
      ) : (
        <div role="alert" className="mx-auto max-w-2xl rounded-card border-3 border-ink bg-surface p-8 shadow-panel">
          <h1 className="font-display text-4xl text-primary">No pudimos cargar la publicación</h1>
          <p className="mt-3 text-[17px]">Probá de nuevo en unos minutos.</p>
        </div>
      )}
    </div>
  );
}
