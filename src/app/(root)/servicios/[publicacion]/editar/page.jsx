'use client'

import { Inter } from "next/font/google";
import { useServiceEditStore } from "@/app/store";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import Ubication from "./components/ubication";
import TitleInput from "./components/title";
import Street from "./components/street";
import Number from "./components/number";
import Description from "./components/description";
import ImageSelector from "./components/imageSelector";
import ServiceTypeSelector from "./components/serviceselect";
import { getUserIdAction } from "@/actions/global";
import { editServiceAction, getServiceTypesAction } from "@/actions/service";

const inter = Inter({ subsets: ["latin"] });

export default function EditPage() {
  const { service } = useServiceEditStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [serviceTypes, setServiceType] = useState([]); 
  const methods = useForm();

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const types = await getServiceTypesAction(); 
        setServiceType(types); 
      } catch (error) {
        console.error('Error fetching service types:', error);
      }
    };

    const checkUser = async () => {
      const userId = await getUserIdAction();
      if (userId !== service.user.id) {
        router.push('/servicios');
      } else {
        setLoading(false);
      }
    };

    if (!service) {
      router.push('/servicios');
      return;
    }

    fetchServiceTypes(); 
    checkUser();
  }, [service, router]); 

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleCancel = (id) => {
    router.push(`/servicios/${id}`);
  };

  const onEdit = async (data) => {
    console.log('Datos enviados al editar:', data);


    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('street', data.street);
    formData.append('number', data.number);
    formData.append('locality_id', data.locality_id);
    formData.append('serviceType_id', data.serviceType);
    formData.append('image', data.image);

    await editServiceAction(service.id, formData);
    router.push(`/servicios/${service.id}`);
  };

  return (
    <div className="bg-background-gray flex pt-4 px-4 pb-4 justify-center">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onEdit)} className='flex flex-col p-4 gap-4 md:gap-6 items-start bg-white border border-gray-300 rounded-3xl drop-shadow-md w-full max-w-7xl h-auto'>
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 w-full">
            <div className="flex-shrink-0">
              <ImageSelector actualImage={service.s3Url} />
            </div>

            <div className='flex flex-col w-full'>
              <div className='flex'> 
                <div className='flex-1'>
                  <TitleInput actualTitle={service.title} />
                  <Street actualStreet={service.street} />
                  <Number actualNumber={service.number} />
                </div>
                <div className='flex-1'>
                  <Ubication actualLocality={service.locality.name} actualLocalityId={service.locality.id} actualProvince={service.locality.province.name} />
                  <ServiceTypeSelector actualServiceType={service.serviceType.name} serviceTypes={serviceTypes} actualServiceTypeId={service.serviceType.id} /> 
                </div>
              </div>
              <div className='mt-2'>
                <Description actualDescription={service.description} />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between w-full items-center mt-6">
            <button
              type="button"
              onClick={() => handleCancel(service.id)}
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
