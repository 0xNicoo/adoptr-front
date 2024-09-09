'use client'

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useProfileEditStore } from "@/app/store";
import ImageSelector from "./components/imageSelector";
import { useRouter } from 'next/navigation';
import NameLabel from "./components/namelable";
import Description from "./components/description";
import Ubication from "./components/ubication";
import SexSelect from "./components/sexselect";
import { editProfileAction } from "./action";


export default function EditPage() {
  const [loading, setLoading] = useState(true);
  const {profile} = useProfileEditStore()
  const methods = useForm()
  const router = useRouter()

  useEffect(() => {
    console.log(profile)
    if(profile == null){
      router.push(`/mi-perfil`);
    }
    setLoading(false)
  }, [])

  //TODO(nico): user el loading de next
  if (loading) {
    return <p>Loading...</p>
  }

  const handleCancel = () => {
    router.push(`/mi-perfil`);
  };

  const onEdit = async (data) => {
    console.log(data)
    const formData = new FormData()
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('genderType', data.genderType);
    formData.append('description', data.description);
    formData.append('locality_id', data.locality_id);
    formData.append('image', data.image);

    await editProfileAction(profile.id, formData)
    router.push('/mi-perfil')
  };

  return (
    <div className="bg-background-gray flex pt-4 px-4 pb-4 justify-center">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onEdit)}  className='flex flex-col p-4 gap-4 md:gap-6 items-start bg-white border border-gray-300 rounded-3xl drop-shadow-md w-full max-w-7xl h-auto'>
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 w-full">
            <div className="flex-shrink-0">
              <ImageSelector actualImage={profile.s3Url}/>
            </div>

            <div className='flex flex-col w-full'>
              <div className='flex'> 
                <div className='flex-1'>
                  <NameLabel actualFirstName={profile.firstName} actualLastName={profile.lastName}/>
                  <SexSelect actualGender={profile.genderType} />
                </div>
                <div className='flex-1'>
                  <Ubication actualLocality={profile.locality.name} actualLocalityId={profile.locality.id} actualProvince={profile.locality.province.name} />

                </div>
              </div>
              <div className='mt-2'>
                  <Description actualDescription={profile.description} />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between w-full items-center mt-6">
              <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 rounded-3xl transition-colors duration-300"
                >
                  Cancelar
            </button>
            <div className='flex gap-4'>
              <button 
                className="bg-primary-blue hover:bg-blue-700 py-1 px-4 rounded-3xl transition-colors duration-300 text-white"
                type="submit"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

