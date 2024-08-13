import { Poppins, Roboto } from "next/font/google"
import Image from "next/image";
import '../globals.css';
import Link from 'next/link';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '700']
});

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400']
});

const SectionC = () =>{
    return(
        <section className="bg-sectionC pt-24">
            <h1 className={`${poppins.className} xl:text-4xl 2xl:text-6xl text-black text-left xl:ml-10 2xl:ml-40 mt-24 relative`}>Perdidos y encontrados</h1>
            <div className="grid grid-cols-1">
                <div className="flex items-center justify-content gap-10 2xl:gap-15">
                    <p className={`${poppins.className} text-black font-medium xl:ml-10 2xl:ml-40 2xl:text-2xl mr-10 mb-4`}>
                    Si encontraste un perro o gato que parece extraviado, o si perdiste a tu mascota, podés publicarlo en Adoptr para ayudar a que vuelvan a su casa. Completá el formulario contándonos cómo es, subí una foto y decinos donde lo viste o lo perdiste.
                    </p>
                    <div className="relative xl:mr-10 2xl:mr-40">
                        <Image className="xl:w-48 2xl:w-72"
                            src="/images/sectionC.png"
                            width={180}
                            height={180}
                            alt="Ilustración de un perro"
                        />
                    </div>
                </div>
            </div>
            <Link href="/perdidos" className={`${roboto.className} bg-secondary-blue text-white py-3 px-8 rounded-3xl shadow-lg hover:bg-blue-hover transition-colors duration-300 xl:ml-10 2xl:ml-40`}>
                Ver más
            </Link>
            <div className="custom-shape-divider-bottom-1723513432" style={{ '--shape-fill-color': '#5784E6' }}>
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
                </svg>
            </div>
        </section>
    )
}

export default SectionC