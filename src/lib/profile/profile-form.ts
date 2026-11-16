import { Locality } from "@/lib/api/models/locality/locality";
import { CreateProfileInput } from "@/lib/api/models/profile/create-profile-input";
import { Gender } from "@/lib/api/models/profile/gender";
import { ProfileType } from "@/lib/api/models/profile/profile-type";

// Límites iguales a los del back (adoptr-back/docs/arquitectura/api.md, «Perfil»).
export const MAX_NAME = 100;
export const MAX_ORGANIZATION_NAME = 150;
export const MAX_SOCIAL = 100;
export const MAX_WEBSITE = 255;
export const MAX_DESCRIPTION = 500;

export type ProfileSection = "type" | "data" | "location" | "description";

export interface ProfileDraft {
  profileType: ProfileType | null;
  firstName: string;
  lastName: string;
  genderType: Gender | null;
  organizationName: string;
  instagram: string;
  facebook: string;
  website: string;
  location: { provinceId: number | null; locality: Locality | null };
  description: string;
}

export type ProfileField =
  | "profileType"
  | "firstName"
  | "lastName"
  | "genderType"
  | "organizationName"
  | "instagram"
  | "facebook"
  | "website"
  | "province"
  | "locality"
  | "description";

export type ProfileErrors = Partial<Record<ProfileField, string>>;

export const EMPTY_PROFILE_DRAFT: ProfileDraft = {
  profileType: null,
  firstName: "",
  lastName: "",
  genderType: null,
  organizationName: "",
  instagram: "",
  facebook: "",
  website: "",
  location: { provinceId: null, locality: null },
  description: "",
};

function tooLong(max: number): string {
  return `Usá como máximo ${max} caracteres.`;
}

function requiredText(value: string, max: number, missing: string): string | undefined {
  const text = value.trim();
  if (!text) return missing;
  if (text.length > max) return tooLong(max);
  return undefined;
}

function optionalText(value: string, max: number): string | undefined {
  return value.trim().length > max ? tooLong(max) : undefined;
}

function websiteError(value: string): string | undefined {
  const text = value.trim();
  if (!text) return undefined;
  if (text.length > MAX_WEBSITE) return tooLong(MAX_WEBSITE);
  const lower = text.toLowerCase();
  const valid =
    (lower.startsWith("http://") && lower.length > 7) || (lower.startsWith("https://") && lower.length > 8);
  return valid ? undefined : "Tiene que empezar con http:// o https://";
}

export function validateProfileSection(section: ProfileSection, draft: ProfileDraft): ProfileErrors {
  const errors: ProfileErrors = {};
  const set = (field: ProfileField, message: string | undefined) => {
    if (message) errors[field] = message;
  };

  if (section === "type") {
    set("profileType", draft.profileType ? undefined : "Elegí una opción.");
  }
  if (section === "data") {
    if (draft.profileType === ProfileType.ORGANIZATION) {
      set(
        "organizationName",
        requiredText(draft.organizationName, MAX_ORGANIZATION_NAME, "Ingresá el nombre de la organización."),
      );
      set("instagram", optionalText(draft.instagram, MAX_SOCIAL));
      set("facebook", optionalText(draft.facebook, MAX_SOCIAL));
      set("website", websiteError(draft.website));
    } else {
      set("firstName", requiredText(draft.firstName, MAX_NAME, "Ingresá tu nombre."));
      set("lastName", requiredText(draft.lastName, MAX_NAME, "Ingresá tu apellido."));
      set("genderType", draft.genderType ? undefined : "Elegí una opción.");
    }
  }
  if (section === "location") {
    if (!draft.location.provinceId) set("province", "Elegí la provincia.");
    else set("locality", draft.location.locality ? undefined : "Elegí la localidad de la lista.");
  }
  if (section === "description") {
    set("description", requiredText(draft.description, MAX_DESCRIPTION, "Escribí una descripción."));
  }
  return errors;
}

export function firstInvalidSection(draft: ProfileDraft, sections: ProfileSection[]): ProfileSection | null {
  return sections.find((section) => Object.keys(validateProfileSection(section, draft)).length > 0) ?? null;
}

function optional(value: string): string | undefined {
  return value.trim() || undefined;
}

export function toCreateProfileInput(draft: ProfileDraft): CreateProfileInput {
  const common = {
    description: draft.description.trim(),
    localityId: draft.location.locality!.id,
  };
  if (draft.profileType === ProfileType.ORGANIZATION) {
    return {
      ...common,
      profileType: ProfileType.ORGANIZATION,
      organizationName: draft.organizationName.trim(),
      instagram: optional(draft.instagram),
      facebook: optional(draft.facebook),
      website: optional(draft.website),
    };
  }
  return {
    ...common,
    profileType: ProfileType.PERSON,
    firstName: draft.firstName.trim(),
    lastName: draft.lastName.trim(),
    genderType: draft.genderType!,
  };
}
