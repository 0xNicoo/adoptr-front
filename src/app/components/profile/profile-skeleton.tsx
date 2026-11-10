// Esqueleto de carga de una página de perfil (propio o ajeno): tarjeta a la izquierda y grilla a la derecha.

export default function ProfileSkeleton({ label }: { label: string }) {
  return (
    <div
      className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 pb-16 md:px-6 lg:grid-cols-[380px_1fr] lg:items-start"
      aria-busy="true"
    >
      <p className="sr-only" role="status">
        {label}
      </p>
      <div className="overflow-hidden rounded-card border-3 border-dashed border-ink-soft bg-surface">
        <div className="halftone h-28 bg-disabled" />
        <div className="flex flex-col items-center gap-4 p-6">
          <div className="h-36 w-36 rounded-full bg-disabled" />
          <div className="h-8 w-3/4 rounded-full bg-disabled" />
          <div className="h-4 w-1/2 rounded-full bg-disabled" />
          <div className="h-28 w-full rounded-field bg-disabled" />
        </div>
      </div>
      <div className="flex flex-col gap-7">
        <div className="h-12 w-2/3 max-w-md rounded-card bg-disabled" />
        <div className="h-11 w-64 rounded-full bg-disabled" />
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(340px,100%),1fr))] gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i} className="overflow-hidden rounded-card border-3 border-dashed border-ink-soft bg-surface">
              <div className="halftone aspect-[4/3] bg-disabled" />
              <div className="flex flex-col gap-3 p-5">
                <div className="h-7 w-1/2 rounded-full bg-disabled" />
                <div className="h-4 w-5/6 rounded-full bg-disabled" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
