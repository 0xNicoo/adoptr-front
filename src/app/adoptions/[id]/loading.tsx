// Mientras carga el detalle.
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 md:px-6" aria-busy="true">
      <p className="sr-only" role="status">
        Cargando mascota…
      </p>
      <div className="mt-14 grid gap-10 md:grid-cols-2">
        <div className="halftone aspect-[4/3] rounded-card border-3 border-dashed border-ink-soft bg-disabled" />
        <div className="flex flex-col gap-4">
          <div className="h-14 w-1/2 rounded-full bg-disabled" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-20 rounded-field border-3 border-dashed border-ink-soft" />
            ))}
          </div>
          <div className="h-24 rounded-field bg-disabled" />
        </div>
      </div>
    </div>
  );
}
