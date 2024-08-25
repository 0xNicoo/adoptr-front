"use client";
import React from 'react';
import { useFormStoreAdopcion } from '../../../../store';
import { Inter } from "next/font/google";
import { Checkbox } from '@nextui-org/react';
import Image from 'next/image';

const inter = Inter({ subsets: ["latin"] });

const Step4 = ({prevStep = {prevStep}}) => {
    const { nombre, tamanio, anios, meses, sexo, vacunado, desparasitado, castrado, descripcion, imagen } = useFormStoreAdopcion();
    return (
        <div className='flex flex-grow flex-col mb-4 ml-12 justify-between'>
            <div className='flex flex-row gap-8 mt-4 items-start'>
                <div className="flex items-center"> 
                    <Image className='rounded-xl xl:w-80 2xl:w-96'
                    src={imagen}
                    alt='Imagen seleccionada'
                    width={200}
                    height={350}
                    />
                </div> 
                <div className='flex flex-col'>
                    <h1 className={`${inter.className} xl:text-xl 2xl:text-2xl font-bold text-primary-blue`}>{nombre}</h1>
                    <p className={`${inter.className} xl:text-md 2xl:text-xl font-medium text-black mt-2`}>TAMAÑO</p>
                    <p className='xl:text-sm 2xl:text-lg'>{tamanio}</p>
                    <div className='mt-2'>
                        <p className={`${inter.className} xl:text-md 2xl:text-xl font-medium text-black`}>EDAD</p>
                        <p className='flex xl:text-sm 2xl:text-lg'>{anios} {meses}</p>
                    </div>
                    <div className='mt-2 mb-2'>
                        <p className={`${inter.className} xl:text-md 2xl:text-xl font-medium text-black`}>SEXO</p>
                        <p className='xl:text-sm 2xl:text-lg'>{sexo}</p>
                    </div>
                    <div className='flex flex-row gap-4'>
                        <div>
                            {vacunado && <Checkbox aria-label='Vacunado' className='text-black xl:text-sm 2xl:text-lg' defaultSelected isSelected>Vacunado</Checkbox>}
                        </div>
                        <div>
                            {desparasitado && <Checkbox aria-label='Desparasitado' className='text-black xl:text-sm 2xl:text-lg'  defaultSelected isSelected>Desparasitado</Checkbox>}
                        </div>
                        <div>
                            {castrado && <Checkbox aria-label='Castrado' className='text-black xl:text-sm 2xl:text-lg'  defaultSelected isSelected>Castrado</Checkbox>} 
                        </div>
                    </div>
                    <div className='mt-2'>
                        <p className={`${inter.className} text-md font-medium text-black`}>DESCRIPCIÓN</p>
                        <p className='xl:text-sm 2xl:text-lg'>{descripcion}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-between mt-4 mb-4 items-end mr-4">
                <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={prevStep}>Atrás</button>
                <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" type="submit">Publicar</button>
            </div>
        </div>
    )
}

export default Step4;