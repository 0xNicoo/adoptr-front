'use client';

import React, { useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import { Checkbox, Textarea } from '@nextui-org/react';
import { getAdoptionDetail } from '../actions';
import { useRouter } from 'next/navigation';
import { deleteAdoptionAction, getUserId, getChatByPublicationIdAction } from '../actions';
import { useAdoptionEditStore } from '@/app/store';

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
  const [userId, setUserId] = useState(null);
  const {setAdoptionStore} = useAdoptionEditStore()

  useEffect(() => {
    const fetchUserId = async () => {
      setUserId(await getUserId())
    }
    const fetchAdoption = async () => {
      try {
        const data = await getAdoptionDetail(adoptionId);
        setAdoption(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUserId()
    if (adoptionId) {
      fetchAdoption();
    }
  }, [adoptionId]);

  if (error) return <div>Error: {error}</div>;
  if (!adoption) return <div>Loading...</div>;

  //TODO(nico): cuando se ejecuta, poner un loading en el boton de eliminar
  const handleDelete = async (id) => {
    await deleteAdoptionAction(id)
    router.push('/adopcion?page=1')
  };

  const handleEdit = () => {
      setAdoptionStore(adoption)
      router.push(`/adopcion/${adoption.id}/editar`)
  };

  const handleAdoptClick = async () => {
    console.log("USUARIO: ", userId)
    console.log("USUARIO CREADOR: ", adoption.user.id)
    if(userId == adoption.user.id){
      router.push('/chatList')
      return
    }else{
      const chat = await getChatByPublicationIdAction(adoption.id)
      router.push(`/chat?chat=${chat.id}`);
    }

  };

  return (
    <div className="bg-background-gray flex pt-4 px-4 pb-4 justify-center">
      <div className='flex flex-col p-4 gap-4 md:gap-6 items-start bg-white border border-gray-300 rounded-3xl drop-shadow-md w-full max-w-7xl h-auto'>
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 w-full">
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
          </div>
        </div>
        
        <div className="flex justify-between w-full items-center mt-6">
          {adoption.user.id == userId ? (
            <div className='flex gap-4'>
              <button
                onClick={() => handleDelete(adoption.id)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 rounded-3xl transition-colors duration-300"
              >
                Eliminar
              </button>
              <button 
                onClick={() => handleEdit()}
                className="bg-primary-orange hover:bg-orange-700 py-1 px-4 rounded-3xl transition-colors duration-300 text-white">
                Editar
              </button>
            </div>
            ) : (
              <div></div>
          )}
          <div className='flex gap-4'>
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
