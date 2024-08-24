"use client";
import React, { useState } from 'react';
import { useFormStore } from '../../../../store';
import Image from 'next/image';
import { CIcon } from '@coreui/icons-react';
import { cilImagePlus } from '@coreui/icons';
import { Textarea } from '@nextui-org/react';

const Step3 = ({nextStep={nextStep}, prevStep={prevStep}}) => {
    const { description, setDescripcion, image, setImagen, nombreImagen, setNombreImagen } = useFormStore();
    const [errors, setErrors] = useState('');
    const imageHandler = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagen(reader.result); 
            };
            reader.readAsDataURL(file); 
            setNombreImagen(file.name);
        }
    };
    
    const handleNextStep = () => {
        let newErrors=[]
        if (!description) {
            newErrors.descripcion = '* Este campo es obligatorio';
        }
        if (!image) {
            newErrors.image = '* Este campo es obligatorio';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        }
        else {
            nextStep();
        }
    }

    return (
        <div className='flex flex-grow justify-between flex-col ml-12 mb-4'>
            <div className='flex flex-row mt-4'>
                <div className='flex flex-col'>
                    <div className='flex items-center'>
                        {image ? (
                            <div className="flex mb-4 items-center"> 
                                <Image className='rounded-xl xl:w-80 2xl:w-96'
                                src={image}
                                alt='Imagen seleccionada'
                                width={200}
                                height={350}
                                />
                            </div>   
                        ): (
                            <div className="flex mb-4 items-center pt-16 pb-16 px-16 bg-gray-100 rounded-xl">
                                <CIcon icon={cilImagePlus} className='xl:w-32 xl:h-32 2xl:w-40 2xl:w-40 text-gray-500'/>
                            </div>
                        ) 
                        } 
                    </div>
                    <div className="flex flex-column mt-2 justify-content items-center">
                        <input type="file" id="custom-input" onChange={imageHandler} hidden/>
                        <label htmlFor="custom-input" className="block xl:text-md 2xl:text-lg mr-4 py-2 px-4
                        rounded-xl text-sm bg-gray-100
                        text-black hover:bg-gray-200 cursor-pointer">
                            Elegir imagen
                        </label>
                        <label className="text-sm text-slate-500">{nombreImagen ? nombreImagen : "Ningún archivo seleccionado"}</label>
                    </div>
                    {errors.image && <p className='text-red-500 mt-2 text-xs'>{errors.image}</p>}
                </div>
                <div className='flex flex-col xl:ml-8 grow'>
                    <label htmlFor="descripcion" className="mb-2 text-primary-blue xl:text-lg 2xl:text-2xl font-medium">Agregá una descripción</label>
                    <Textarea isRequired rows="3" value={description} className='w-2/3 text-lg' placeholder="Contanos sobre su personalidad, sus hábitos, su historia y cualquier detalle importante." onChange={e => setDescripcion(e.target.value)}/>
                    {errors.description && <p className='text-red-500 mt-2 text-xs'>{errors.description}</p>}
                </div>
            </div>
            <div className="flex flex-row justify-between mt-4 mb-4 mr-4">
                <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={prevStep}>Atrás</button>
                <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={handleNextStep}>Siguiente</button>
            </div>
        </div>
    )
}

export default Step3;