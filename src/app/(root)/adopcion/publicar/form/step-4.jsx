"use client";
import React from 'react';
import { useFormStore } from './store';
import { Inter } from "next/font/google";
import { Checkbox } from '@nextui-org/react';
import Image from 'next/image';

const inter = Inter({ subsets: ["latin"] });

const Step4 = () => {
    const { nombre, tamanio, anios, meses, sexo, vacunado, desparasitado, castrado, descripcion, imagen } = useFormStore();
    return (
        <div className='flex flex-grow flex-row gap-8 mt-4 items-start'>
            <div className="flex ml-10 items-center"> 
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
                <div className='mt-2'>
                    <p className={`${inter.className} xl:text-md 2xl:text-xl font-medium text-black`}>SEXO</p>
                    <p className='xl:text-sm 2xl:text-lg'>{sexo}</p>
                </div>
                <div className='mt-2 flex flex-col'>
                    <div className='mb-2'>
                        {vacunado && <Checkbox aria-label='Vacunado' className='text-black xl:text-sm 2xl:text-lg' defaultSelected isSelected>Vacunado</Checkbox>}
                    </div>
                    <div className='mb-2'>
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
    )
}

export default Step4;