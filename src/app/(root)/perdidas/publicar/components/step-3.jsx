"use client";
import React, { useState } from 'react';
import { useFormStoreLost } from '@/app/store';
import Image from 'next/image';
import { CIcon } from '@coreui/icons-react';
import { cilImagePlus } from '@coreui/icons';
import { Textarea } from '@nextui-org/react';

const Step3 = ({nextStep={nextStep}, prevStep={prevStep}}) => {
    const { description, setDescripcion, image, setImagen, nombreImagen, setNombreImagen, setFileImage } = useFormStoreLost();
    const [errors, setErrors] = useState('');
    const imageHandler = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileImage(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagen(reader.result); 
            };
            reader.readAsDataURL(file); 
            setNombreImagen(file.name);
        }
    };
    
    const handleNextStep = () => {
        let newErrors = {}
        const fields = {
          description,
          image
        };
        
        Object.entries(fields).forEach(([key, value]) => {
          if (!value) {
            newErrors[key] = '* Este campo es obligatorio';
          }
        });
        
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
        } else {
          nextStep();
        }
      }

    return (
        <div className='flex flex-grow justify-between flex-col ml-12 mb-4'>
            <div className='flex flex-row mt-4'>
                <div className='flex flex-col'>
                    <div className='flex items-center'>
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
                    <Textarea isRequired rows="3" value={description} className='w-2/3 text-lg' placeholder="Contanos características de la mascota, comportamiento, si hay recompensa, etc..." onChange={e => setDescripcion(e.target.value)}/>
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