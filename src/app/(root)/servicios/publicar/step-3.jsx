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
        <div className='flex flex-grow flex-col mb-4 ml-12 justify-between'>
            <div className='flex flex-row gap-8 mt-4 items-start'>
                <div className="flex items-center"> 
                    {image && (
                        <Image className='rounded-xl xl:w-80 2xl:w-96'
                        src={image}
                        alt='Imagen seleccionada'
                        width={200}
                        height={350}
                        />
                    )}
                </div> 
                <div className='flex flex-col'>
                    <h1 className={`${inter.className} xl:text-xl 2xl:text-2xl font-bold text-primary-blue`}>{title}</h1>
                    <div className='mt-2 mb-2'>                 
                        <p className={`${inter.className} xl:text-md 2xl:text-xl font-medium text-black`}>Tipo de servicio</p>
                        <p className='xl:text-sm 2xl:text-lg'>{serviceType?.name || 'No especificado'}</p>
                    </div>
                    <div className='mt-2 mb-2'>                 
                        <p className={`${inter.className} xl:text-md 2xl:text-xl font-medium text-black`}>UBICACIÓN</p>
                        <p className='xl:text-sm 2xl:text-lg'>{locality.name}, {locality.province.name}</p>
                    </div>
                    <div className='mt-2 mb-2'>
                        <p className={`${inter.className} text-md font-medium text-black`}>DESCRIPCIÓN</p>
                        <Textarea
                        isReadOnly
                        value={description}
                        className="xs:w-[200px] sm:w-[400px]"
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-between mt-4 mb-4 items-end mr-4">
                <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={prevStep}>Atrás</button>
                {
                    publishing ? 
                    <div className='py-2 px-8'>
                        <CustomLoading />
                    </div>
                    :
                    <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" type="submit" onClick={publicarServicio}>Publicar</button>
                }
            </div>
        </div>
    )
}

export default Step3;