import { Poppins } from "next/font/google"
import Image from "next/image";
import '../globals.css'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '700']
});

const SectionD = () =>{
    return(
            <section className="bg-sectionD">
                <h1 className={`${poppins.className} xl:text-4xl 2xl:text-6xl text-white md:text-right xl:pt-10 2xl:pt-18 xl:mr-10 2xl:mr-40`}>Unite a nuestra comunidad</h1>
                <div className="mt-1 grid grid-cols-1">
                    <div className="flex items-center justify-between gap-10 2xl:gap-15">
                        <div className="relative xl:ml-10 2xl:ml-40">
                            <Image className="xl:w-48 2xl:w-72"
                            src="/images/sectionD.png"
                            alt="Ilustración de un gato"
                            width={180}
                            height={180}                       
                            />
                        </div>
                        <p className={`${poppins.className} text-black font-medium xl:mr-10 2xl:mr-40 2xl:text-2xl`}>
                        En Adoptr podés compartir con los demás usuarios tu experiencia adoptando y disfrutando de la vida con tus mascotas.
                        Nuestra comunidad es el lugar perfecto para dar y recibir consejos sobre el cuidado de mascotas. 
                        ¡Sumate y compartí tu historia! 
                        </p>
                    </div>
                </div>
                <div className="custom-shape-divider-bottom-1723517902" style={{ '--shape-fill-color': '#0B1956' }}>
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                </svg>
            </div>
            </section>
    )
}

export default SectionD