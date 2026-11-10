import Button from "@/app/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 pb-16 md:px-6">
      <div className="halftone rounded-card border-3 border-ink bg-accent-mustard p-8 shadow-panel">
        <h1 className="font-display text-4xl">No encontramos este perfil</h1>
        <p className="mt-3 text-[17px]">Puede que el link esté mal escrito.</p>
        <div className="mt-6">
          <Button href="/adoptions" variant="secondary">
            Ver mascotas en adopción
          </Button>
        </div>
      </div>
    </div>
  );
}
