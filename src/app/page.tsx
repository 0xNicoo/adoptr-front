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

const footerLinkClass = "flex min-h-11 items-center underline-offset-4 hover:underline sm:min-h-0";

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
        <div className="mx-auto grid max-w-6xl items-center gap-2 px-5 pt-8 pb-9 sm:px-6 md:grid-cols-2 md:py-20">
          <div className="flex flex-col items-start gap-5 md:gap-6">
            <Badge variant="accent">Adopción responsable de perros y gatos</Badge>
            <h1 className="font-display text-[44px] leading-[1.05] text-primary md:text-7xl">
              El amor no se compra,{" "}
              <span className="mt-2 inline-block -rotate-2 rounded-2xl border-3 border-ink bg-cta px-3.5 pb-1.5 text-ink shadow-card">
                se adopta.
              </span>
            </h1>
            <p className="max-w-xl text-[17px] leading-relaxed md:text-[19px]">
              Queremos ayudarte a encontrar a tu amigo peludo.
              <br />
              En nuestra plataforma podrás adoptar a tu
              compañero ideal y acceder a servicios esenciales para su cuidado.
            </p>
            <div className="flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
              <Button variant="cta" href="/adoptions" className="w-full sm:w-auto">
                Ver mascotas en adopción
              </Button>
              <Button variant="secondary" href="/adoptions/new" className="w-full sm:w-auto">
                Publicar una mascota
              </Button>
            </div>
          </div>

          <div className="relative mt-4 flex min-h-56 items-center justify-center md:mt-0 md:min-h-[420px]" aria-hidden="true">
            <Image
              src="/illustrations/decoracion/starburst.svg"
              alt=""
              width={440}
              height={440}
              unoptimized
              className="absolute h-auto w-full max-w-[230px] md:max-w-[440px]"
            />
            <div className="relative flex items-end">
              <Image src="/illustrations/perros/perro-azul.svg" alt="" width={210} height={210} unoptimized className="h-auto w-28 md:w-52" />
              <Image src="/illustrations/gatos/gato-turquesa.svg" alt="" width={170} height={170} unoptimized className="-ml-[18px] h-auto w-[90px] md:-ml-7 md:w-44" />
            </div>
          </div>
        </div>
      </section>

      <section id="como" className="scroll-mt-20 border-b-3 border-ink bg-primary text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-10 sm:px-6 md:gap-10 md:py-20">
          <h2 className="font-display text-[34px] [text-shadow:3px_3px_0_var(--color-ink)] md:text-5xl md:[text-shadow:4px_4px_0_var(--color-ink)]">¿Cómo adoptar?</h2>
          <ol className="grid gap-4 md:grid-cols-3 md:gap-7">
            {steps.map((step) => (
              <li key={step.number} className="flex flex-col gap-2 rounded-card border-3 border-ink bg-surface p-5 text-ink shadow-card md:gap-3 md:p-7">
                <div className="flex items-center gap-3 md:flex-col md:items-start">
                  <span
                    aria-hidden="true"
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-3 border-ink font-display text-[22px] md:h-14 md:w-14 md:text-3xl ${step.color}`}
                  >
                    {step.number}
                  </span>
                  <h3 className="text-[22px] font-bold md:text-2xl">{step.title}</h3>
                </div>
                <p className="text-base leading-normal md:text-[17px] md:leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-10 sm:px-6 md:grid-cols-2 md:gap-7 md:py-20">
          {upcoming.map((item) => (
            <div key={item.title} className={`halftone flex flex-col items-start gap-2.5 rounded-card border-3 border-ink p-5 shadow-card md:gap-3.5 md:p-8 ${item.color}`}>
              <Badge variant="soon-light">Próximamente</Badge>
              <h2 className="font-display text-[28px] md:text-4xl">{item.title}</h2>
              <p className="text-base leading-normal md:text-[17px] md:leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-ink text-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 pt-7 pb-9 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-5 sm:px-6 sm:py-10">
          <span className="font-brand text-4xl leading-none">
            Adop<span className="text-cta">tr</span>
          </span>
          <nav aria-label="Pie de página" className="grid grid-cols-2 gap-x-4 font-semibold sm:flex sm:flex-wrap sm:gap-6">
            <Link href="/adoptions" className={footerLinkClass}>Adoptar</Link>
            <Link href="/adoptions/new" className={footerLinkClass}>Publicar</Link>
            <Link href="#como" className={footerLinkClass}>Cómo funciona</Link>
            <Link href="/login" className={footerLinkClass}>Ingresar</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
