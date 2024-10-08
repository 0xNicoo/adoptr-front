'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import { Textarea } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { CIcon } from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { cilPencil } from '@coreui/icons';
import { useServiceEditStore } from '@/app/store';
import { deleteServiceAction, getServiceAction } from '@/actions/service';
import { getUserIdAction } from '@/actions/global';
import { getChatsByPublicationIdAction } from '@/actions/chat';
import { getProfilByUserIdAction } from '@/actions/profile';
import CustomLoading from "@/app/components/customLoading";
import { errorToast } from '@/util/toast';

const inter = Inter({ subsets: ["latin"] });

const PublicationDetail = ({ serviceId }) => {
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const {setServiceStore} = useServiceEditStore()

  useEffect(() => {
    const fetchUserId = async () => {
      setUserId(await getUserIdAction())
    }
    const fetchService = async () => {
      try {
        const data = await getServiceAction(serviceId);
        setService(data);
        const profileData = await getProfilByUserIdAction(data.user.id);
        setProfile(profileData);
      } catch (err) {
        setError(err.message);
      }
    }
    if (serviceId) {
      fetchService();
    }
    fetchUserId()
  }, [serviceId]);

  if (error) return <div>Error: {error}</div>;
  if (!service) return <CustomLoading />;

  const handleServClick = async () => {
    try{
      const chats = await getChatsByPublicationIdAction(service.id)
      if(chats.length == 1){
        router.push(`/chat?chat=${chats[0].id}`);
      }else{
        router.push(`/chat/publicaciones/${service.id}`)
        return
      }
    }catch(err){
      //TODO: arreglar el toast en el build
      // errorToast(err.message)
      router.push(`/chat/publicaciones`);
      return
    }
  };

  const handleDelete = async (id) => {
    await deleteServiceAction(id)
    router.push('/servicios?page=1')
  };

  const handleEdit = () => {
    setServiceStore(service)
    router.push(`/servicios/${service.id}/editar`)
};


  return (
    <div className="bg-background-gray flex pt-4 px-4 pb-4 justify-center">
      <div className='flex flex-col p-4 gap-4 md:gap-6 items-start bg-white border border-gray-300 rounded-3xl drop-shadow-md w-full max-w-7xl h-auto'>
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 w-full relative">
          <div className="flex-shrink-0">
          <Link href={userId == service.user.id ? `/mi-perfil` : `/perfiles?id=${service?.user.id}`}>
            <p className='hover:underline underline-offset-4 text-gray-400 text-xs mb-1'>
              Publicado el {new Date(service.creationDate).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })} por {profile?.firstName + " " + profile?.lastName}
            </p>
          </Link>
            <img
              className='rounded-xl w-full md:w-80 lg:w-96'
              src={service.s3Url}
              alt='Imagen seleccionada'
              width={250}
              height={300}
            />
          </div>
          <div className='flex flex-col w-full'>
            <h1 className={`${inter.className} xl:text-2xl 2xl:text-3xl md:text-lg font-medium text-primary-blue`}>{service.title}</h1>
            <p className={`${inter.className} xl:text-sm 2xl:text-md md:text-sm font-medium text-black mt-4`}>TIPO DE SERVICIO</p>
            <p className='xl:text-sm 2xl:text-md md:text-sm text-black'>{service.serviceType.name}</p>
            <p className={`${inter.className} xl:text-sm 2xl:text-md md:text-sm font-medium text-black mt-2`}>UBICACIÓN</p>
            <p className='xl:text-sm 2xl:text-md md:text-sm text-black'>{service.locality.name}, {service.locality.province.name}</p>
            <p className='xl:text-sm 2xl:text-md md:text-sm text-black'>{"Calle " + service.street}, {service.number}</p>
            <p className={`${inter.className} xl:text-sm 2xl:text-md md:text-sm font-medium text-black mt-2 mb-1`}>DESCRIPCIÓN</p>
            <Textarea
              isReadOnly
              defaultValue={service.description}
              className="max-w-xs"
            />
          </div>
          <div className='absolute top-0 right-0'>
            {/* TODO: Revisar el responsive de esto */}
                <div className='flex'>
                  <button
                  onClick={() => handleDelete(service.id)}
                  className="bg-red-500 rounded-xl text-white px-2 py-2 rounded ml-4 hover:bg-red-700 flex items-center justify-center"
                  >
                  <CIcon icon={cilTrash} className="w-4 h-4 text-white fill-current" />
                  </button>
                  <button 
                    onClick={() => handleEdit()}
                    className="bg-blue-700 rounded-xl text-white px-2 py-2 rounded ml-4 hover:bg-secondary-blue flex items-center justify-center">
                  <CIcon icon={cilPencil} className="w-4 h-4 text-white fill-current" />
                  </button>
                </div>
          </div>
        </div>
        <div className='w-full flex justify-end mt-4'>
          <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white"
          onClick={handleServClick}>
          {service.user.id == userId ? (<>Chats</>) : (<>Contactar</>)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicationDetail;
