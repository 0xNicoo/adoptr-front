export default function Loading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-12 md:px-6" aria-busy="true">
      <p className="sr-only" role="status">
        Cargando tus chats…
      </p>
      <div className="h-14 w-60 rounded-card bg-disabled" />
      <div className="grid h-[min(760px,calc(100dvh-16rem))] min-h-[480px] rounded-card border-3 border-dashed border-ink-soft md:grid-cols-[minmax(280px,340px)_1fr]">
        <div className="flex flex-col gap-3 p-4 md:border-r-3 md:border-dashed md:border-ink-soft">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="size-14 rounded-field bg-disabled" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-5 w-2/3 rounded-full bg-disabled" />
                <div className="h-3.5 w-5/6 rounded-full bg-disabled" />
              </div>
            </div>
          ))}
        </div>
        <div className="halftone hidden bg-paper md:block" />
      </div>
    </div>
  );
}
