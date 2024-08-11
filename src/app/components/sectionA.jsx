import { Archivo_Black, Roboto } from "next/font/google"
import Image from "next/image";

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
            <div className="flex flex-col md:flex-row items-center justify-between mx-auto pt-12">
                <div className="flex flex-col space-y-2 text-center md:w-4/6">
                    <div className="bg-white rounded-lg mx-auto">
                        <div className={`${archivoBlack.className} text-6xl mb-6`}>
                            <p className="text-primary-blue mb-4">El amor no se compra,</p>
                            <p className="text-primary-orange">se adopta.</p>
                        </div>
                    </div>
                    <div className={`${roboto.className} max-w-xl mx-auto bg-white rounded-lg`}>
                        <p className="text-primary-blue">
                            Queremos ayudarte a encontrar y cuidar de tu amigo peludo. 
                            En nuestra plataforma podrás adoptar a tu compañero ideal y acceder a servicios esenciales para su cuidado. 
                        </p>
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
        </section>
    )
}

export default SectionA