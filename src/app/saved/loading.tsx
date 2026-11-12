export default function Loading() {
  return (
    <div className="mx-auto flex max-w-[1560px] flex-col gap-8 px-4 pt-12 pb-16 md:px-6" aria-busy="true">
      <p className="sr-only" role="status">
        Cargando tus guardadas…
      </p>
      <div className="h-16 w-1/2 max-w-sm rounded-card bg-disabled" />
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(340px,100%),1fr))] gap-6">
        {Array.from({ length: 4 }, (_, i) => (
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
