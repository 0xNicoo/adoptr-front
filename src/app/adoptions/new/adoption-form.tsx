"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState, useTransition } from "react";
import { addAdoptionPhotoAction, createAdoptionAction } from "@/actions/adoption";
import LocationSelector, { LocationValue } from "@/app/components/location-selector";
import Select from "@/app/components/ui/select";
import Button from "@/app/components/ui/button";
import { FieldError, FieldHelp, Label, RadioPill, inputClass } from "@/app/components/ui/form-field";
import HealthChips from "@/app/components/ui/health-chips";
import Stepper from "@/app/components/ui/stepper";
import {
  ADOPTION_STEPS,
  AdoptionDraft,
  AdoptionErrors,
  AdoptionField,
  EMPTY_ADOPTION_DRAFT,
  MAX_DESCRIPTION,
  MAX_PET_NAME,
  STEP,
  firstInvalidStep,
  toAdoptionInput,
  validateAdoptionStep,
  withSpecies,
} from "@/lib/adoption/adoption-form";
import { MAX_AGE_YEARS, ageToBirthMonth, formatAge, formatBirthMonth } from "@/lib/adoption/age";
import { SEX_LABEL, SIZE_LABEL, SPECIES_LABEL, healthChips } from "@/lib/adoption/labels";
import { PhotoUploadFailure, photoUploadMessage, uploadInOrder } from "@/lib/adoption/photos";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";
import { PetSize } from "@/lib/api/models/adoption/pet-size";
import { Species } from "@/lib/api/models/adoption/species";
import { Province } from "@/lib/api/models/locality/province";
import PhotoPicker, { DraftPhoto, useDraftPhotos } from "./photo-picker";

const LAST_STEP = STEP.REVIEW;

const FIELD_IDS: Record<AdoptionField, string> = {
  species: "species",
  petName: "pet-name",
  sex: "sex",
  size: "size",
  age: "age-years",
  vaccinated: "vaccinated",
  dewormed: "dewormed",
  neutered: "neutered",
  province: "location",
  locality: "location",
  description: "description",
};

const SEX_OPTIONS = [
  { value: PetSex.MALE, label: "Macho" },
  { value: PetSex.FEMALE, label: "Hembra" },
  { value: PetSex.UNKNOWN, label: "No sé" },
];

const SIZE_ART: Record<PetSize, string> = {
  [PetSize.SMALL]: "w-12",
  [PetSize.MEDIUM]: "w-16",
  [PetSize.LARGE]: "w-20",
};

const HEALTH_QUESTIONS: { field: "vaccinated" | "dewormed" | "neutered"; question: string }[] = [
  { field: "vaccinated", question: "¿Está vacunado?" },
  { field: "dewormed", question: "¿Está desparasitado?" },
  { field: "neutered", question: "¿Está castrado?" },
];

const STEP_TITLES = [
  "¿Qué animal vas a publicar?",
  "Contanos cómo es",
  "Su salud",
  "¿Dónde está?",
  "Contanos su historia",
  "Sumá fotos",
  "Revisá la publicación",
];

type SubmitError = { message: string };

export default function AdoptionForm({
  provinces,
  initialLocation,
}: {
  provinces: Province[];
  initialLocation: LocationValue;
}) {
  const router = useRouter();
  const [step, setStep] = useState<number>(STEP.ANIMAL);
  const [draft, setDraft] = useState<AdoptionDraft>({ ...EMPTY_ADOPTION_DRAFT, location: initialLocation });
  const [errors, setErrors] = useState<AdoptionErrors>({});
  const [submitError, setSubmitError] = useState<SubmitError | null>(null);
  const [pending, startTransition] = useTransition();
  const draftPhotos = useDraftPhotos();
  const { photos, rejected: rejectedPhotos, add: addPhotos, remove: removePhoto } = draftPhotos;
  // Una vez creada la publicación no se vuelve a crear: un reintento solo sube las fotos que faltan.
  const [publishedId, setPublishedId] = useState<number | null>(null);
  const [uploadFailures, setUploadFailures] = useState<PhotoUploadFailure<DraftPhoto>[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const isDog = draft.species === Species.DOG;
  const province = provinces.find((p) => p.id === draft.location.provinceId);
  const age =
    draft.ageYears !== null && draft.ageMonths !== null ? { years: draft.ageYears, months: draft.ageMonths } : null;

  function update(next: Partial<AdoptionDraft>, clears: AdoptionField[] = []) {
    setDraft((current) => ({ ...current, ...next }));
    if (clears.length) {
      setErrors((current) => {
        const copy = { ...current };
        clears.forEach((field) => delete copy[field]);
        return copy;
      });
    }
  }

  function showErrors(next: AdoptionErrors) {
    setErrors(next);
    const first = (Object.keys(FIELD_IDS) as AdoptionField[]).find((field) => next[field]);
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
    const found = validateAdoptionStep(step, draft);
    if (Object.keys(found).length) {
      showErrors(found);
      return;
    }
    goTo(step + 1);
  }

  async function uploadPhotos(adoptionId: number, pendingPhotos: DraftPhoto[]) {
    const failures = await uploadInOrder(
      pendingPhotos,
      async (photo) => {
        const formData = new FormData();
        formData.append("file", photo.file);
        const result = await addAdoptionPhotoAction(adoptionId, formData);
        return result.ok ? null : result.code;
      },
      (current, total) => setUploadProgress({ current, total }),
    );
    setUploadProgress(null);
    setUploadFailures(failures);
    if (failures.length === 0) {
      router.push(`/adoptions/${adoptionId}?published=1`);
    }
  }

  function retryPhotos() {
    if (publishedId === null) return;
    const pendingPhotos = uploadFailures.map((failure) => failure.item);
    startTransition(() => uploadPhotos(publishedId, pendingPhotos));
  }

  function submit() {
    const invalid = firstInvalidStep(draft);
    if (invalid !== null) {
      setStep(invalid);
      showErrors(validateAdoptionStep(invalid, draft));
      return;
    }
    setSubmitError(null);
    startTransition(async () => {
      const result = await createAdoptionAction(toAdoptionInput(draft));
      if (result.ok) {
        setPublishedId(result.id);
        await uploadPhotos(result.id, photos);
        return;
      }
      if (result.code === "LOCALITY_NOT_FOUND") {
        update({ location: { provinceId: draft.location.provinceId, locality: null } });
        setStep(STEP.LOCATION);
        showErrors({ locality: "Esa localidad ya no está disponible. Elegí otra." });
        return;
      }
      setSubmitError({
        message:
          result.code === "VALIDATION_ERROR"
            ? "Hay datos que no pudimos guardar. Revisalos y probá de nuevo."
            : "No pudimos publicar la mascota. Probá de nuevo en unos minutos.",
      });
    });
  }

  const fieldProps = (field: AdoptionField, describedBy?: string) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby":
      [errors[field] ? `${FIELD_IDS[field]}-error` : null, describedBy].filter(Boolean).join(" ") || undefined,
  });

  const error = (field: AdoptionField) =>
    errors[field] ? <FieldError id={`${FIELD_IDS[field]}-error`}>{errors[field]}</FieldError> : null;

  const published = publishedId !== null;
  const locked = pending || published;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-7">
      <div className="flex flex-col gap-2.5">
        <h1 className="font-display text-[40px] leading-tight text-primary md:text-[56px]">Publicar una mascota</h1>
        <p className="max-w-2xl text-[17px] leading-relaxed">
          Cargá su ficha y la van a poder conocer quienes buscan adoptar.
        </p>
      </div>

      <section
        aria-labelledby="step-title"
        className="flex flex-col gap-7 rounded-card border-3 border-ink bg-surface p-6 shadow-card md:p-9 md:shadow-panel"
      >
        <Stepper steps={ADOPTION_STEPS} current={step} />

        <h2
          id="step-title"
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-[34px] leading-tight text-primary outline-none md:text-[40px]"
        >
          {STEP_TITLES[step - 1]}
        </h2>

        {step === STEP.ANIMAL && (
          <fieldset id={FIELD_IDS.species} {...fieldProps("species")}>
            <legend className="sr-only">Especie</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              {[Species.DOG, Species.CAT].map((species) => (
                <label
                  key={species}
                  className={
                    "halftone flex min-h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-card border-3 border-ink bg-surface p-6 " +
                    "has-checked:bg-accent-mustard has-checked:shadow-card " +
                    "has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-accent-teal"
                  }
                >
                  <input
                    type="radio"
                    name="species"
                    className="sr-only"
                    checked={draft.species === species}
                    onChange={() => {
                      setDraft((current) => withSpecies(current, species));
                      setErrors({});
                    }}
                  />
                  <Image
                    src={species === Species.DOG ? "/illustrations/perros/perro-azul.svg" : "/illustrations/gatos/gato-crema.svg"}
                    alt=""
                    width={120}
                    height={120}
                    unoptimized
                    className="h-auto w-24"
                  />
                  <span className="font-display text-[30px]">{species === Species.DOG ? "Un perro" : "Un gato"}</span>
                </label>
              ))}
            </div>
            {error("species")}
          </fieldset>
        )}

        {step === STEP.DATA && (
          <div className="flex flex-col gap-7">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor={FIELD_IDS.petName}>Nombre</Label>
                <input
                  id={FIELD_IDS.petName}
                  className={inputClass}
                  placeholder="Ej.: Pepito"
                  maxLength={MAX_PET_NAME}
                  value={draft.petName}
                  onChange={(e) => update({ petName: e.target.value }, ["petName"])}
                  {...fieldProps("petName")}
                />
                {error("petName")}
              </div>
              <fieldset id={FIELD_IDS.sex} {...fieldProps("sex")}>
                <legend className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.08em]">Sexo</legend>
                <div className="flex flex-wrap gap-3">
                  {SEX_OPTIONS.map((option) => (
                    <RadioPill
                      key={option.value}
                      name="sex"
                      value={option.value}
                      checked={draft.sex === option.value}
                      onChange={() => update({ sex: option.value }, ["sex"])}
                    >
                      {option.label}
                    </RadioPill>
                  ))}
                </div>
                {error("sex")}
              </fieldset>
            </div>

            <fieldset id="age" {...fieldProps("age", "age-help")}>
              <legend className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.08em]">Edad aproximada</legend>
              <div className="grid max-w-md grid-cols-2 gap-4">
                <div>
                  <Select
                    id="age-years"
                    label="Años"
                    labelClassName="mb-1.5 block text-sm font-semibold"
                    value={draft.ageYears === null ? "" : String(draft.ageYears)}
                    onChange={(value) => update({ ageYears: value === "" ? null : Number(value) }, ["age"])}
                    options={[
                      { value: "", label: "Elegí" },
                      ...Array.from({ length: MAX_AGE_YEARS + 1 }, (_, n) => ({ value: String(n), label: String(n) })),
                    ]}
                    aria-invalid={errors.age ? true : undefined}
                    aria-describedby={`age-help${errors.age ? ` ${FIELD_IDS.age}-error` : ""}`}
                  />
                </div>
                <div>
                  <Select
                    id="age-months"
                    label="Meses"
                    labelClassName="mb-1.5 block text-sm font-semibold"
                    value={draft.ageMonths === null ? "" : String(draft.ageMonths)}
                    onChange={(value) => update({ ageMonths: value === "" ? null : Number(value) }, ["age"])}
                    options={[
                      { value: "", label: "Elegí" },
                      ...Array.from({ length: 12 }, (_, n) => ({ value: String(n), label: String(n) })),
                    ]}
                    aria-invalid={errors.age ? true : undefined}
                    aria-describedby={`age-help${errors.age ? ` ${FIELD_IDS.age}-error` : ""}`}
                  />
                </div>
              </div>
              <FieldHelp id="age-help">
                {age && !errors.age
                  ? `${formatAge(age)}: nació aproximadamente en ${formatBirthMonth(ageToBirthMonth(age))}.`
                  : "Si no la sabés con exactitud, poné una aproximada."}
              </FieldHelp>
              {error("age")}
            </fieldset>

            {isDog && (
              <fieldset id={FIELD_IDS.size} {...fieldProps("size")}>
                <legend className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.08em]">Tamaño</legend>
                <div className="grid gap-4 sm:grid-cols-3">
                  {Object.values(PetSize).map((size) => (
                    <label
                      key={size}
                      className={
                        "halftone flex min-h-36 cursor-pointer flex-col items-center justify-end gap-3 rounded-card border-3 border-ink bg-surface p-5 " +
                        "has-checked:bg-accent-mustard has-checked:shadow-card " +
                        "has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-accent-teal"
                      }
                    >
                      <input
                        type="radio"
                        name="size"
                        className="sr-only"
                        checked={draft.size === size}
                        onChange={() => update({ size }, ["size"])}
                      />
                      <Image
                        src="/illustrations/perros/perro-azul.svg"
                        alt=""
                        width={120}
                        height={120}
                        unoptimized
                        className={`h-auto ${SIZE_ART[size]}`}
                      />
                      <span className="font-bold">{SIZE_LABEL[size]}</span>
                    </label>
                  ))}
                </div>
                {error("size")}
              </fieldset>
            )}
          </div>
        )}

        {step === STEP.HEALTH && (
          <div className="flex flex-col gap-5">
            <FieldHelp>Si no sabés alguno, elegí «No»: es lo más seguro para quien adopte.</FieldHelp>
            <div className="grid gap-5 md:grid-cols-3">
              {HEALTH_QUESTIONS.map(({ field, question }) => (
                <YesNo
                  key={field}
                  id={FIELD_IDS[field]}
                  question={question}
                  value={draft[field]}
                  onChange={(value) => update({ [field]: value }, [field])}
                  invalid={Boolean(errors[field])}
                >
                  {error(field)}
                </YesNo>
              ))}
            </div>
          </div>
        )}

        {step === STEP.LOCATION && (
          <div id={FIELD_IDS.province} className="flex flex-col gap-4">
            <FieldHelp>Precargamos la ubicación de tu perfil. Cambiala si la mascota está en otro lugar.</FieldHelp>
            <LocationSelector
              provinces={provinces}
              value={draft.location}
              onChange={(value) => update({ location: value }, ["province", "locality"])}
              provinceError={errors.province}
              localityError={errors.locality}
            />
          </div>
        )}

        {step === STEP.STORY && (
          <div>
            <Label htmlFor={FIELD_IDS.description}>Su historia</Label>
            <textarea
              id={FIELD_IDS.description}
              className={`${inputClass} min-h-48 resize-y leading-relaxed`}
              maxLength={MAX_DESCRIPTION}
              placeholder="Contanos sobre su personalidad, sus hábitos, su historia y qué tipo de hogar buscás para él o ella."
              value={draft.description}
              onChange={(e) => update({ description: e.target.value }, ["description"])}
              {...fieldProps("description", "description-count")}
            />
            <div className="flex justify-end">
              <FieldHelp id="description-count">
                {draft.description.length}/{MAX_DESCRIPTION}
              </FieldHelp>
            </div>
            {error("description")}
          </div>
        )}

        {step === STEP.PHOTOS && (
          <PhotoPicker
            photos={photos}
            rejected={rejectedPhotos}
            onAdd={addPhotos}
            onRemove={removePhoto}
            onAdjust={draftPhotos.adjust}
            cropRequest={draftPhotos.cropRequest}
            cropMode={draftPhotos.cropMode}
            onConfirmCrop={draftPhotos.confirmCrop}
            onCancelCrop={draftPhotos.cancelCrop}
          />
        )}

        {step === STEP.REVIEW && draft.species && draft.sex && age && (
          <dl className="flex flex-col gap-5">
            <ReviewRow label="Animal" onEdit={() => goTo(STEP.ANIMAL)} editLabel="Cambiar el animal" disabled={locked}>
              {SPECIES_LABEL[draft.species]}
            </ReviewRow>
            <ReviewRow label="Datos" onEdit={() => goTo(STEP.DATA)} editLabel="Editar nombre, sexo, edad y tamaño" disabled={locked}>
              <span className="font-display text-2xl text-primary">{draft.petName.trim()}</span>
              <span className="mt-1 block">
                {[SEX_LABEL[draft.sex], isDog && draft.size ? SIZE_LABEL[draft.size] : null].filter(Boolean).join(" · ")}
              </span>
              <span className="mt-1 block text-ink-soft">
                {formatAge(age)} (nació aprox. en {formatBirthMonth(ageToBirthMonth(age))})
              </span>
            </ReviewRow>
            <ReviewRow label="Salud" onEdit={() => goTo(STEP.HEALTH)} editLabel="Editar salud" disabled={locked}>
              <HealthChips
                chips={healthChips({
                  sex: draft.sex,
                  vaccinated: Boolean(draft.vaccinated),
                  dewormed: Boolean(draft.dewormed),
                  neutered: Boolean(draft.neutered),
                })}
              />
            </ReviewRow>
            <ReviewRow label="Ubicación" onEdit={() => goTo(STEP.LOCATION)} editLabel="Editar ubicación" disabled={locked}>
              {draft.location.locality?.displayName}, {province?.name}
            </ReviewRow>
            <ReviewRow label="Su historia" onEdit={() => goTo(STEP.STORY)} editLabel="Editar historia" disabled={locked}>
              <span className="whitespace-pre-line">{draft.description.trim()}</span>
            </ReviewRow>
            <ReviewRow label="Fotos" onEdit={() => goTo(STEP.PHOTOS)} editLabel="Editar fotos" disabled={locked}>
              {photos.length === 0 ? (
                "Sin fotos: vamos a mostrar una ilustración."
              ) : (
                <ul className="mt-1 flex flex-wrap gap-2">
                  {photos.map((photo, index) => (
                    <li key={photo.id} className="relative aspect-[4/3] w-24 overflow-hidden rounded-field border-3 border-ink bg-disabled">
                      <Image src={photo.previewUrl} alt={`Foto ${index + 1}: ${photo.original.name}`} fill unoptimized className="object-cover" />
                    </li>
                  ))}
                </ul>
              )}
            </ReviewRow>
          </dl>
        )}

        {submitError && (
          <div role="alert" className="rounded-field border-3 border-danger bg-danger-soft px-5 py-4 font-semibold">
            {submitError.message}
          </div>
        )}

        {uploadProgress && (
          <p role="status" className="font-semibold">
            Subiendo foto {uploadProgress.current} de {uploadProgress.total}…
          </p>
        )}

        {published && uploadFailures.length > 0 && !pending && (
          <div role="alert" className="flex flex-col gap-3 rounded-field border-3 border-danger bg-danger-soft px-5 py-4">
            <p className="font-semibold">
              Ya publicamos a {draft.petName.trim()}, pero{" "}
              {uploadFailures.length === 1 ? "una foto no se pudo subir" : `${uploadFailures.length} fotos no se pudieron subir`}:
            </p>
            <ul className="flex flex-col gap-1">
              {uploadFailures.map(({ item, code }) => (
                <li key={item.id} className="wrap-anywhere">
                  <strong>{item.original.name}:</strong> {photoUploadMessage(code)}
                </li>
              ))}
            </ul>
            <p>Por ahora no se pueden agregar fotos después de publicar.</p>
          </div>
        )}

        <div className="flex flex-col-reverse items-stretch gap-4 border-t-3 border-dashed border-ink pt-6 md:flex-row md:items-center md:justify-between">
          {published ? (
            uploadFailures.length > 0 && !pending ? (
              <>
                <Button variant="secondary" href={`/adoptions/${publishedId}?published=1`}>
                  {uploadFailures.length === 1 ? "Seguir sin esa foto" : "Seguir sin esas fotos"}
                </Button>
                <Button variant="cta" onClick={retryPhotos}>
                  Reintentar
                </Button>
              </>
            ) : (
              <Button variant="cta" disabled className="md:ml-auto">
                Publicando…
              </Button>
            )
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3">
                {step > STEP.ANIMAL && (
                  <Button variant="secondary" onClick={() => goTo(step - 1)} disabled={pending}>
                    Atrás
                  </Button>
                )}
                {!pending && (
                  <Link
                    href="/adoptions"
                    className="inline-flex min-h-11 items-center px-1.5 font-semibold text-primary underline underline-offset-3 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-teal"
                  >
                    Cancelar
                  </Link>
                )}
              </div>
              {step < LAST_STEP ? (
                <Button variant="primary" onClick={next}>
                  Siguiente
                </Button>
              ) : (
                <Button variant="cta" onClick={submit} disabled={pending}>
                  {pending ? "Publicando…" : "Publicar"}
                </Button>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

/** Par de botones Sí/No (sistema visual: «En formularios, cada dato es un par de botones Sí/No»). */
function YesNo({
  id,
  question,
  value,
  onChange,
  invalid,
  children,
}: {
  id: string;
  question: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
  invalid: boolean;
  children?: ReactNode;
}) {
  return (
    <fieldset
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={`rounded-card border-3 px-4 pt-2 pb-4 ${invalid ? "border-danger bg-danger-soft" : "border-ink"}`}
    >
      <legend className="px-1.5 font-bold">{question}</legend>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {[
          { label: "Sí", option: true, checked: "has-checked:bg-positive" },
          { label: "No", option: false, checked: "has-checked:bg-ink has-checked:text-surface" },
        ].map(({ label, option, checked }) => (
          <label
            key={label}
            className={
              "inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border-[2.5px] border-ink bg-surface font-bold " +
              `${checked} has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-accent-teal`
            }
          >
            <input
              type="radio"
              name={id}
              className="sr-only"
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {label}
          </label>
        ))}
      </div>
      {children}
    </fieldset>
  );
}

function ReviewRow({
  label,
  onEdit,
  editLabel,
  disabled,
  children,
}: {
  label: string;
  onEdit: () => void;
  editLabel: string;
  disabled: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-t-2 border-disabled pt-5 first:border-t-0 first:pt-0">
      <div className="min-w-0">
        <dt className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-soft">{label}</dt>
        <dd className="mt-1 text-[17px] leading-relaxed wrap-anywhere">{children}</dd>
      </div>
      {!disabled && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={editLabel}
          className="min-h-11 flex-none px-1.5 font-semibold text-primary underline underline-offset-3 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-teal"
        >
          Editar
        </button>
      )}
    </div>
  );
}
