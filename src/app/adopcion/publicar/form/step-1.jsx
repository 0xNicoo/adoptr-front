"use client";
import React, { useEffect } from 'react';
import { Radio, RadioGroup } from '@nextui-org/react';
import { useFormStore } from './store';
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

const Step1 = () => {
  const [selected, setSelected] = React.useState(null);
  const { animalType, setAnimalType } = useFormStore();
  useEffect(() => {
    setSelected(animalType);
  }, [animalType]);

  const handleAnimalChange = (value) => {
    setSelected(value);
    setAnimalType(value);
  }

  return (
        <div className='flex flex-grow flex-col items-center mt-4'>
          <h1 className={`2xl:text-4xl xl:text-2xl text-center font-bold text-primary-blue mb-10 ${inter.ClassName}`}>¿Qué animal vas a publicar?</h1>
          <RadioGroup value={selected} onValueChange={handleAnimalChange} orientation='horizontal'>
            <div className="flex flex-row gap-12 justify-center">
              <div className='flex flex-col justify-center items-center'>
              <Radio value='perro' className="hidden" />
                  <div className={`flex items-center justify-center xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-200 bg-gray-100 ${selected === 'perro' ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => handleAnimalChange('perro')}>
                    <Image
                    src= "/images/dogshape.png"
                    width={80}
                    height={80}
                    alt="Silueta de un perro"
                    />
                  </div>
                <p className={`${inter.className} mt-2 text-center text-black`}>Perro</p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <Radio value='gato' className="hidden" />
                  <div className={`flex items-center justify-center xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-200 bg-gray-100 ${selected === 'gato' ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => handleAnimalChange('gato')}>
                    <Image
                    src= "/images/catshape.png"
                    width={80}
                    height={80}
                    alt="Silueta de un gato"
                    />
                  </div>
                <p className={`${inter.className} mt-2 text-center text-black`}>Gato</p>
              </div>
            </div>
          </RadioGroup>
        </div>
  )
};

export default Step1;