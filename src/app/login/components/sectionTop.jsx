import "../../globals.css"
import localFont from 'next/font/local'

const gentyDemo = localFont({
    src: '../../resources/font/GentyDemo-Regular.ttf',
    display: 'swap',
})

export default function SectionTop() {
    return (
        <>
            <section className="bg-[url('/images/sectionLogin-background.png')] bg-repeat bg-center bg-auto h-[40vh] flex flex-col justify-center items-center">
                <div className="text-center">
                    <a href="/" className={`${gentyDemo.className} text-7xl shadow-gray-500 text-shadow-lg`}>
                        <span className="text-primary-blue">Adop</span>
                        <span className="text-primary-orange">tr</span>
                    </a>
                </div>
            </section>
            <div className="bg-primary-orange w-full h-[calc(100vh-20vh)] flex justify-center items-center">
                <div className="bg-primary-orange-light w-full max-w-md p-8 rounded-3xl shadow-lg flex justify-center items-center">
                    <section className="bg-white p-8 rounded-3xl shadow-lg w-full">
                        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
                        <form action="" className="flex flex-col space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-gray-700">Correo Electrónico</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full p-3 border border-gray-300 rounded-md"
                                    placeholder="Introduce tu correo electrónico"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-gray-700">Contraseña</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="w-full p-3 border border-gray-300 rounded-md"
                                    placeholder="Introduce tu contraseña"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-primary-blue text-white rounded-md hover:bg-primary-blue-dark transition-colors duration-300"
                            >
                                Iniciar Sesión
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </>
    );
}
