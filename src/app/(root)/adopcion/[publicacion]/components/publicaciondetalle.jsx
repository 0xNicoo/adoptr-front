'use client';

import React, { useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import { Checkbox, Textarea } from '@nextui-org/react';
import { getAdoptionDetail } from '../actions';
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

const mapSexType = (sexType) => {
  switch (sexType) {
    case 'MALE':
      return 'Macho';
    case 'FEMALE':
      return 'Hembra';
    default:
      return 'Indefinido'; 
  }
};

const mapSizeType = (sizeType) => {
  switch (sizeType) {
    case 'SMALL':
      return 'Pequeño';
    case 'MEDIUM':
      return 'Mediano';
    case 'BIG':
      return 'Grande';
    default:
      return 'Indefinido';
  }
};

const PublicationDetail = ({ adoptionId }) => {
  const [adoption, setAdoption] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

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

  const handleAdoptClick = () => {
    router.push('/chat');
  };

  return (
    <div className="bg-background-gray min-h-screen flex pt-4 px-4 pb-4 justify-center">
      <div className='flex flex-col md:flex-row p-6 gap-6 md:gap-8 items-start bg-white border border-gray-300 rounded-3xl drop-shadow-md w-full max-w-4xl'>
        <div className="flex-shrink-0">
          <img 
          className='rounded-xl w-full md:w-80 lg:w-96'
          src={adoption.s3Url} 
          alt='Imagen seleccionada'
          width={250}
          height={300}
          />
        </div>
        <div className='flex flex-col w-full'>
          <h1 className={`${inter.className} xl:text-2xl 2xl:text-3xl md:text-lg font-medium text-primary-blue`}>{adoption.title}</h1>
          <p className={`${inter.className} xl:text-sm 2xl:text-md md:text-sm font-medium text-black mt-2`}>TAMAÑO</p>
          <p className='xl:text-sm 2xl:text-md md:text-sm text-black'>{mapSizeType(adoption.sizeType)}</p>
          <p className={`${inter.className} xl:text-sm 2xl:text-md md:text-sm font-medium text-black mt-2`}>EDAD</p>
          <p className='xl:text-sm 2xl:text-md md:text-sm text-black'>{adoption.ageYears} años {adoption.ageMonths} meses</p>
          <p className={`${inter.className} xl:text-sm 2xl:text-md md:text-sm font-medium text-black mt-2`}>SEXO</p>
          <p className='xl:text-sm 2xl:text-md md:text-sm text-black'>{mapSexType(adoption.sexType)}</p>
          <p className={`${inter.className} xl:text-sm 2xl:text-md md:text-sm font-medium text-black mt-2`}>UBICACIÓN</p>
          <p className='xl:text-sm 2xl:text-md md:text-sm text-black'>{adoption.locality.name}, {adoption.locality.province.name}</p>
          <div className='flex flex-wrap gap-4 mt-2'>
            <Checkbox isSelected={adoption.vaccinated} className='xl:text-sm 2xl:text-md md:text-sm text-black'>Vacunado</Checkbox>
            <Checkbox isSelected={adoption.unprotected} className='xl:text-sm 2xl:text-md md:text-sm text-black'>Desparasitado</Checkbox>
            <Checkbox isSelected={adoption.castrated} className='xl:text-sm 2xl:text-md md:text-sm text-black'>Castrado</Checkbox>
          </div>
            <p className={`${inter.className} xl:text-sm 2xl:text-md md:text-sm font-medium text-black mt-2 mb-1`}>DESCRIPCIÓN</p>
            <Textarea
                isReadOnly
                defaultValue={adoption.description}
                className="max-w-xs"
                />
          <div className='absolute bottom-4 right-4 flex gap-4'>
            <button className="bg-primary-orange hover:bg-orange-700 py-1 px-4 rounded-3xl transition-colors duration-300 text-white">
              Guardar
            </button>
            <button className="bg-primary-blue hover:bg-blue-700 py-1 px-4 rounded-3xl transition-colors duration-300 text-white"
             onClick={handleAdoptClick}>
              Adoptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationDetail;
