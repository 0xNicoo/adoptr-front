'use client'

import { Inter } from "next/font/google";
import { useAdoptionEditStore } from "@/app/store";
import { getUserId, editAdoptionAction } from "./actions";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import Ubication from "./components/ubication";
import TitleInput from "./components/title";
import SizeSelect from "./components/sizeselect";
import Checkboxes from "./components/checkboxes";
import SexSelect from "./components/sexselect";
import Description from "./components/description";
import AgeSelect from "./components/ageselect";
import ImageSelector from "./components/imageSelector";

const inter = Inter({ subsets: ["latin"] });

export default function EditPage() {
  const {adoption} = useAdoptionEditStore()
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const methods = useForm()

  useEffect(() => {
    const checkUser = async () => {
      const userId = await getUserId()
      if(userId != adoption.user.id){
        router.push('/adopcion')
      }else{
        setLoading(false)
      }
    }
    if (!adoption) {
      router.push('/adopcion');
      return;
    }
    checkUser()
  }, [])

  //TODO(nico): user el loading de next
  if (loading) {
    return <p>Loading...</p>
  }

  const handleCancel = (id) => {
    router.push(`/adopcion/${id}`);
  };

  const onEdit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('sexType', data.sexType);
    formData.append('vaccinated', data.vaccinated);
    formData.append('unprotected', data.unprotected);
    formData.append('castrated', data.castrated);
    formData.append('sizeType', data.sizeType);
    formData.append('ageYears', data.ageYears);
    formData.append('ageMonths', data.ageMonths);
    formData.append('image', data.image);
    formData.append('locality_id', data.locality_id);

    await editAdoptionAction(adoption.id, formData)
    router.push(`/adopcion/${adoption.id}`)
  };

  return (
    <div className="bg-background-gray flex pt-4 px-4 pb-4 justify-center">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onEdit)}  className='flex flex-col p-4 gap-4 md:gap-6 items-start bg-white border border-gray-300 rounded-3xl drop-shadow-md w-full max-w-7xl h-auto'>
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 w-full">
            <div className="flex-shrink-0">
              <ImageSelector actualImage={adoption.s3Url}/>
            </div>

            <div className='flex flex-col w-full'>
              <div className='flex'> 
                <div className='flex-1'>
                  <TitleInput actualTitle={adoption.title} />
                  <SizeSelect actualSize={adoption.sizeType} />
                  <SexSelect actualSex={adoption.sexType} />
                </div>
                <div className='flex-1'>
                  <AgeSelect actualYears={adoption.ageYears} actualMonths={adoption.ageMonths} />
                  <Ubication actualLocality={adoption.locality.name} actualLocalityId={adoption.locality.id} actualProvince={adoption.locality.province.name} />
                </div>
              </div>
              <div className='mt-2'>
                <Checkboxes 
                  actualCastrated={adoption.castrated} 
                  actualDewormed={adoption.unprotected} 
                  actualVaccinated={adoption.vaccinated} 
                />
                <Description actualDescription={adoption.description} />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between w-full items-center mt-6">
              <button
                  onClick={() => handleCancel(adoption.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 rounded-3xl transition-colors duration-300"
                >
                  Cancelar
            </button>
            <div className='flex gap-4'>
              <button className="bg-primary-blue hover:bg-blue-700 py-1 px-4 rounded-3xl transition-colors duration-300 text-white">
                Guardar
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

