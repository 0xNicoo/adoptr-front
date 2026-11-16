"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState, useTransition } from "react";
import {
  ProfilePhotoResult,
  createProfileAction,
  deleteProfilePhotoAction,
  setGoogleProfilePhotoAction,
  setProfilePhotoAction,
  updateProfileAction,
} from "@/actions/profile";
import LocationSelector from "@/app/components/location-selector";
import Button from "@/app/components/ui/button";
import { FieldError, FieldHelp, Label, RadioCard, RadioPill, inputClass, labelClass } from "@/app/components/ui/form-field";
import { useToast } from "@/app/components/ui/toast";
import { Province } from "@/lib/api/models/locality/province";
import { Gender } from "@/lib/api/models/profile/gender";
import { Profile } from "@/lib/api/models/profile/profile";
import { ProfileType } from "@/lib/api/models/profile/profile-type";
import { PhotoChoice, photoAction, photoPreviewUrl, profilePhotoErrorMessage } from "@/lib/profile/photo";
import {
  EMPTY_PROFILE_DRAFT,
  MAX_DESCRIPTION,
  MAX_NAME,
  MAX_ORGANIZATION_NAME,
  MAX_SOCIAL,
  MAX_WEBSITE,
  ProfileDraft,
  ProfileErrors,
  ProfileField,
  ProfileSection,
  draftFromProfile,
  toCreateProfileInput,
  toUpdateProfileInput,
  validateProfileSection,
} from "@/lib/profile/profile-form";
import PhotoStep, { PhotoCircle } from "./photo-step";

const STEPS = ["Tipo", "Datos", "Ubicación", "Descripción", "Foto", "Revisión"] as const;
const PHOTO_STEP = 5;
const LAST_STEP = STEPS.length;

const STEP_SECTIONS: Partial<Record<number, ProfileSection>> = { 1: "type", 2: "data", 3: "location", 4: "description" };

function validateStep(step: number, draft: ProfileDraft): ProfileErrors {
  const section = STEP_SECTIONS[step];
  return section ? validateProfileSection(section, draft) : {};
}

const TYPES = [
  {
    value: ProfileType.PERSON,
    title: "Una persona",
    label: "Persona",
    description: "Una cuenta a tu nombre: nombre, apellido y género.",
  },
  {
    value: ProfileType.ORGANIZATION,
    title: "Una organización",
    label: "Organización",
    description: "Refugio, grupo de rescate u ONG. El perfil se muestra con el nombre de la organización.",
  },
];

const PHOTO_REVIEW_TEXT: Record<PhotoChoice["kind"], string> = {
  none: "Sin foto",
  current: "Tu foto actual",
  google: "Tu foto de Google",
  upload: "La foto que subiste",
};

const GENDERS = [
  { value: Gender.FEMALE, label: "Femenino" },
  { value: Gender.MALE, label: "Masculino" },
  { value: Gender.X, label: "X" },
];

// Orden en que se busca el primer campo con error para llevarle el foco.
const FIELD_IDS: Record<ProfileField, string> = {
  profileType: "profile-type",
  firstName: "first-name",
  lastName: "last-name",
  genderType: "gender",
  organizationName: "organization-name",
  instagram: "instagram",
  facebook: "facebook",
  website: "website",
  province: "location",
  locality: "location",
  description: "description",
};

type SubmitError = { kind: "exists" } | { kind: "generic"; message: string };

async function applyPhoto(photo: PhotoChoice, hadPhoto: boolean): Promise<ProfilePhotoResult> {
  switch (photoAction(photo, hadPhoto)) {
    case "keep":
      return { ok: true };
    case "delete":
      return deleteProfilePhotoAction();
    case "google":
      return setGoogleProfilePhotoAction();
    case "upload": {
      const formData = new FormData();
      if (photo.kind === "upload") formData.append("file", photo.file, photo.file.name);
      return setProfilePhotoAction(formData);
    }
  }
}

export default function ProfileForm({
  provinces,
  googlePhotoUrl,
  editing,
}: {
  provinces: Province[];
  googlePhotoUrl: string | null;
  editing?: { profile: Profile };
}) {
  const router = useRouter();
  const toast = useToast();
  const currentPhotoUrl = editing?.profile.photoUrl ?? null;
  const hadPhoto = currentPhotoUrl !== null;
  const [step, setStep] = useState(editing ? LAST_STEP : 1);
  const [draft, setDraft] = useState<ProfileDraft>(() =>
    editing ? draftFromProfile(editing.profile) : EMPTY_PROFILE_DRAFT,
  );
  const [photo, setPhoto] = useState<PhotoChoice>(hadPhoto ? { kind: "current" } : { kind: "none" });
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [submitError, setSubmitError] = useState<SubmitError | null>(null);
  const [done, setDone] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (photo.kind !== "upload") return;
    const url = photo.previewUrl;
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Al cambiar de paso, el foco va al título del paso para que se anuncie.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, done]);

  const isOrganization = draft.profileType === ProfileType.ORGANIZATION;
  const displayName = isOrganization
    ? draft.organizationName.trim()
    : `${draft.firstName.trim()} ${draft.lastName.trim()}`.trim();
  const province = provinces.find((p) => p.id === draft.location.provinceId);

  function update<K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K], clears: ProfileField[] = []) {
    setDraft((current) => ({ ...current, [key]: value }));
    if (clears.length) {
      setErrors((current) => {
        const next = { ...current };
        clears.forEach((field) => delete next[field]);
        return next;
      });
    }
  }

  function showErrors(next: ProfileErrors) {
    setErrors(next);
    const first = (Object.keys(FIELD_IDS) as ProfileField[]).find((field) => next[field]);
    if (first) {
      requestAnimationFrame(() => {
        const element = document.getElementById(FIELD_IDS[first]);
        const selector = 'input, select, textarea, button[aria-haspopup="listbox"]';
        const focusable = element?.matches(selector)
          ? element
          : element?.querySelector<HTMLElement>(selector);
        focusable?.focus();
      });
    }
  }

  function goTo(target: number) {
    setErrors({});
    setSubmitError(null);
    setStep(target);
  }

  function next() {
    const found = validateStep(step, draft);
    if (Object.keys(found).length) {
      showErrors(found);
      return;
    }
    goTo(step + 1);
  }

  function backToReview() {
    const found = validateStep(step, draft);
    if (Object.keys(found).length) {
      showErrors(found);
      return;
    }
    goTo(LAST_STEP);
  }

  async function savePhotoChange(): Promise<boolean> {
    if (photoAction(photo, hadPhoto) === "keep") return true;
    setSavingPhoto(true);
    const photoResult = await applyPhoto(photo, hadPhoto);
    setSavingPhoto(false);
    setPhotoError(photoResult.ok ? null : profilePhotoErrorMessage(photoResult.code));
    return photoResult.ok;
  }

  function finishEditing() {
    toast("Guardaste los cambios de tu perfil.");
    router.push("/profile");
  }

  function handleSaveError(code: string, fallback: string) {
    switch (code) {
      case "PROFILE_ALREADY_EXISTS":
        setSubmitError({ kind: "exists" });
        break;
      case "LOCALITY_NOT_FOUND":
        update("location", { provinceId: draft.location.provinceId, locality: null });
        setStep(3);
        showErrors({ locality: "Esa localidad ya no está disponible. Elegí otra." });
        break;
      case "VALIDATION_ERROR":
        setSubmitError({ kind: "generic", message: "Hay datos que no pudimos guardar. Revisalos y probá de nuevo." });
        break;
      default:
        setSubmitError({ kind: "generic", message: fallback });
    }
  }

  function submit() {
    // Se revalida todo por si se editó un paso desde la revisión.
    for (let s = editing ? 2 : 1; s < LAST_STEP; s++) {
      const found = validateStep(s, draft);
      if (Object.keys(found).length) {
        setStep(s);
        showErrors(found);
        return;
      }
    }
    setSubmitError(null);
    setPhotoError(null);
    startTransition(async () => {
      if (editing) {
        const result = await updateProfileAction(toUpdateProfileInput(draft));
        if (!result.ok) {
          handleSaveError(result.code, "No pudimos guardar los cambios. Probá de nuevo en unos minutos.");
          return;
        }
        if (await savePhotoChange()) finishEditing();
        return;
      }
      const result = await createProfileAction(toCreateProfileInput(draft));
      if (!result.ok) {
        handleSaveError(result.code, "No pudimos crear tu perfil. Probá de nuevo en unos minutos.");
        return;
      }
      await savePhotoChange();
      setDone(true);
    });
  }

  function retryPhoto() {
    startTransition(async () => {
      if ((await savePhotoChange()) && editing) finishEditing();
    });
  }

  if (done) {
    const name = isOrganization ? draft.organizationName.trim() : draft.firstName.trim();
    return (
      <section className="mx-auto flex max-w-2xl flex-col items-start gap-5 rounded-card border-3 border-ink bg-surface p-8 shadow-panel md:p-11">
        <span className="rounded-full border-2 border-ink bg-positive px-3.5 py-1.5 text-sm font-bold">Perfil creado</span>
        <h1 ref={headingRef} tabIndex={-1} className="font-display text-5xl leading-tight text-primary outline-none">
          ¡Listo, {name}!
        </h1>
        <p className="text-[17px] leading-relaxed">
          Ya no vas a tener que repetir estos datos. Podés editarlos cuando quieras desde tu perfil.
        </p>
        {photoError && (
          <div role="alert" className="flex w-full flex-col gap-3 rounded-field border-3 border-danger bg-danger-soft px-5 py-4">
            <p className="font-semibold">
              Tu perfil quedó creado, pero no pudimos guardar la foto. {photoError}
            </p>
            <div>
              <Button variant="secondary" size="sm" onClick={retryPhoto} disabled={pending}>
                {pending ? "Subiendo la foto…" : "Reintentar"}
              </Button>
            </div>
          </div>
        )}
        <Button variant="cta" href="/profile" disabled={pending}>
          {photoError ? "Seguir sin foto" : "Ir a mi perfil"}
        </Button>
      </section>
    );
  }

  const fieldProps = (field: ProfileField, describedBy?: string) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": [errors[field] ? `${FIELD_IDS[field]}-error` : null, describedBy].filter(Boolean).join(" ") || undefined,
  });

  const error = (field: ProfileField) =>
    errors[field] ? <FieldError id={`${FIELD_IDS[field]}-error`}>{errors[field]}</FieldError> : null;

  const stepTitle = [
    "¿Quién crea este perfil?",
    isOrganization ? "Sobre la organización" : "Sobre vos",
    isOrganization ? "¿Dónde están?" : "¿Dónde vivís?",
    isOrganization ? "Contanos de la organización" : "Contanos de vos",
    isOrganization ? "Una foto o el logo" : "Tu foto",
    "Revisá los datos",
  ][step - 1];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-7">
      <div className="flex flex-col gap-2.5">
        <h1 className="font-display text-[40px] leading-tight text-primary md:text-[56px]">
          {editing ? "Editá tu perfil" : "Completá tu perfil"}
        </h1>
        <p className="max-w-2xl text-[17px] leading-relaxed">
          {editing
            ? "Los cambios se ven en tu perfil, en tus publicaciones y en tus chats."
            : "Lo cargás una sola vez y es lo que ven los demás cuando publicás una mascota o cuando te interesa adoptar."}
        </p>
      </div>

      {!editing && (
        <ol aria-label="Pasos" className="flex justify-between gap-3 md:grid md:grid-cols-6">
          {STEPS.map((label, index) => {
            const number = index + 1;
            const state = number < step ? "done" : number === step ? "current" : "todo";
            return (
              <li key={label} aria-current={state === "current" ? "step" : undefined} className="flex items-center gap-2.5 font-semibold">
                <span
                  className={
                    "flex size-9 flex-none items-center justify-center rounded-full border-[2.5px] border-ink text-[15px] font-bold " +
                    (state === "done" ? "bg-positive" : state === "current" ? "bg-primary text-white" : "bg-disabled text-ink-soft")
                  }
                >
                  {number}
                </span>
                <span className={`hidden md:inline ${state === "todo" ? "text-ink-soft" : ""}`}>
                  {label}
                  {state === "done" && <span className="sr-only"> (completo)</span>}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <section
        aria-labelledby="step-title"
        className="flex flex-col gap-7 rounded-card border-3 border-ink bg-surface p-6 shadow-card md:p-9 md:shadow-panel"
      >
        <h2 id="step-title" ref={headingRef} tabIndex={-1} className="font-display text-[34px] leading-tight outline-none md:text-[38px]">
          {stepTitle}
        </h2>

        {step === 1 && (
          <fieldset id={FIELD_IDS.profileType} className="flex flex-col gap-4" {...fieldProps("profileType", "profile-type-help")}>
            <legend className="sr-only">Tipo de perfil</legend>
            <FieldHelp id="profile-type-help">
              En los dos casos vas a poder adoptar y publicar mascotas en adopción. Solo cambian los datos que te pedimos.
            </FieldHelp>
            <div className="grid gap-5 md:grid-cols-2">
              {TYPES.map((type) => (
                <RadioCard
                  key={type.value}
                  name="profile-type"
                  value={type.value}
                  checked={draft.profileType === type.value}
                  onChange={() => update("profileType", type.value, ["profileType"])}
                  title={type.title}
                  description={type.description}
                />
              ))}
            </div>
            {error("profileType")}
          </fieldset>
        )}

        {step === 2 && !isOrganization && (
          <div className="flex flex-col gap-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor={FIELD_IDS.firstName}>Nombre</Label>
                <input
                  id={FIELD_IDS.firstName}
                  className={inputClass}
                  autoComplete="given-name"
                  maxLength={MAX_NAME}
                  value={draft.firstName}
                  onChange={(e) => update("firstName", e.target.value, ["firstName"])}
                  {...fieldProps("firstName")}
                />
                {error("firstName")}
              </div>
              <div>
                <Label htmlFor={FIELD_IDS.lastName}>Apellido</Label>
                <input
                  id={FIELD_IDS.lastName}
                  className={inputClass}
                  autoComplete="family-name"
                  maxLength={MAX_NAME}
                  value={draft.lastName}
                  onChange={(e) => update("lastName", e.target.value, ["lastName"])}
                  {...fieldProps("lastName")}
                />
                {error("lastName")}
              </div>
            </div>
            <fieldset id={FIELD_IDS.genderType} {...fieldProps("genderType")}>
              <legend className={labelClass}>Género</legend>
              <div className="flex flex-wrap gap-3">
                {GENDERS.map((gender) => (
                  <RadioPill
                    key={gender.value}
                    name="gender"
                    value={gender.value}
                    checked={draft.genderType === gender.value}
                    onChange={() => update("genderType", gender.value, ["genderType"])}
                  >
                    {gender.label}
                  </RadioPill>
                ))}
              </div>
              {error("genderType")}
            </fieldset>
          </div>
        )}

        {step === 2 && isOrganization && (
          <div className="flex flex-col gap-6">
            <div>
              <Label htmlFor={FIELD_IDS.organizationName}>Nombre de la organización</Label>
              <input
                id={FIELD_IDS.organizationName}
                className={inputClass}
                autoComplete="organization"
                placeholder="Ej.: Refugio Patitas"
                maxLength={MAX_ORGANIZATION_NAME}
                value={draft.organizationName}
                onChange={(e) => update("organizationName", e.target.value, ["organizationName"])}
                {...fieldProps("organizationName")}
              />
              {error("organizationName")}
            </div>
            <fieldset className="flex flex-col gap-5">
              <legend className={`${labelClass} mb-1`}>
                Redes y sitio web{" "}
                <span className="font-normal normal-case tracking-normal text-ink-soft">(opcional)</span>
              </legend>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <Label htmlFor={FIELD_IDS.instagram}>Instagram</Label>
                  <input
                    id={FIELD_IDS.instagram}
                    className={inputClass}
                    placeholder="@turefugio"
                    maxLength={MAX_SOCIAL}
                    value={draft.instagram}
                    onChange={(e) => update("instagram", e.target.value, ["instagram"])}
                    {...fieldProps("instagram")}
                  />
                  {error("instagram")}
                </div>
                <div>
                  <Label htmlFor={FIELD_IDS.facebook}>Facebook</Label>
                  <input
                    id={FIELD_IDS.facebook}
                    className={inputClass}
                    placeholder="facebook.com/turefugio"
                    maxLength={MAX_SOCIAL}
                    value={draft.facebook}
                    onChange={(e) => update("facebook", e.target.value, ["facebook"])}
                    {...fieldProps("facebook")}
                  />
                  {error("facebook")}
                </div>
              </div>
              <div>
                <Label htmlFor={FIELD_IDS.website}>Sitio web</Label>
                <input
                  id={FIELD_IDS.website}
                  type="url"
                  className={inputClass}
                  placeholder="https://turefugio.org"
                  maxLength={MAX_WEBSITE}
                  value={draft.website}
                  onChange={(e) => update("website", e.target.value, ["website"])}
                  {...fieldProps("website")}
                />
                {error("website")}
              </div>
            </fieldset>
          </div>
        )}

        {step === 3 && (
          <div id={FIELD_IDS.province}>
            <LocationSelector
              provinces={provinces}
              value={draft.location}
              onChange={(value) => update("location", value, ["province", "locality"])}
              provinceError={errors.province}
              localityError={errors.locality}
            />
          </div>
        )}

        {step === 4 && (
          <div>
            <Label htmlFor={FIELD_IDS.description}>Descripción</Label>
            <textarea
              id={FIELD_IDS.description}
              className={`${inputClass} min-h-40 resize-y leading-relaxed`}
              maxLength={MAX_DESCRIPTION}
              value={draft.description}
              onChange={(e) => update("description", e.target.value, ["description"])}
              {...fieldProps("description", "description-help description-count")}
            />
            <div className="flex flex-wrap justify-between gap-x-4">
              <FieldHelp id="description-help">
                {isOrganization
                  ? "Qué hacen, desde cuándo, cómo trabajan con las adopciones y lo que te gustaría que sepan los demás."
                  : "Contá quién sos: si rescatás o querés adoptar, tu experiencia con animales y lo que te gustaría que sepan los demás."}
              </FieldHelp>
              <FieldHelp id="description-count">
                {draft.description.length}/{MAX_DESCRIPTION}
              </FieldHelp>
            </div>
            {error("description")}
          </div>
        )}

        {step === PHOTO_STEP && (
          <PhotoStep
            value={photo}
            onChange={setPhoto}
            googlePhotoUrl={googlePhotoUrl}
            currentPhotoUrl={currentPhotoUrl}
            name={displayName}
          />
        )}

        {step === LAST_STEP && (
          <dl className="flex flex-col gap-5">
            <ReviewRow label="Perfil de" onEdit={editing ? undefined : () => goTo(1)} editLabel="Cambiar tipo de perfil">
              {TYPES.find((t) => t.value === draft.profileType)?.label}
            </ReviewRow>
            {isOrganization ? (
              <ReviewRow label="Organización" onEdit={() => goTo(2)} editLabel="Editar datos de la organización">
                {draft.organizationName.trim()}
                <span className="mt-1 block text-ink-soft">
                  {[
                    draft.instagram.trim() && `Instagram: ${draft.instagram.trim()}`,
                    draft.facebook.trim() && `Facebook: ${draft.facebook.trim()}`,
                    draft.website.trim() && `Web: ${draft.website.trim()}`,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "Sin redes cargadas"}
                </span>
              </ReviewRow>
            ) : (
              <ReviewRow label="Nombre y género" onEdit={() => goTo(2)} editLabel="Editar nombre y género">
                {draft.firstName.trim()} {draft.lastName.trim()}
                <span className="mt-1 block text-ink-soft">
                  {GENDERS.find((g) => g.value === draft.genderType)?.label}
                </span>
              </ReviewRow>
            )}
            <ReviewRow label="Ubicación" onEdit={() => goTo(3)} editLabel="Editar ubicación">
              {draft.location.locality?.displayName}, {province?.name}
            </ReviewRow>
            <ReviewRow label="Descripción" onEdit={() => goTo(4)} editLabel="Editar descripción">
              <span className="whitespace-pre-line">{draft.description.trim()}</span>
            </ReviewRow>
            <ReviewRow label="Foto" onEdit={() => goTo(PHOTO_STEP)} editLabel="Cambiar foto">
              <span className="flex items-center gap-3">
                <PhotoCircle url={photoPreviewUrl(photo, googlePhotoUrl, currentPhotoUrl)} name={displayName} size="sm" />
                {PHOTO_REVIEW_TEXT[photo.kind]}
              </span>
            </ReviewRow>
          </dl>
        )}

        {editing && photoError && (
          <div role="alert" className="flex flex-col gap-3 rounded-field border-3 border-danger bg-danger-soft px-5 py-4">
            <p className="font-semibold">Guardamos tus datos, pero no pudimos guardar la foto. {photoError}</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="sm" onClick={retryPhoto} disabled={pending}>
                {pending ? "Subiendo la foto…" : "Reintentar"}
              </Button>
              <Button variant="secondary" size="sm" href="/profile" disabled={pending}>
                Ir a mi perfil
              </Button>
            </div>
          </div>
        )}

        {submitError && (
          <div role="alert" className="rounded-field border-3 border-danger bg-danger-soft px-5 py-4 font-semibold">
            {submitError.kind === "exists" ? (
              <>
                Ya tenés un perfil creado.{" "}
                <Link href="/profile" className="text-primary underline">
                  Ir a mi perfil
                </Link>
              </>
            ) : (
              submitError.message
            )}
          </div>
        )}

        <div className="flex flex-col-reverse items-stretch gap-4 border-t-3 border-ink pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {!editing && step > 1 && (
              <Button variant="secondary" onClick={() => goTo(step - 1)} disabled={pending}>
                Atrás
              </Button>
            )}
            <Link
              href={editing ? "/profile" : "/"}
              className="inline-flex min-h-11 items-center px-1.5 font-semibold text-primary underline underline-offset-3 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-cta"
            >
              {editing ? "Cancelar" : "Completar más tarde"}
            </Link>
          </div>
          {editing && step < LAST_STEP ? (
            <Button variant="cta" onClick={backToReview}>
              Volver a la revisión
            </Button>
          ) : step < LAST_STEP ? (
            <Button variant="cta" onClick={next}>
              Siguiente
            </Button>
          ) : (
            <Button variant="cta" onClick={submit} disabled={pending}>
              {savingPhoto
                ? "Subiendo la foto…"
                : pending
                  ? editing
                    ? "Guardando…"
                    : "Creando perfil…"
                  : editing
                    ? "Guardar cambios"
                    : "Crear perfil"}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function ReviewRow({
  label,
  onEdit,
  editLabel,
  children,
}: {
  label: string;
  onEdit?: () => void;
  editLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-t-2 border-disabled pt-5 first:border-t-0 first:pt-0">
      <div className="min-w-0">
        <dt className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-soft">{label}</dt>
        <dd className="mt-1 text-[17px] leading-relaxed wrap-anywhere">{children}</dd>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={editLabel}
          className="min-h-11 flex-none px-1.5 font-semibold text-primary underline underline-offset-3 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-cta"
        >
          Editar
        </button>
      )}
    </div>
  );
}
