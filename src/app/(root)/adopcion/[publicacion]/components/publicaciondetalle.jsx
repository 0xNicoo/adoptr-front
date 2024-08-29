'use client';

import React, { useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import { Checkbox } from '@nextui-org/react';
import { getAdoptionDetail } from '../actions';

const inter = Inter({ subsets: ["latin"] });

const PublicationDetail = ({ adoptionId }) => {
  const [adoption, setAdoption] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdoption = async () => {
      try {
        const data = await getAdoptionDetail(adoptionId);
        setAdoption(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (adoptionId) {
      fetchAdoption();
    }
  }, [adoptionId]);

  if (error) return <div>Error: {error}</div>;
  if (!adoption) return <div>Loading...</div>;

  return (
    <div className="bg-background-gray min-h-screen flex pt-4 px-4 pb-4 justify-center">
      <div className='bg-white border border-gray-300 rounded-3xl drop-shadow-md w-full max-w-4xl'>
        <div className='flex flex-col md:flex-row p-6'>
          <div className='flex flex-col md:flex-row gap-6 md:gap-8 items-start'>
            <div className="flex-shrink-0">
              <img 
                className='rounded-xl w-full md:w-80 lg:w-96'
                src={adoption.s3Url} 
                alt='Imagen seleccionada'
                width={200}
                height={350}
              />
            </div>
            <div className='flex flex-col w-full'>
              <h1 className={`${inter.className} text-xl md:text-2xl font-bold text-primary-blue`}>{adoption.title}</h1>
              <p className={`${inter.className} text-md md:text-lg font-medium text-black mt-2`}>TAMAÑO</p>
              <p className='text-sm md:text-base'>{adoption.sizeType}</p>
              <div className='mt-2'>
                <p className={`${inter.className} text-md md:text-lg font-medium text-black`}>EDAD</p>
                <p className='text-sm md:text-base'>{adoption.ageYears} Años {adoption.ageMonths} Meses</p>
              </div>
              <div className='mt-2 mb-2'>
                <p className={`${inter.className} text-md md:text-lg font-medium text-black`}>SEXO</p>
                <p className='text-sm md:text-base'>{adoption.sexType}</p>
              </div>
              <div className='mt-2 mb-2'>
                <p className={`${inter.className} text-md md:text-lg font-medium text-black`}>PROVINCIA</p>
                <p className='text-sm md:text-base'>{adoption.locality.province.name}</p>
              </div>
              <div className='mt-2 mb-2'>
                <p className={`${inter.className} text-md md:text-lg font-medium text-black`}>LOCALIDAD</p>
                <p className='text-sm md:text-base'>{adoption.locality.name}</p>
              </div>
              <div className='flex flex-wrap gap-4 mt-4'>
                <Checkbox isSelected={adoption.vaccinated}>Vacunado</Checkbox>
                <Checkbox isSelected={adoption.unprotected}>Desparasitado</Checkbox>
                <Checkbox isSelected={adoption.castrated}>Castrado</Checkbox>
              </div>
              <div className='mt-8 relative'>
                <p className={`${inter.className} text-md font-medium text-black`}>DESCRIPCIÓN</p>
                <div className='bg-white border border-gray-300 p-4 rounded-md'>
                  <p className='text-sm md:text-base'>{adoption.description}</p>
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
