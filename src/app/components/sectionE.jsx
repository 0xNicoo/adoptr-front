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

const SectionE = () =>{
    return(
        <section className="bg-secondary-blue pt-24 pb-20">
            <h1 className={`${poppins.className} text-4xl text-white mb-5 md:text-left ml-20`}>¿Querés ayudarnos?</h1>
            <div className="mt-1 grid grid-cols-1">
                <div className="flex items-center justify-content mx-20">
                    <p className={`${poppins.className} text-white font-medium mt-1 mr-10 mb-10`}>
                    Nos apasiona conectar mascotas con sus familias para siempre. Si querés contribuir para que nuestra plataforma siga mejorando, podés hacer una donación. 
                    <br/>
                    Cada aporte nos ayuda a hacer de nuestra comunidad un lugar aún más especial para los amantes de los animales.
                    </p>
                    <div>
                        <Image 
                            src="/images/sectionE.png"
                            width={200}
                            height={200}
                        />
                    </div>
                </div>
            </div>
            <Link href="/donaciones" className={`${roboto.className} bg-primary-orange text-white py-3 px-8 rounded-3xl shadow-lg hover:bg-primary-orange-dark transition-colors duration-300 ml-20`}>
                Donar
            </Link>
        </section>
    )
}

export default SectionE