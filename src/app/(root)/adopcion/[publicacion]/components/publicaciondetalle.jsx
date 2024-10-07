'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Inter } from "next/font/google";
import { Checkbox, Textarea } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useAdoptionEditStore } from '@/app/store';
import { BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon as OutlineBookmarkIcon } from '@heroicons/react/24/outline';
import { CIcon } from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { cilPencil } from '@coreui/icons';
import { getUserIdAction } from '@/actions/global';
import { getProfilByUserIdAction } from '@/actions/profile';
import { changeAdoptionStatusAction, deleteAdoptionAction, getAdoptionAction } from '@/actions/adoption';
import { getChatsByPublicationIdAction } from '@/actions/chat';
import { getFavoriteAction, setFavoriteAction } from '@/actions/favorite';
import CustomLoading from "@/app/components/customLoading";
import { errorToast, successToast } from '@/util/toast';

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
  const [favorite, setFavorite] = useState(false);
  const {setAdoptionStore} = useAdoptionEditStore()
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      setUserId(await getUserIdAction())
    }
    const fetchAdoption = async () => {
      try {
        const data = await getAdoptionAction(adoptionId);
        setAdoption(data);
        const profileData = await getProfilByUserIdAction(data.user.id);
        setProfile(profileData);
      } catch (err) {
        setError(err.message);
      }
    }
    const fetchFavorite = async () => {
      const respFavorite = await getFavoriteAction(adoptionId)
      if(respFavorite){
        setFavorite(true)
      }
    }
    fetchUserId()

    if (adoptionId) {
      fetchAdoption();
      fetchFavorite()
    }
  }, [adoptionId]);


  if (error) return <div>Error: {error}</div>;
  if (!adoption) return <CustomLoading />;
  
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
    try{
      const chats = await getChatsByPublicationIdAction(adoption.id)
      if(chats.length == 1){
        router.push(`/chat?chat=${chats[0].id}`);
      }else{
        router.push(`/chat/publicaciones/${adoption.id}`)
        return
      }
    }catch(err){
      errorToast(err.message)
      return
    }
  };

  const handleAdoptedClick = async () => {
    try{
      const data = await changeAdoptionStatusAction(adoption.id, 'ADOPTED')
      successToast("La mascota ha sido adoptada!")
      router.refresh()
    }catch(err){
      errorToast(err.message)
    }
  }

  const handleFavorite = async () => {
    setFavorite(!favorite)
    const resp = await setFavoriteAction(adoption.id)
    resp ? setFavorite(true) : setFavorite(false)
  }

  return (
    <div className="bg-background-gray flex pt-4 px-4 pb-4 justify-center">
      <div className='flex flex-col p-4 gap-4 md:gap-6 items-start bg-white border border-gray-300 rounded-3xl drop-shadow-md w-full max-w-7xl h-auto'>
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 w-full relative">
          <div className="flex-shrink-0">
          <Link href={`/perfiles?id=${profile?.user.id}`}>
            <p className='hover:underline underline-offset-4 text-gray-400 text-xs mb-1'>
              Publicado el {new Date(adoption.creationDate).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })} por {profile?.firstName + " " + profile?.lastName}
            </p>
          </Link>
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
          <div className='absolute top-0 right-0'>
            {/* TODO: Revisar el responsive de esto */}
            {adoption.user.id != userId ? (
              <button className=" py-1 px-4 rounded-3xl transition-colors duration-300 text-white"
                onClick={handleFavorite}
              >
                {favorite ? <SolidBookmarkIcon className="h-10 w-10 text-yellow-500" /> : <OutlineBookmarkIcon className="h-10 w-10 text-gray-500" />}
              </button>
            ): (
                <div className='flex'>
                  <button
                  onClick={() => handleDelete(adoption.id)}
                  className="bg-red-500 rounded-xl text-white px-2 py-2 rounded ml-4 hover:bg-red-700 flex items-center justify-center"
                  >
                  <CIcon icon={cilTrash} className="w-4 h-4 text-white fill-current" />
                  </button>
                  <button 
                    onClick={() => handleEdit()}
                    className="bg-blue-700 rounded-xl text-white px-2 py-2 rounded ml-4 hover:bg-secondary-blue flex items-center justify-center">
                  <CIcon icon={cilPencil} className="w-4 h-4 text-white fill-current" />
                  </button>
                  {adoption.user.id == userId ? (
                    <button className="bg-primary-orange hover:bg-orange-700 py-1 px-5 ml-4 rounded-3xl transition-colors duration-300 text-white"
                      onClick={handleAdoptedClick}>
                      Adoptado
                    </button>
                  ) : (<></>)}
                </div>
            )}
          </div>
        </div>
        <div className='w-full flex justify-end mt-4'>
          <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white"
          onClick={handleAdoptClick}>
          {adoption.user.id == userId ? (<>Chats</>) : (<>Adoptar</>)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicationDetail;
