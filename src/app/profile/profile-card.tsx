import { MapPinIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Profile } from "@/lib/api/models/profile/profile";
import { ProfileType } from "@/lib/api/models/profile/profile-type";
import { PROFILE_TYPE_LABEL, initials, profileDisplayName } from "@/lib/profile/display";

// Tarjeta lateral de «Mi perfil»: foto o iniciales, nombre, tipo, ubicación, descripción y contadores.
// Los contadores son `null` si no se pudieron cargar.

export default function ProfileCard({
  profile,
  counts,
}: {
  profile: Profile;
  counts: { available: number; adopted: number } | null;
}) {
  const name = profileDisplayName(profile);
  const organization = profile.profileType === ProfileType.ORGANIZATION ? profile : null;

  return (
    <section
      aria-labelledby="profile-name"
      className="overflow-hidden rounded-card border-3 border-ink bg-surface shadow-panel"
    >
      <div className="halftone h-28 border-b-3 border-ink bg-cta" />
      <div className="-mt-20 flex flex-col items-center gap-4 px-6 pb-7">
        <div className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-ink bg-accent-teal shadow-card">
          {profile.photoUrl ? (
            <Image src={profile.photoUrl} alt={`Foto de ${name}`} fill unoptimized className="object-cover" />
          ) : (
            <span aria-hidden="true" className="font-display text-5xl text-ink">
              {initials(name)}
            </span>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 id="profile-name" className="font-display text-[36px] leading-tight break-words text-primary">
            {name}
          </h1>
          <span className="rounded-full border-2 border-ink bg-accent-mustard px-3.5 py-1 text-[13px] font-semibold tracking-[0.08em] uppercase">
            {PROFILE_TYPE_LABEL[profile.profileType]}
          </span>
        </div>

        <p className="flex items-center gap-1.5 text-center text-[15px] text-ink-soft">
          <MapPinIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
          {profile.locality.displayName}, {profile.province.name}
        </p>

        <p className="w-full rounded-field border-3 border-ink p-4 text-[15px] leading-relaxed whitespace-pre-line">
          {profile.description}
        </p>

        {organization && (organization.instagram || organization.facebook || organization.website) && (
          <dl className="grid w-full grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[15px]">
            {organization.instagram && (
              <>
                <dt className="font-semibold">Instagram</dt>
                <dd className="break-all">{organization.instagram}</dd>
              </>
            )}
            {organization.facebook && (
              <>
                <dt className="font-semibold">Facebook</dt>
                <dd className="break-all">{organization.facebook}</dd>
              </>
            )}
            {organization.website && (
              <>
                <dt className="font-semibold">Sitio web</dt>
                <dd className="break-all">
                  <a href={organization.website} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    {organization.website}
                  </a>
                </dd>
              </>
            )}
          </dl>
        )}

        {counts && (
          <dl className="grid w-full grid-cols-2 border-t-3 border-dashed border-ink pt-4 text-center">
            <div className="flex flex-col-reverse">
              <dt className="text-sm text-ink-soft">en adopción</dt>
              <dd className="font-display text-3xl text-primary">{counts.available}</dd>
            </div>
            <div className="flex flex-col-reverse">
              <dt className="text-sm text-ink-soft">{counts.adopted === 1 ? "adoptada" : "adoptadas"}</dt>
              <dd className="font-display text-3xl text-primary">{counts.adopted}</dd>
            </div>
          </dl>
        )}
      </div>
    </section>
  );
}
