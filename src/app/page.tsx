import Image from "next/image";
import Link from "next/link";
import Button from "./components/ui/button";
import Badge from "./components/ui/badge";

const steps = [
  {
    number: "1",
    title: "Buscá",
    text: "Filtrá por perro o gato, tamaño, edad y zona. Guardá las publicaciones que te interesan.",
    color: "bg-accent-mustard",
  },
  {
    number: "2",
    title: "Charlá",
    text: "Cuando una mascota te guste, escribile a quien la publicó por el chat de Adoptr.",
    color: "bg-accent-teal",
  },
  {
    number: "3",
    title: "Adoptá",
    text: "¡Coordinen el encuentro y encontrate con tu nuevo amigo!",
    color: "bg-cta",
  },
];

const upcoming = [
  {
    title: "Perdidos y encontrados",
    text: "Si perdiste a tu mascota o encontraste una, vas a poder publicarla con foto y la zona donde la viste.",
    color: "bg-accent-mustard",
  },
  {
    title: "Servicios",
    text: "Paseo, veterinaria, peluquería, guardería y adiestramiento cerca tuyo.",
    color: "bg-accent-teal",
  },
];

export default function Home() {
  return (
    <>
      <section className="halftone border-b-3 border-ink bg-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-2 px-6 py-16 md:grid-cols-2 md:py-20">
          <div className="flex flex-col items-start gap-6">
            <Badge variant="accent">Adopción responsable de perros y gatos</Badge>
            <h1 className="font-display text-5xl leading-[1.05] text-primary md:text-7xl">
              El amor no se compra,{" "}
              <span className="mt-2 inline-block -rotate-2 rounded-2xl border-3 border-ink bg-cta px-3.5 pb-1.5 text-ink shadow-card">
                se adopta.
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed md:text-[19px]">
              Queremos ayudarte a encontrar a tu amigo peludo.
              <br />
              En nuestra plataforma podrás adoptar a tu
              compañero ideal y acceder a servicios esenciales para su cuidado.
            </p>
            <div className="flex flex-col items-start gap-3">
              <div className="flex flex-wrap gap-4">
                <Button variant="cta" disabled>
                  Ver mascotas en adopción
                </Button>
                <Button variant="secondary" disabled>
                  Publicar una mascota
                </Button>
              </div>
              <Badge variant="soon">Próximamente</Badge>
            </div>
          </div>

          <div className="relative flex min-h-80 items-center justify-center md:min-h-[420px]" aria-hidden="true">
            <Image
              src="/illustrations/decoracion/starburst.svg"
              alt=""
              width={440}
              height={440}
              unoptimized
              className="absolute h-auto w-full max-w-[440px]"
            />
            <div className="relative flex items-end">
              <Image src="/illustrations/perros/perro-azul.svg" alt="" width={210} height={210} unoptimized className="h-auto w-40 md:w-52" />
              <Image src="/illustrations/gatos/gato-turquesa.svg" alt="" width={170} height={170} unoptimized className="-ml-7 h-auto w-32 md:w-44" />
            </div>
          </div>
        </div>
      </section>

      <section id="como" className="scroll-mt-4 border-b-3 border-ink bg-primary text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20">
          <h2 className="font-display text-4xl [text-shadow:4px_4px_0_var(--color-ink)] md:text-5xl">¿Cómo adoptar?</h2>
          <ol className="grid gap-7 md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.number} className="flex flex-col gap-3 rounded-card border-3 border-ink bg-surface p-7 text-ink shadow-card">
                <span
                  aria-hidden="true"
                  className={`flex h-14 w-14 items-center justify-center rounded-full border-3 border-ink font-display text-3xl ${step.color}`}
                >
                  {step.number}
                </span>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-[17px] leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl gap-7 px-6 py-20 md:grid-cols-2">
          {upcoming.map((item) => (
            <div key={item.title} className={`halftone flex flex-col items-start gap-3.5 rounded-card border-3 border-ink p-8 shadow-card ${item.color}`}>
              <Badge variant="soon-light">Próximamente</Badge>
              <h2 className="font-display text-3xl md:text-4xl">{item.title}</h2>
              <p className="text-[17px] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-ink text-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-6 py-10">
          <span className="font-brand text-4xl leading-none">
            Adop<span className="text-cta">tr</span>
          </span>
          <nav aria-label="Pie de página" className="flex flex-wrap gap-6 font-semibold">
            <Link href="/" className="underline-offset-4 hover:underline">Adoptar</Link>
            <Link href="/" className="underline-offset-4 hover:underline">Publicar</Link>
            <Link href="#como" className="underline-offset-4 hover:underline">Cómo funciona</Link>
            <Link href="/login" className="underline-offset-4 hover:underline">Ingresar</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
