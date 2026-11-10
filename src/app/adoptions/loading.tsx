export default function Loading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pt-12 pb-16 md:px-6" aria-busy="true">
      <p className="sr-only" role="status">
        Cargando mascotas…
      </p>
      <div className="h-16 w-3/4 max-w-xl rounded-card bg-disabled" />
      <div className="h-40 rounded-card border-3 border-dashed border-ink-soft" />
      <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="overflow-hidden rounded-card border-3 border-dashed border-ink-soft bg-surface">
            <div className="halftone aspect-[4/3] bg-disabled" />
            <div className="flex flex-col gap-3 p-5">
              <div className="h-7 w-1/2 rounded-full bg-disabled" />
              <div className="h-4 w-5/6 rounded-full bg-disabled" />
              <div className="h-4 w-2/3 rounded-full bg-disabled" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
