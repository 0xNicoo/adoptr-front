"use client";
import React from 'react';
import { useFormStore } from '../../../../store';
import { Inter } from "next/font/google";
import { Checkbox } from '@nextui-org/react';
import Image from 'next/image';
import { handleCreateAdoption } from './actions';

const inter = Inter({ subsets: ["latin"] });

const Step4 = ({prevStep = {prevStep}}) => {
    const { title, sizeType, animalType, ageYears, ageMonths, sexType, vaccinated, unprotected, castrated, description, image, resetForm } = useFormStore();
    
    const publicarAdopcion = async () => {
        const data = {
            title,
            description,
            sexType,
            vaccinated,
            unprotected,
            castrated,
            animalType,
            sizeType,
            adoptionStatusType: 'FOR_ADOPTION',
            ageYears,
            ageMonths,
            s3Url: "string",
            locality: {
                id: 1
            },
            user: {
                id: 1,
                email: "dolo@gmail.com"
            }
        }
        
        try {
            await handleCreateAdoption(data);
            resetForm();
        } catch (error) {
            console.log('Error al publicar', error);
            console.log(data);
        }
    }
    
    return (
        <div className='flex flex-grow flex-col mb-4 ml-12 justify-between'>
            <div className='flex flex-row gap-8 mt-4 items-start'>
                <div className="flex items-center"> 
                    <Image className='rounded-xl xl:w-80 2xl:w-96'
                    src={image}
                    alt='Imagen seleccionada'
                    width={200}
                    height={350}
                    />
                </div> 
                <div className='flex flex-col'>
                    <h1 className={`${inter.className} xl:text-xl 2xl:text-2xl font-bold text-primary-blue`}>{title}</h1>
                    <p className={`${inter.className} xl:text-md 2xl:text-xl font-medium text-black mt-2`}>TAMAÑO</p>
                    <p className='xl:text-sm 2xl:text-lg'>{sizeType}</p>
                    <div className='mt-2'>
                        <p className={`${inter.className} xl:text-md 2xl:text-xl font-medium text-black`}>EDAD</p>
                        <p className='flex xl:text-sm 2xl:text-lg'>{ageYears} {ageMonths}</p>
                    </div>
                    <div className='mt-2 mb-2'>
                        <p className={`${inter.className} xl:text-md 2xl:text-xl font-medium text-black`}>SEXO</p>
                        <p className='xl:text-sm 2xl:text-lg'>{sexType}</p>
                    </div>
                    <div className='flex flex-row gap-4'>
                        <div>
                            {vaccinated && <Checkbox aria-label='Vacunado' className='text-black xl:text-sm 2xl:text-lg' defaultSelected isSelected>Vacunado</Checkbox>}
                        </div>
                        <div>
                            {unprotected && <Checkbox aria-label='Desparasitado' className='text-black xl:text-sm 2xl:text-lg'  defaultSelected isSelected>Desparasitado</Checkbox>}
                        </div>
                        <div>
                            {castrated && <Checkbox aria-label='Castrado' className='text-black xl:text-sm 2xl:text-lg'  defaultSelected isSelected>Castrado</Checkbox>} 
                        </div>
                    </div>
                    <div className='mt-2'>
                        <p className={`${inter.className} text-md font-medium text-black`}>DESCRIPCIÓN</p>
                        <p className='xl:text-sm 2xl:text-lg'>{description}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-between mt-4 mb-4 items-end mr-4">
                <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={prevStep}>Atrás</button>
                <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" type="submit" onClick={publicarAdopcion}>Publicar</button>
            </div>
        </div>
    )
}

export default Step4;