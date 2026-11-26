import type { Metadata } from "next";
import { PencilSimple } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Badge from "@/app/components/ui/badge";
import Button from "@/app/components/ui/button";
import HealthChips from "@/app/components/ui/health-chips";
import { birthMonthToAge, formatAge } from "@/lib/adoption/age";
import { canDelete } from "@/lib/adoption/delete";
import { SEX_LABEL, SIZE_LABEL, SPECIES_LABEL, formatPublishedDate, healthChips } from "@/lib/adoption/labels";
import { getAdoption } from "@/lib/api/calls/adoption";
import { getViewerFavoriteIds } from "@/lib/api/calls/favorite";
import { findMyConversation } from "@/lib/api/calls/chat";
import { Conversation } from "@/lib/api/models/chat/chat";
import { chatsHref, conversationHref } from "@/lib/chat/chat-query";
import ContactOwner from "@/app/components/chat/contact-owner";
import { getAccessToken } from "@/lib/auth/session";
import FavoriteButton from "@/app/components/adoption/favorite-button";
import { Adoption } from "@/lib/api/models/adoption/adoption";
import { AdoptionStatus } from "@/lib/api/models/adoption/adoption-status";
import { ProfileType } from "@/lib/api/models/profile/profile-type";
import DeleteAdoptionButton from "@/app/components/adoption/delete-adoption-button";
import StatusChangeButton from "@/app/components/adoption/status-change-button";
import { adoptedLabel } from "@/lib/adoption/labels";
import BackLink from "./back-link";
import PhotoGallery from "./photo-gallery";
import RemovePublishedParam from "./remove-published-param";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type Loaded = { kind: "ok"; adoption: Adoption } | { kind: "not-found" } | { kind: "error" };

async function load(rawId: string): Promise<Loaded> {
  if (!/^\d+$/.test(rawId)) return { kind: "not-found" };
  try {
    const adoption = await getAdoption(Number(rawId));
    return adoption ? { kind: "ok", adoption } : { kind: "not-found" };
  } catch {
    return { kind: "error" };
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const result = await load((await params).id);
  return { title: result.kind === "ok" ? `${result.adoption.petName} — Adoptr` : "Mascota en adopción — Adoptr" };
}

export default async function AdoptionDetailPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const result = await load((await params).id);
  if (result.kind === "not-found") notFound();

  if (result.kind === "error") {
    return (
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 md:px-6">
        <BackLink />
        <div role="alert" className="mt-6 rounded-card border-3 border-ink bg-surface p-8 shadow-panel">
          <h1 className="font-display text-4xl text-primary">No pudimos cargar esta mascota</h1>
          <p className="mt-3 text-[17px]">Probá de nuevo en unos minutos.</p>
        </div>
      </div>
    );
  }

  const pet = result.adoption;
  const adopted = pet.status === AdoptionStatus.ADOPTED;
  const owner = pet.viewerIsOwner;
  const [favoriteIds, loggedIn] = owner
    ? [new Set<number>(), true]
    : await Promise.all([getViewerFavoriteIds(), getAccessToken().then(Boolean)]);
  // Si ya le escribió, «Contactar» lleva directo a ese chat (también si la mascota ya fue adoptada).
  const conversation: Conversation | null =
    !owner && loggedIn ? await findMyConversation(pet.id).catch(() => null) : null;
  const justPublished = (await searchParams).published === "1" && owner;
  const facts = [
    pet.size ? { label: "Tamaño", value: SIZE_LABEL[pet.size] } : { label: "Especie", value: SPECIES_LABEL[pet.species] },
    { label: "Edad", value: formatAge(birthMonthToAge(pet.estimatedBirthDate)) },
    { label: "Sexo", value: SEX_LABEL[pet.sex] },
    { label: "Ubicación", value: `${pet.locality.displayName}, ${pet.province.name}` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 md:px-6">
      <BackLink justPublished={justPublished} owner={owner} />

      {justPublished && <RemovePublishedParam />}
      {justPublished && (
        <div role="status" className="mt-6 rounded-card border-3 border-ink bg-positive-soft p-5 shadow-card">
          <p className="font-display text-2xl">¡Listo! Publicaste a {pet.petName}.</p>
          <p className="mt-1 text-[17px]">Ya la pueden ver quienes buscan adoptar.</p>
        </div>
      )}
      {adopted && !owner && (
        <div role="status" className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-card border-3 border-ink bg-surface p-5 shadow-card">
          <p className="font-display text-2xl">{pet.petName} ya encontró una familia.</p>
          <Button href="/adoptions" variant="secondary">
            Ver otras mascotas en adopción
          </Button>
        </div>
      )}

      <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <PhotoGallery id={pet.id} species={pet.species} petName={pet.petName} photos={pet.photos}>
          {owner ? null : adopted ? <Badge variant="danger">{adoptedLabel(pet.sex)}</Badge> : <Badge variant="surface">En adopción</Badge>}
        </PhotoGallery>

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-[52px] leading-none text-primary md:text-[42px]">{pet.petName}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {owner && <StatusPill adopted={adopted} label={adopted ? adoptedLabel(pet.sex) : "En adopción"} />}
                <p className="text-[15px] text-ink-soft">Publicado el {formatPublishedDate(pet.createdAt)}</p>
              </div>
            </div>
            {!owner && (
              <FavoriteButton
                adoptionId={pet.id}
                petName={pet.petName}
                initial={{ saved: favoriteIds.has(pet.id), loggedIn }}
              />
            )}
            {owner && (
              <div className="flex flex-wrap items-center gap-3">
                <Button href={`/adoptions/${pet.id}/edit`} variant="secondary" size="sm">
                  <PencilSimple aria-hidden={true} weight="bold" className="h-5 w-5" />
                  Editar
                </Button>
                <StatusChangeButton target={{ adoptionId: pet.id, petName: pet.petName, sex: pet.sex, status: pet.status }} />
                {canDelete(pet.status) && <DeleteAdoptionButton target={{ adoptionId: pet.id, petName: pet.petName }} />}
              </div>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-3">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-field border-3 border-ink bg-surface px-4 py-3">
                <dt className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-soft">{fact.label}</dt>
                <dd className="mt-1 text-[17px] font-bold">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <HealthChips chips={healthChips(pet)} size="md" />

          <section>
            <h2 className="text-[22px] font-bold">Su historia</h2>
            <p className="mt-2 whitespace-pre-line text-[17px] leading-[1.55]">{pet.description}</p>
          </section>

          {pet.owner && !owner && (
            <section
              aria-label="Quién la publica"
              className="flex items-center gap-4 rounded-card border-3 border-ink bg-surface p-4"
            >
              <span
                aria-hidden="true"
                className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-3 border-ink bg-accent-mustard font-display text-2xl"
              >
                {pet.owner.photoUrl ? (
                  <Image src={pet.owner.photoUrl} alt="" fill unoptimized className="object-cover" />
                ) : (
                  pet.owner.displayName.charAt(0).toUpperCase()
                )}
              </span>
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-soft">Lo publica</p>
                <Link
                  href={`/profiles/${pet.owner.profileId}`}
                  className="text-[17px] font-bold text-primary underline underline-offset-3 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-teal"
                >
                  {pet.owner.displayName}
                </Link>
                <p className="text-sm text-ink-soft">
                  {pet.owner.profileType === ProfileType.ORGANIZATION ? "Organización" : "Particular"}
                </p>
              </div>
            </section>
          )}

          {!owner && (
            <Contact
              petId={pet.id}
              petName={pet.petName}
              ownerName={pet.owner?.displayName ?? "quien la publicó"}
              adopted={adopted}
              loggedIn={loggedIn}
              conversation={conversation}
            />
          )}
          {owner && (
            <Link
              href={chatsHref({ tab: "mine", pet: pet.id })}
              className="self-start text-[15px] font-bold text-primary underline underline-offset-3 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-teal"
            >
              Ver los chats sobre {pet.petName}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Contact({
  petId,
  petName,
  ownerName,
  adopted,
  loggedIn,
  conversation,
}: {
  petId: number;
  petName: string;
  ownerName: string;
  adopted: boolean;
  loggedIn: boolean;
  conversation: Conversation | null;
}) {
  if (conversation) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Button href={conversationHref(conversation)} variant={adopted ? "secondary" : "cta"}>
          Ver tu chat con {ownerName}
        </Button>
      </div>
    );
  }
  // Adoptada: el back no deja iniciar un chat nuevo (409 `CHAT_READ_ONLY`).
  if (adopted) return null;
  if (!loggedIn) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Button href="/login" variant="cta">
          Contactar
        </Button>
        <p className="text-[15px] text-ink-soft">Ingresá para escribirle a {ownerName}.</p>
      </div>
    );
  }
  return <ContactOwner publicationId={petId} petName={petName} ownerName={ownerName} />;
}

function StatusPill({ adopted, label }: { adopted: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border-2 border-ink px-3.5 py-1 text-[15px] font-bold ${
        adopted ? "bg-danger text-white" : "bg-positive-soft text-ink"
      }`}
    >
      {label}
    </span>
  );
}
