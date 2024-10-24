'use client'

import { Inter } from "next/font/google";
import { useAdoptionEditStore } from "@/app/store";
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
import { getUserIdAction } from "@/actions/global";
import { editAdoptionAction } from "@/actions/adoption";
import CustomLoading from "@/app/components/customLoading";
import { errorToast, successToast } from '@/util/toast';

const inter = Inter({ subsets: ["latin"] });

export default function EditPage() {
  const {adoption} = useAdoptionEditStore()
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const methods = useForm()
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const userId = await getUserIdAction()
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

  if (loading) {
    return <CustomLoading />
  }

  const handleCancel = (id) => {
    router.push(`/adopcion/${id}`);
  };

  const onEdit = async (data) => {
    setEditing(true)
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

    try{
      await editAdoptionAction(adoption.id, formData)
      router.push(`/adopcion/${adoption.id}`)
      successToast('Publicacion editada con exito!')
    }catch{
      setEditing(false)
      errorToast("Error: ", error.message)
    }
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
              <div className='flex-1'>
                  <Checkboxes actualVaccinated={adoption.vaccinated} actualDewormed={adoption.unprotected} actualCastrated={adoption.castrated}/>
                </div>
              <div className='mt-2'>
                <Description actualDescription={adoption.description} />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between w-full items-center mt-6">
              <button
                  type="button"
                  onClick={() => handleCancel(adoption.id)}
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

