"use client";
import React from 'react';
import { useFormStorePerfil } from '../../store';
import { Inter } from "next/font/google";
import Image from 'next/image';
import { Textarea } from '@nextui-org/react';
import { CIcon } from '@coreui/icons-react';
import { cilLocationPin } from '@coreui/icons';
import { handleCreatePerfil } from './actions';

const inter = Inter({ subsets: ["latin"] });

const Step4 = ({ prevStep }) => { 
    const { firstName, lastName, genderType, description, fileImage, image, locality } = useFormStorePerfil();

    const publicarAdopcion = async () => {
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('genderType', genderType);
        formData.append('description', description);
        formData.append('locality_id', 1);
        formData.append('image', fileImage); 

        try {
            await handleCreatePerfil(formData); 
            resetForm(); 
        } catch (error) {
            console.log('Error al crear perfil', error);
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
        }
    }
    
    return (
        <div className='flex flex-grow flex-col mb-4 ml-12 justify-between'>
            <div className='flex flex-col gap-2'>
                <div className="flex items-center justify-center mt-2"> 
                    <Image className='rounded-full xl:w-80 2xl:w-96 hover:scale-105 hover:shadow-xl'
                    src={image}
                    alt='Imagen seleccionada'
                    width={200}
                    height={350}
                    />
                </div> 
                <div className='flex items-center justify-center'>
                    <h1 className={`${inter.className} xl:text-xl 2xl:text-2xl text-primary-blue`}>{firstName} {lastName}</h1>
                </div>
                <div className='flex items-center justify-center'>
                <CIcon icon={cilLocationPin} className='mr-0.5 xl:w-5 xl:h-5 2xl:w-8 2xl:w-18 text-gray-500'/>
                    <p className={`${inter.className} text-gray-600 xl:text-md 2xl:text-lg`}>{locality.name}, {locality.province.name}</p>
                </div>
                <div className='flex items-center justify-center'>
                <Textarea
                isReadOnly
                defaultValue={description}
                className="max-w-xs"
                />
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
