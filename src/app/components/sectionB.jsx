import { Poppins } from "next/font/google"
import Image from "next/image";
import '../globals.css'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '700']
});

const SectionB = () =>{
    return(
        <section className="bg-sectionB">
            <h1 className={`${poppins.className} xl:text-4xl 2xl:text-6xl text-black md:text-right pt-18 xl:mr-10 2xl:mr-40 pb-5`}>¿Cómo adoptar?</h1>
            <div className="mt-1 grid grid-cols-1">
                <div className="flex items-center justify-between gap-10 2xl:gap-15">
                    <div className="relative xl:ml-10 2xl:ml-40">
                        <Image className="xl:w-48 2xl:w-72"
                            src="/images/sectionB.png"
                            width={180}
                            height={180}
                            alt="Ilustración de un gato"
                        />
                    </div>
                    <p className={`${poppins.className} text-black font-medium xl:mr-10 2xl:mr-40 2xl:text-2xl`}>
                    ¿Estás listo para darle un hogar a un amigo peludo? En nuestra sección Adoptar podés ver todas las mascotas disponibles en adopción.
                    <br/>
                    Cuando encuentres una mascota que te interese, usá el chat de Adoptr para contactarte con el dueño de la publicación. Ahí podés hacer todas las preguntas que tengas y coordinar los detalles de la adopción. 
                    <br/>
                    Con Adoptr estás más cerca de sumar un integrante a tu familia. 
                    </p>
                </div>
            </div>
            <div className="custom-shape-divider-top-1723505161" style={{ '--shape-fill-color': '#F8F3EA' }}>
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                </svg>
            </div>
        </section>
    )
}

export default SectionB