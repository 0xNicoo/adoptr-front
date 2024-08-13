const Footer = () => {
    return (
        <footer className="bg-footer-primary text-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-between">
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h3 className="text-lg font-semibold mb-2">Adoptr</h3>
                        <ul className="list-none">
                            <li><a href="/" className="text-white-400 hover:underline">Nosotros</a></li>
                            <li><a href="/about" className="text-white-400 hover:underline">Donar</a></li>
                        </ul>
                    </div>

                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h3 className="text-lg font-semibold mb-2">Links</h3>
                        <ul className="list-none">
                            <li><a href="/" className="text-white-400 hover:underline">Home</a></li>
                        </ul>
                    </div>

                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h3 className="text-lg font-semibold mb-2">Contacto</h3>
                        <a href="mailto:adoptr.contact@gmail.com" className="text-white-400 hover:underline">adoptr.contact@gmail.com</a>
                    </div>
                </div>

                <div className="mt-6 flex justify-between items-center border-t border-gray-700 pt-4">
                    <p>&copy; 2024 Adoptr</p>
                    <div className="flex space-x-4">
                        <a href="/terminos-y-condiciones" className="text-white-400 hover:underline">Términos y Condiciones</a>
                        <a href="/politicas-de-privacidad" className="text-white-400 hover:underline">Políticas de Privacidad</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
