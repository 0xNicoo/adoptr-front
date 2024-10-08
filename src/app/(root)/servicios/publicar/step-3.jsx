"use client";
import React, { useState, useEffect } from 'react';
import { useFormStoreServicio } from '@/app/store';
import { Inter } from "next/font/google";
import { Textarea } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CustomLoading from '@/app/components/customLoading';
import { errorToast, successToast } from '@/util/toast';
import { createServiceAction } from '@/actions/service';

const inter = Inter({ subsets: ["latin"] });

const Step3 = ({prevStep = {prevStep}}) => {
    const { title, description, street, number, serviceType, image, locality, province, fileImage, resetForm } = useFormStoreServicio();
    const router = useRouter()
    const [publishing, setPublishing] = useState(false)

     useEffect(() => {
        return () => {
            resetForm();
        };
    }, [resetForm]);

    const publicarServicio = async () => {
        setPublishing(true)
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('street', street);
        formData.append('number', number);
        formData.append('image', fileImage);
        formData.append('locality_id', locality?.id);
        formData.append('serviceType_id', serviceType?.id);


        try {
            const resp = await createServiceAction(formData);
            router.push(`/servicios/${resp.id}`);
            successToast('Publicación creada con éxito!');
        } catch (error) {
            setPublishing(false)
            errorToast("Error: ", error.message)
        }
    }
    
    return (
        <div className='flex flex-grow flex-col mb-4 xs:mx-4 md:ml-12 justify-between'>
            <div className='flex xs:flex-col md:flex-row xs:gap-2 md:gap-8 mt-4 xs:items-center md:items-start'>
                <div className="flex items-center"> 
                    {image && (
                        <div className="xs:w-[250px] xs:h-[250px] sm:w-[300px] sm:h-[300px] overflow-hidden mb-4 flex items-center">
                        <img
                            alt="Imagen seleccionada"
                            src={image}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                    )}
                </div> 
                <div className='flex flex-col'>
                    <h1 className={`${inter.className} flex xs:justify-center md:justify-start xs:text-xl 2xl:text-2xl font-bold text-primary-blue`}>{title}</h1>
                    <div className='mt-2 mb-2'>                 
                        <p className={`${inter.className} xs:text-sm md:text-md 2xl:text-xl font-medium text-black xs:mt-1 md:mt-2`}>TIPO DE SERVICIO</p>
                        <p className='xs:text-sm 2xl:text-lg'>{serviceType?.name || 'No especificado'}</p>
                    </div>
                    <div className='mt-2 mb-2'>                 
                        <p className={`${inter.className} xs:text-sm md:text-md 2xl:text-xl font-medium text-black xs:mt-1 md:mt-2`}>UBICACIÓN</p>
                        <p className='xl:text-sm 2xl:text-lg'>{locality.name}, {locality.province.name}</p>
                    </div>
                    <div className='mt-2 mb-2'>
                        <p className={`${inter.className} xs:text-sm md:text-md 2xl:text-xl font-medium text-black xs:mt-1 md:mt-2`}>DESCRIPCIÓN</p>
                        <Textarea
                        isReadOnly
                        value={description}
                        className="xs:w-[200px] sm:w-[400px]"
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-between mt-4 xs:mb-0 md:mb-4 items-end xs:mr-0 md:mr-4">
                <button className="bg-primary-orange xs:text-sm md:text-md hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={prevStep}>Atrás</button>
                {
                    publishing ? 
                    <div className='py-2 px-8'>
                        <CustomLoading />
                    </div>
                    :
                    <button className="bg-primary-orange xs:text-sm md:text-md hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" type="submit" onClick={publicarServicio}>Publicar</button>
                }

            </div>
        </div>
    )
}

export default Step3;