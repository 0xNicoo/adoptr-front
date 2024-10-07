"use client";
import React, { useEffect, useState } from 'react';
import { useFormStoreLost } from '@/app/store';
import { Inter } from "next/font/google";
import { Checkbox, Textarea } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CustomLoading from '@/app/components/customLoading';
import { successToast } from '@/util/toast';
import { createLostAction } from '@/actions/lost';
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

  
const Step4 = ({prevStep = {prevStep}}) => {
    const { title, sizeType, animalType, ageYears, ageMonths, sexType, description, image, locality, province, fileImage, longitude, latitude } = useFormStoreLost();
    const router = useRouter()
    const [publishing, setPublishing] = useState(false)

    const publicarPerdida = async () => {
        setPublishing(true)
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('sexType', sexType);
        formData.append('animalType', animalType);
        formData.append('sizeType', sizeType);
        formData.append('ageYears', ageYears);
        formData.append('ageMonths', ageMonths);
        formData.append('image', fileImage);
        formData.append('locality_id', locality.id);
        formData.append('longitude', longitude);
        formData.append('latitude', latitude);

        try {
            const resp = await createLostAction(formData);
            router.push(`/perdidas/${resp.id}`)
            successToast('Publicacion creada con exito!')
        } catch (error) {
            console.log('Error al publicar', error);
            setPublishing(false)
        }
    }
    
    return (
        <div className='flex flex-grow flex-col mb-4 ml-12 justify-between'>
            <div className='flex flex-row gap-8 mt-4 items-start'>
                <div className="flex items-center"> 
                {image ? (  
                            <div className="xs:w-[250px] xs:h-[250px] sm:w-[300px] sm:h-[300px] overflow-hidden mb-4 flex items-center">
                            <img
                              alt="Imagen seleccionada"
                              src={image}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        ): (
                            <div className="flex xs:mb-0 md:mb-4 justify-center items-center sm:w-[300px] sm:h-[300px] bg-gray-100 rounded-xl">
                                <CIcon icon={cilImagePlus} className='sm:w-[100px] sm:h-[100px] flex items-center justify-center text text-gray-500'/>
                            </div>
                        ) 
                        } 
                </div> 
                <div className='flex flex-col'>
                    <h1 className={`${inter.className} xl:text-xl 2xl:text-2xl font-bold text-primary-blue`}>{title}</h1>
                    <p className={`${inter.className} xl:text-md 2xl:text-xl font-medium text-black mt-2`}>TAMAÑO</p>
                    <p className='xl:text-sm 2xl:text-lg'>{mapSizeType(sizeType)}</p>
                    <div className='mt-2'>
                        <p className={`${inter.className} xl:text-md 2xl:text-xl font-medium text-black`}>EDAD</p>
                        <p className='flex xl:text-sm 2xl:text-lg'>{ageYears} año{ageYears != 1 ? 's' : ''} {ageMonths} mes{ageMonths != 1 ? 'es' : ''}</p>
                    </div>
                    <div className='mt-2 mb-2'>
                        <p className={`${inter.className} xl:text-md 2xl:text-xl font-medium text-black`}>SEXO</p>
                        <p className='xl:text-sm 2xl:text-lg'>{mapSexType(sexType)}</p>
                    </div>
                    <div className='mt-2 mb-2'>                 
                        <p className={`${inter.className} xl:text-md 2xl:text-xl font-medium text-black`}>UBICACIÓN</p>
                        <p className='xl:text-sm 2xl:text-lg'>{locality.name}, {locality.province.name}</p>
                    </div>
                    <div className='mt-2'>
                        <p className={`${inter.className} text-md font-medium text-black`}>DESCRIPCIÓN</p>
                        <Textarea
                        isReadOnly
                        defaultValue={description}
                        className="max-w-xs"
                        />
                    </div>
                </div>
                
                <div className="flex justify-end w-1/3 ml-64">
                    <MapPreview latitude={latitude} longitude={longitude} />
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
                    <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" type="submit" onClick={publicarPerdida}>Publicar</button>
                }

            </div>
        </div>
    )
}

export default Step4;