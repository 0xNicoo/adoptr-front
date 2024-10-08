'use client';

import React, { useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import Link from 'next/link';
import { Checkbox, Textarea } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useFormStoreLost, useLostEditStore } from '@/app/store';
import { getUserIdAction } from '@/actions/global';
import { deleteLostAction, getLostAction } from '@/actions/lost';
import { getChatsByPublicationIdAction } from '@/actions/chat';
import CustomLoading from '@/app/components/customLoading';
import { getProfilByUserIdAction } from '@/actions/profile';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import { cilTrash } from '@coreui/icons';
import MapPreview from './mapPreview';


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

const PublicationDetail = ({ lostId }) => {
  const [lost, setLost] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const { setLostStore } = useLostEditStore();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      setUserId(await getUserIdAction())
    }
    const fetchLost = async () => {
      try {
        const data = await getLostAction(lostId);
        setLost(data);
        const profileData = await getProfilByUserIdAction(data.user.id);
        setProfile(profileData);
      } catch (err) {
        setError(err.message);
      }
    }

    if (lostId) {
      fetchLost();
    } fetchUserId()
  }, [lostId]);

  if (error) return <div>Error: {error}</div>;
  if (!lost) return <CustomLoading />;

  const handleLostClick = async () => {
    try{
      const chats = await getChatsByPublicationIdAction(lost.id)
      if(chats.length == 1){
        router.push(`/chat?chat=${chats[0].id}`);
      }else{
        router.push(`/chat/publicaciones/${lost.id}`)
        return
      }
    }catch(err){
      errorToast(err.message)
      return
    }
  };

  const handleDelete = async (id) => {
    await deleteLostAction(id);
    router.push('/perdidas?page=1');
  };

  const handleEdit = () => {
    setLostStore(lost);
    router.push(`/perdidas/${lost.id}/editar`);
  };

  return (
    <div className="bg-background-gray flex pt-4 px-4 pb-4 justify-center">
      <div className='flex flex-col p-4 items-start bg-white border border-gray-300 rounded-3xl drop-shadow-md w-full max-w-7xl h-auto'>
        <div className="flex flex-col md:flex-row w-full relative">
          <div className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3">
          <Link href={userId == lost.user.id ? `/mi-perfil` : `/perfiles?id=${lost?.user.id}`}>
            <p className='hover:underline underline-offset-4 text-gray-400 text-xs mb-1'>
              Publicado el {new Date(lost.creationDate).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })} por {profile?.firstName + " " + profile?.lastName}
            </p>
          </Link>
          <div className="xs:w-[250px] xs:h-[250px] sm:w-[350px] sm:h-[350px] overflow-hidden mb-4 flex items-center">
            <img
            alt="Imagen seleccionada"
            src={lost.s3Url}
            className="w-full h-full object-cover rounded-lg"
            />
          </div>            
          </div>
          <div className='flex flex-col w-full'>
            <h1 className={`${inter.className} text-lg md:text-xl lg:text-2xl font-medium text-primary-blue`}>{lost.title}</h1>
            <p className={`${inter.className} text-sm md:text-base font-medium text-black mt-2`}>TAMAÑO</p>
            <p className='text-sm md:text-base text-black'>{mapSizeType(lost.sizeType)}</p>
            <p className={`${inter.className} text-sm md:text-base font-medium text-black mt-2`}>EDAD</p>
            <p className='text-sm md:text-base text-black'>{lost.ageYears} años {lost.ageMonths} meses</p>
            <p className={`${inter.className} text-sm md:text-base font-medium text-black mt-2`}>SEXO</p>
            <p className='text-sm md:text-base text-black'>{mapSexType(lost.sexType)}</p>
            <p className={`${inter.className} text-sm md:text-base font-medium text-black mt-2`}>UBICACIÓN</p>
            <p className='text-sm md:text-base text-black'>{lost.locality.name}, {lost.locality.province.name}</p>
            <p className={`${inter.className} text-sm md:text-base font-medium text-black mt-2 mb-1`}>DESCRIPCIÓN</p>
            <Textarea
              isReadOnly
              defaultValue={lost.description}
              className="max-w-full"
            />
          </div>
          <div className='flex flex-col items-end gap-4 w-full md:w-auto'>
            <div className='flex'>
              <button
                onClick={() => handleDelete(lost.id)}
                className="bg-red-500 rounded-xl text-white px-2 py-2 hover:bg-red-700 flex items-center justify-center"
              >
                <CIcon icon={cilTrash} className="w-4 h-4 text-white fill-current" />
              </button>
              <button 
                onClick={() => handleEdit()}
                className="bg-blue-700 rounded-xl text-white px-2 py-2 ml-4 hover:bg-secondary-blue flex items-center justify-center">
                <CIcon icon={cilPencil} className="w-4 h-4 text-white fill-current" />
              </button>
            </div>
            <div className='w-full ml-4 md:w-96'>
              <MapPreview latitude={lost.latitude} longitude={lost.longitude} />
            </div>
          </div>
        </div>
        <div className='w-full flex justify-end mt-4'>
          <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white"
            onClick={handleLostClick}>
            {lost.user.id == userId ? (<>Chats</>) : (<>Contactar</>)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicationDetail;
