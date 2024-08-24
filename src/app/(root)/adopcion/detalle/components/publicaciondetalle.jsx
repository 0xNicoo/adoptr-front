import React from 'react';
import Image from 'next/image';
import { Inter } from "next/font/google";
import { Checkbox } from '@nextui-org/react';

const inter = Inter({ subsets: ["latin"] });

const PublicationDetail = () => {
  return (
    <div className="bg-background-gray min-h-screen flex pt-4 px-4 pb-4 justify-center">
      <div className='bg-white border border-gray-300 rounded-3xl drop-shadow-md w-full max-w-4xl'>
        <div className='flex flex-col md:flex-row p-6'>
          <div className='flex flex-col md:flex-row gap-6 md:gap-8 items-start'>
            <div className="flex-shrink-0"> 
              <Image 
                className='rounded-xl w-full md:w-80 lg:w-96'
                src="/images/pets-index.png"
                alt='Imagen seleccionada'
                width={200}
                height={350}
              />
            </div> 
            <div className='flex flex-col w-full'>
              <h1 className={`${inter.className} text-xl md:text-2xl font-bold text-primary-blue`}>Pepito</h1>
              <p className={`${inter.className} text-md md:text-lg font-medium text-black mt-2`}>TAMAÑO</p>
              <p className='text-sm md:text-base'>Chico</p>
              <div className='mt-2'>
                <p className={`${inter.className} text-md md:text-lg font-medium text-black`}>EDAD</p>
                <p className='text-sm md:text-base'>2 Años 3 Meses</p>
              </div>
              <div className='mt-2 mb-2'>
                <p className={`${inter.className} text-md md:text-lg font-medium text-black`}>SEXO</p>
                <p className='text-sm md:text-base'>Macho</p>
              </div>
              <div className='mt-2 mb-2'>
                <p className={`${inter.className} text-md md:text-lg font-medium text-black`}>LOCALIDAD</p>
                <p className='text-sm md:text-base'>Berazategui</p>
              </div>
              <div className='flex flex-wrap gap-4 mt-4'>
                <Checkbox defaultSelected isSelected>Vacunado</Checkbox>
                <Checkbox defaultSelected isSelected>Desparasitado</Checkbox>
                <Checkbox defaultSelected isSelected>Castrado</Checkbox>
              </div>
              <div className='mt-8 relative'>
                <p className={`${inter.className} text-md font-medium text-black`}>DESCRIPCIÓN</p>
                <div className='bg-white border border-gray-300 p-4 rounded-md'>
                  <p className='text-sm md:text-base'>Hola soy lolito</p>
                </div>
              </div>
                <div className='absolute bottom-4 right-4 flex gap-4'>
                  <button className="bg-primary-orange hover:bg-orange-700 py-1 px-4 rounded-3xl transition-colors duration-300 text-white">
                    guardar
                  </button>
                  <button className="bg-primary-blue hover:bg-blue-700 py-1 px-4 rounded-3xl transition-colors duration-300 text-white">
                    adoptar
                  </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationDetail;
