import React from 'react';
import Image from 'next/image';
import { Inter } from "next/font/google";
import { Checkbox } from '@nextui-org/react';

const inter = Inter({ subsets: ["latin"] });

const PublicationDetail = () => {
  return (
    <div className='bg-white rounded-lg p-6 shadow-lg mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-16 border border-gray-500'>
      <div className='flex flex-col mb-4 ml-12 justify-between'>
        <div className='flex flex-row gap-8 mt-4 items-start'>
          <div className="flex items-center"> 
            <Image 
              className='rounded-xl xl:w-80 2xl:w-96'
              src="/images/pets-index.png"
              alt='Imagen seleccionada'
              width={200}
              height={350}
            />
          </div> 
          <div className='flex flex-col'>
            <h1 className={`${inter.className} xl:text-xl 2xl:text-2xl font-bold text-primary-blue`}>Pepito</h1>
            <p className={`${inter.className} xl:text-md 2xl:text-xl font-medium text-black mt-2`}>TAMAÑO</p>
            <p className='xl:text-sm 2xl:text-lg'>Chico</p>
            <div className='mt-2'>
              <p className={`${inter.className} xl:text-md 2xl:text-xl font-medium text-black`}>EDAD</p>
              <p className='flex xl:text-sm 2xl:text-lg'>2 Años 3 Meses</p>
            </div>
            <div className='mt-2 mb-2'>
              <p className={`${inter.className} xl:text-md 2xl:text-xl font-medium text-black`}>SEXO</p>
              <p className='xl:text-sm 2xl:text-lg'>Macho</p>
            </div>
            <div className='mt-2 mb-2'>
              <p className={`${inter.className} xl:text-md 2xl:text-xl font-medium text-black`}>LOCALIDAD</p>
              <p className='xl:text-sm 2xl:text-lg'>Berazategui</p>
            </div>
            <div className='flex mt-4 gap-8'>
              <Checkbox defaultSelected isSelected>Vacunado</Checkbox>
              <Checkbox defaultSelected isSelected>Desparasitado</Checkbox>
              <Checkbox defaultSelected isSelected>Castrado</Checkbox>
            </div>
            <div className='mt-8'>
              <p className={`${inter.className} text-md font-medium text-black`}>DESCRIPCIÓN</p>
              <div className='bg-white border border-gray-300 p-4 rounded-md'>
                <p className='xl:text-sm 2xl:text-lg'>Hola soy lolito</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-4 mt-4 ml-auto">
          <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white">
            guardar
          </button>
          <button className="bg-primary-blue hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white">
            adoptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicationDetail;
