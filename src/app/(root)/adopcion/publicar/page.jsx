import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function Poneradopcion() {
  return (
    <div className="bg-background-gray min-h-screen flex pt-2 px-5 pb-2 justify-center">
      <div className="bg-white w-full border border rounded-3xl drop-shadow-md flex flex-col justify-evenly">
        <div className="ml-5">
          <ol className="flex items-center w-full text-sm text-gray-500 font-medium sm:text-base">
            <li className="flex md:w-full items-center text-primary-blue sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8 ">
              <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2 ">
                <span className="w-6 h-6 bg-primary-blue rounded-full flex justify-center items-center mr-3 text-sm text-white lg:w-10 lg:h-10">1</span>Seleccioná el animal
              </div>
            </li>
            <li className="flex md:w-full items-center text-gray-600 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8 ">
              <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2 ">
                <span className="w-6 h-6 bg-gray-100 border border-gray-200 rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10">2</span>Completá los datos
              </div>
            </li>
            <li className="flex md:w-full items-center text-gray-600 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8 ">
              <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2 ">
                <span className="w-6 h-6 bg-gray-100 border border-gray-200 rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10">3</span> Contanos más
              </div>
            </li>
            <li className="flex md:w-full items-center text-gray-600 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8 ">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-gray-100 border border-gray-200 rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10">4</span> Listo
              </div>
            </li>
          </ol>
        </div>
        <h1 className={`2xl:text-4xl xl:text-2xl text-center font-bold text-primary-blue ${inter.ClassName}`}>¿Qué animal vas a publicar?</h1>
        <div className="flex justify-center">
        <ul className="grid items-center gap-12 grid-cols-2">
          <li className="h-full flex justify-center items-center flex-col">
            <input type="radio" id="hosting-small" name="hosting" value="hosting-small" className="hidden peer" required />
            <div className="inline-flex items-center h-full justify-between p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-300 bg-gray-200">                           
                <Image
                  src="/images/dogshape.png"
                  width={80}
                  height={80}
                  alt="Silueta de un perro" 
                  />
            </div>
            <p className={`${inter.className} mt-2`}>Perro</p>
          </li>
          <li className="flex justify-center items-center flex-col">
            <input type="radio" id="hosting-small" name="hosting" value="hosting-small" className="hidden peer" required />
            <div className="inline-flex items-center justify-between p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-300 bg-gray-200">                           
                <Image className=""
                  src="/images/catshape.png"
                  width={80}
                  height={70}
                  alt="Silueta de un perro" 
                  />
            </div>
            <p className={`${inter.className} mt-2`}>Gato</p>
          </li>
        </ul>
      </div>
      <div className="flex flex-row justify-between mx-5">
        <button class="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white">Atrás</button>
        <button class="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white">Siguiente</button>
      </div>
    </div> 
  </div>                           
  );
}