"use client";
import React, { useState } from 'react';
import { useFormStore } from './store';
import Image from 'next/image';
import { CIcon } from '@coreui/icons-react';
import { cilImagePlus } from '@coreui/icons';
import { Textarea } from '@nextui-org/react';

const Step3 = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const { descripcion, setDescripcion, imagen, setImagen } = useFormStore();
    const imageHandler = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagen(URL.createObjectURL(file));
        }
    };
  
    return (
            <div className='flex flex-grow flex-row mt-4'>
                <div className='flex flex-col '>
                    <div className='flex items-center'>
                        {imagen ? (
                            <div className="flex ml-10 mb-4 items-center"> 
                                <Image className='rounded-xl xl:w-80 2xl:w-96'
                                src={imagen}
                                alt='Imagen seleccionada'
                                width={200}
                                height={350}
                                />
                            </div>   
                        ): (
                            <div className="flex ml-10 mb-4 items-center pt-16 pb-16 px-16 bg-gray-100 rounded-xl">
                                <CIcon icon={cilImagePlus} className='xl:w-32 xl:h-32 2xl:w-40 2xl:w-40 text-gray-500'/>
                            </div>
                        ) 
                        } 
                    </div>
                    <div className="flex flex-column justify-content items-center ml-10">
                        <input type="file" id="custom-input" onChange={imageHandler} hidden/>
                        <label htmlFor="custom-input" className="block xl:text-md 2xl:text-lg mr-4 py-2 px-4
                        rounded-xl text-sm bg-gray-100
                        text-black hover:bg-gray-200 cursor-pointer">
                            Elegir imagen
                        </label>
                        <label className="text-sm text-slate-500">{selectedFile ? selectedFile.name : "Ningún archivo seleccionado"}</label>
                    </div>
                </div>
                <div className='flex flex-col xl:ml-8 grow'>
                    <label htmlFor="descripcion" className="mb-2 text-primary-blue xl:text-lg 2xl:text-2xl font-medium">Agregá una descripción</label>
                    <Textarea rows="3" value={descripcion} className='w-2/3 text-lg' placeholder="Contanos sobre su personalidad, sus hábitos, su historia y cualquier detalle importante." onChange={e => setDescripcion(e.target.value)}/>
                </div>
            </div>
    )
}

export default Step3;