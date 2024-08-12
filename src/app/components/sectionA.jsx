import { Archivo_Black, Roboto } from "next/font/google"
import Image from "next/image";
import '../globals.css'
import Link from 'next/link';

const archivoBlack = Archivo_Black({
    subsets: ['latin'],
    weight: ['400']
})

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
});

//TODO: achicar el texto "el amor no se compra..." cuando se ajusta a telefono
//TODO: hacer el fondo responsive
//TODO: achicar imagen de los animalitos cuando se ajusta a telefono
const SectionA = () =>{
    return(
        <section className="bg-[url('/images/sectionA-background.png')] bg-repeat bg-center bg-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mx-auto pt-12 mb-7">
                <div className="flex flex-col space-y-6 text-center md:w-4/6">
                    <div className="bg-white rounded-lg mx-auto"> {/* TODO: volar a la mierda este div cuando tengamos el background transparente */}
                        <div className={`${archivoBlack.className} text-6xl mb-2`}>
                            <p className="text-primary-blue mb-4">El amor no se compra,</p>
                            <p className="text-primary-orange">se adopta.</p>
                        </div>
                    </div>
                    <div className={`${roboto.className} max-w-xl mx-auto bg-white rounded-lg`}> {/* TODO: volar a la mierda el bg-white rounded-lg cuando tengamos el background transparente */}
                        <p className="text-primary-blue">
                            Queremos ayudarte a encontrar y cuidar de tu amigo peludo. 
                            En nuestra plataforma podrás adoptar a tu compañero ideal y acceder a servicios esenciales para su cuidado. 
                        </p>
                    </div>
                    <div className="pt-12">
                        <Link href="/adopcion" className="bg-primary-orange text-white py-3 px-8 rounded-3xl shadow-lg hover:bg-primary-orange-dark transition-colors duration-300">
                            Adoptar
                        </Link>
                    </div>
                </div>
                <div className="mt-8 md:mt-0 md:w-1/4">
                    <Image 
                        src="/images/pets-index.png"
                        width={420}
                        height={420}
                    />
                </div>
            </div>
            <div className="custom-shape-divider-bottom-1723423794" style={{ '--shape-fill-color': '#F8F3EA' }}> {/* TODO: pasar como prop este color */}
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
                </svg>
            </div>
        </section>
    )
}

export default SectionA