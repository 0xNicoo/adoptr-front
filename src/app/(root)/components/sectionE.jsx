import { Poppins, Roboto } from "next/font/google"
import Image from "next/image";
import "../../globals.css";
import Link from 'next/link';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '700']
});

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400']
});

const SectionE = () =>{
    return(
        <section className="bg-secondary-blue pb-20">
        <h1 className={`${poppins.className} xl:text-4xl 2xl:text-6xl text-white md:text-left pt-18 xl:ml-10 2xl:ml-40`}>¿Querés ayudarnos?</h1>
            <div className="mt-1 grid grid-cols-1">
                <div className="flex items-center justify-content gap-10 2xl:gap-15">
                    <p className={`${poppins.className} text-white font-medium xl:ml-10 2xl:ml-40 2xl:text-2xl mb-4`}>
                    Nos apasiona conectar mascotas con sus familias para siempre. Si querés contribuir para que nuestra plataforma siga mejorando, podés hacer una donación. 
                    <br/>
                    Cada aporte nos ayuda a hacer de nuestra comunidad un lugar aún más especial para los amantes de los animales.
                    </p>
                    <div className="relative xl:ml-10 2xl:ml-40">
                        <Image className="xl:w-48 2xl:w-72"
                            src="/images/sectionE.png"
                            width={180}
                            height={180}
                            alt="Ilustración de un perro"
                        />
                    </div>
                </div>
            </div>
            <div className="mb-30">
            <Link href="/donaciones" className={`${roboto.className} bg-primary-orange text-white 2xl:text-2xl py-3 px-8 rounded-3xl shadow-lg hover:bg-primary-orange-dark transition-colors duration-300 xl:ml-10 2xl:ml-40`}>
                Donar
            </Link>
            </div>
        </section>
    )
}

export default SectionE