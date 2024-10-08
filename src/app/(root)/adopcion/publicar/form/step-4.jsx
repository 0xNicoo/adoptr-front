"use client";
import React, { useEffect, useState } from 'react';
import { useFormStoreAdopcion } from '../../../../store';
import { Inter } from "next/font/google";
import { Checkbox, Textarea } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import CustomLoading from '@/app/components/customLoading';
import { errorToast, successToast } from '@/util/toast';
import { createAdoptionAction } from '@/actions/adoption';

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
    const { title, sizeType, animalType, ageYears, ageMonths, sexType, vaccinated, unprotected, castrated, description, image, locality, province, fileImage } = useFormStoreAdopcion();
    const router = useRouter()
    const [publishing, setPublishing] = useState(false)

    const publicarAdopcion = async () => {
        setPublishing(true)
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('sexType', sexType);
        formData.append('vaccinated', vaccinated);
        formData.append('unprotected', unprotected);
        formData.append('castrated', castrated);
        formData.append('animalType', animalType);
        formData.append('sizeType', sizeType);
        formData.append('ageYears', ageYears);
        formData.append('ageMonths', ageMonths);
        formData.append('image', fileImage);
        formData.append('locality_id', locality.id);

        try {
            const resp = await createAdoptionAction(formData);
            router.push(`/adopcion/${resp.id}`)
            successToast('Publicacion creada con exito!')
        } catch (error) {
            setPublishing(false)
            errorToast("Error: ", error.message)
        }
    }
    
    return (
        <div className='flex flex-grow flex-col mb-4 xs:mx-4 md:ml-12 justify-between'>
            <div className='flex xs:flex-col md:flex-row xs:gap-2 md:gap-8 mt-4 xs:items-center md:items-start'>
                <div className="flex items-center"> 
                    <div className="xs:w-[250px] xs:h-[250px] sm:w-[300px] sm:h-[300px] overflow-hidden mb-4 flex items-center">
                        <img
                            alt="Imagen seleccionada"
                            src={image}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                </div> 
                <div className='flex flex-col'>
                    <h1 className={`${inter.className} flex xs:justify-center md:justify-start xs:text-xl 2xl:text-2xl font-bold text-primary-blue`}>{title}</h1>
                    <p className={`${inter.className} xs:text-sm md:text-md 2xl:text-xl font-medium text-black xs:mt-1 md:mt-2`}>TAMAÑO</p>
                    <p className='xs:text-sm 2xl:text-lg'>{mapSizeType(sizeType)}</p>
                    <div className='xs:tp-1 md:mt-2'>
                        <p className={`${inter.className} xs:text-sm md:text-md 2xl:text-xl font-medium text-black`}>EDAD</p>
                        <p className='flex xs:text-sm 2xl:text-lg'>{ageYears} año{ageYears != 1 ? 's' : ''} {ageMonths} mes{ageMonths != 1 ? 'es' : ''}</p>
                    </div>
                    <div className='xs:mt-1 md:mt-2 xs:mb-1 md:mb-2'>
                        <p className={`${inter.className} xs:text-sm md:text-md 2xl:text-xl font-medium text-black`}>SEXO</p>
                        <p className='xs:text-sm 2xl:text-lg'>{mapSexType(sexType)}</p>
                    </div>
                    <div className='xs:mt-0 md:mt-2 xs:mb-1 md:mb-2'>                 
                        <p className={`${inter.className} xs:text-sm md:text-md 2xl:text-xl font-medium text-black`}>UBICACIÓN</p>
                        <p className='xs:text-sm 2xl:text-lg'>{locality.name}, {locality.province.name}</p>
                    </div>
                    <div className='flex xs:flex-col md:flex-row'>
                        <div>
                            {vaccinated && <Checkbox aria-label='Vacunado' className='text-black xs:text-sm 2xl:text-lg mr-2' defaultSelected isSelected>Vacunado</Checkbox>}
                        </div>
                        <div>
                            {unprotected && <Checkbox aria-label='Desparasitado' className='text-black xs:text-sm 2xl:text-lg mr-2'  defaultSelected isSelected>Desparasitado</Checkbox>}
                        </div>
                        <div>
                            {castrated && <Checkbox aria-label='Castrado' className='text-black xs:text-sm 2xl:text-lg mr-2'  defaultSelected isSelected>Castrado</Checkbox>} 
                        </div>
                    </div>
                    <div className='xs:mt-1 md:mt-2'>
                        <p className={`${inter.className} xs:text-sm md:text-md font-medium text-black`}>DESCRIPCIÓN</p>
                        <Textarea
                        isReadOnly
                        defaultValue={description}
                        className="xs:w-[200px] sm:w-[400px]"
                        rows="3"
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
                    <button className="bg-primary-orange xs:text-sm md:text-md hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" type="submit" onClick={publicarAdopcion}>Publicar</button>
                }
            </div>
        </div>
    )
}

export default Step4;