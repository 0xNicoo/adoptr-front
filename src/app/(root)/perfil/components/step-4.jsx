"use client";
import React, {useState} from 'react';
import { useFormStorePerfil } from '../../../store';
import { Inter } from "next/font/google";
import { Image } from '@nextui-org/react';
import { Textarea } from '@nextui-org/react';
import { CIcon } from '@coreui/icons-react';
import { cilLocationPin } from '@coreui/icons';
import { useRouter } from 'next/navigation';
import { createProfileAction } from '@/actions/profile';
import CustomLoading from "@/app/components/customLoading";
import { errorToast, successToast } from '@/util/toast';

const inter = Inter({ subsets: ["latin"] });

const Step4 = ({ prevStep }) => { 
    const { firstName, lastName, genderType, description, fileImage, image, locality, resetForm } = useFormStorePerfil();
    const router = useRouter();
    const [publishing, setPublishing] = useState(false)

    const publicarPerfil = async () => {
        setPublishing(true)
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('genderType', genderType);
        formData.append('description', description);
        formData.append('locality_id', locality.id);
        formData.append('image', fileImage); 

        try {
            await createProfileAction(formData); 
            router.push('/mi-perfil');
            successToast('Perfil creado con exito!')
        } catch (error) {
            setPublishing(false)
            errorToast("Error: ", error.message)
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
        }
    }
    
    return (
        <div className='flex flex-grow flex-col mb-4 ml-12 justify-between'>
            <div className='flex flex-col gap-2'>
                <div className="flex justify-center overflow-hidden pt-2 pb-2 mt-2"> 
                    <Image className='object-cover rounded-full hover:scale-105'
                    src={image}
                    alt='Imagen seleccionada'
                    width={250}
                    height={250}
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
                {
                    publishing ? 
                    <div className='py-2 px-8'>
                        <CustomLoading />
                    </div>
                    :
                    <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" type="submit" onClick={publicarPerfil}>Finalizar</button>
                }
            </div>
        </div>
    )
}

export default Step4;
