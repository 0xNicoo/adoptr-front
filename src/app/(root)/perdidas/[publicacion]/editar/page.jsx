'use client'

import { Inter } from "next/font/google";
import { useLostEditStore } from "@/app/store";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import Ubication from "./components/ubication";
import TitleInput from "./components/title";
import SizeSelect from "./components/sizeselect";
import SexSelect from "./components/sexselect";
import Description from "./components/description";
import AgeSelect from "./components/ageselect";
import ImageSelector from "./components/imageSelector";
import { getUserIdAction } from "@/actions/global";
import { editLostAction } from "@/actions/lost";
import CustomLoading from "@/app/components/customLoading";
import { errorToast, successToast } from '@/util/toast';
import MapEdit from "./components/mapEdit";

const inter = Inter({ subsets: ["latin"] });

export default function EditPage() {
  const { lost } = useLostEditStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const methods = useForm();
  const [editing, setEditing] = useState(false);
  
  // Estado para latitud y longitud
  const [latitude, setLatitude] = useState(lost.latitude);
  const [longitude, setLongitude] = useState(lost.longitude);

  useEffect(() => {
    const checkUser = async () => {
      const userId = await getUserIdAction();
      if (userId !== lost.user.id) {
        router.push('/perdidas');
      } else {
        setLoading(false);
      }
    };
    
    if (!lost) {
      router.push('/perdidas');
      return;
    }
    checkUser();
  }, []);

  if (loading) {
    return <CustomLoading />;
  }

  const handleCancel = (id) => {
    router.push(`/perdidas/${id}`);
  };

  const onEdit = async (data) => {
    setEditing(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('sexType', data.sexType);
    formData.append('sizeType', data.sizeType);
    formData.append('ageYears', data.ageYears);
    formData.append('ageMonths', data.ageMonths);
    formData.append('image', data.image);
    formData.append('locality_id', data.locality_id);
    formData.append('latitude', latitude); 
    formData.append('longitude', longitude); 

    try {
      await editLostAction(lost.id, formData);
      router.push(`/perdidas/${lost.id}`);
      successToast('Publicación editada con éxito!');
    } catch (error) {
      setEditing(false);
      errorToast("Error: ", error.message);
      console.log([...formData]); 
    }
  };

  // Función para manejar cambios en la ubicación
  const handleLocationChange = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  return (
    <div className="bg-background-gray flex pt-4 px-4 pb-4 justify-center">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onEdit)} className='flex flex-col p-4 gap-4 md:gap-6 items-start bg-white border border-gray-300 rounded-3xl drop-shadow-md w-full max-w-7xl h-auto'>
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 w-full">
            <div className="flex-shrink-0">
              <ImageSelector actualImage={lost.s3Url} />
            </div>

            <div className='flex flex-col w-full'>
              <div className='flex'> 
                <div className='flex-1'>
                  <TitleInput actualTitle={lost.title} />
                  <SizeSelect actualSize={lost.sizeType} />
                  <SexSelect actualSex={lost.sexType} />
                </div>
                <div className='flex-1'>
                  <AgeSelect actualYears={lost.ageYears} actualMonths={lost.ageMonths} />
                  <Ubication actualLocality={lost.locality.name} actualLocalityId={lost.locality.id} actualProvince={lost.locality.province.name} />
                </div>
              </div>
              <div className='mt-2'>
                <Description actualDescription={lost.description} />
              </div>
            </div>
          </div>
          <div className='w-full p-4 ml-auto'>
            <MapEdit
              latitude={latitude} // Pasar la latitud actual
              longitude={longitude} // Pasar la longitud actual
              onLocationChange={handleLocationChange} // Pasar la función para manejar cambios
            />
          </div>
          <div className="flex justify-between w-full items-center mt-6">
            <button
              type="button"
              onClick={() => handleCancel(lost.id)}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 rounded-3xl transition-colors duration-300"
            >
              Cancelar
            </button>
            <div className='flex gap-4'>
              {
                editing ? 
                <div className='py-2 px-8'>
                  <CustomLoading />
                </div>
                :
                <button className="bg-primary-blue hover:bg-blue-700 py-1 px-4 rounded-3xl transition-colors duration-300 text-white" type="submit"> Guardar </button>
              }
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
