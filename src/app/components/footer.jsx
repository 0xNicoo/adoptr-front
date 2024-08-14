import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-footer-primary text-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-between">
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h3 className="text-lg font-semibold mb-2">Adoptr</h3>
                        <ul className="list-none">
                            <li><Link href="/" className="text-white-400 hover:underline">Nosotros</Link></li>
                            <li><Link href="/about" className="text-white-400 hover:underline">Donar</Link></li>
                        </ul>
                    </div>

                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h3 className="text-lg font-semibold mb-2">Links</h3>
                        <ul className="list-none">
                            <li><Link href="/" className="text-white-400 hover:underline">Home</Link></li>
                        </ul>
                    </div>

                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h3 className="text-lg font-semibold mb-2">Contacto</h3>
                        <Link href="mailto:adoptr.contact@gmail.com" className="text-white-400 hover:underline">adoptr.contact@gmail.com</Link>
                    </div>
                </div>

                <div className="mt-6 flex justify-between items-center border-t border-gray-700 pt-4">
                    <p>&copy; 2024 Adoptr</p>
                    <div className="flex space-x-4">
                        <Link href="/terminos-y-condiciones" className="text-white-400 hover:underline">Términos y Condiciones</Link>
                        <Link href="/politicas-de-privacidad" className="text-white-400 hover:underline">Políticas de Privacidad</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
