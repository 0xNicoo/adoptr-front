"use client";
import React, { useEffect } from 'react';
import { Radio, RadioGroup } from '@nextui-org/react';
import { useFormStoreAdopcion } from '../../../../store';
import { Inter } from "next/font/google";
import Image from "next/image";


const inter = Inter({ subsets: ["latin"] });

const Step1 = ({nextStep}) => {
  const [selected, setSelected] = React.useState(null);
  const { animalType, setAnimalType } = useFormStoreAdopcion();
  const [error, setError] = React.useState('');

  useEffect(() => {
    setSelected(animalType);
  }, [animalType]);

  const handleAnimalChange = (value) => {
    setSelected(value);
    setAnimalType(value);
    setError('');
  }

  const handleNextStep = () => {
    if (!animalType) {
      setError('* Seleccioná el tipo de animal')
    }
    else {
      nextStep();
    }

  }

  return (
    <div className='flex flex-grow flex-col mb-4 justify-between'>
      <div className='flex flex-col items-center xl:mt-4 lg:mt-4'>
          <h1 className={`2xl:text-4xl xl:text-2xl xs:text-md text-center font-bold text-primary-blue xs:mb-2 xl:mb-10 2xl:mb-14 ${inter.ClassName}`}>¿Qué animal vas a publicar?</h1>
          <RadioGroup value={selected} onValueChange={handleAnimalChange} orientation='horizontal'>
            <div className="flex flex-row gap-12 justify-center">
              <div className='flex flex-col justify-center items-center'>
              <Radio value='DOG' className="hidden" />
                  <div className={`flex items-center justify-center xs:w-24 xs:h-24 xl:w-52 xl:h-52 2xl:w-72 2xl:h-72 p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-200 bg-gray-100 ${selected === 'DOG' ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => handleAnimalChange('DOG')}>
                    <Image
                    src= "/images/dogshape.png"
                    width={80}
                    height={80}
                    alt="Silueta de un perro"
                    />
                  </div>
                <p className={`${inter.className} xs:text-sm mt-2 text-center text-black`}>Perro</p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <Radio value='CAT' className="hidden" />
                  <div className={`flex items-center justify-center xs:w-24 xs:h-24 xl:w-52 xl:h-52 2xl:w-72 2xl:h-72 p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-200 bg-gray-100 ${selected === 'CAT' ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => handleAnimalChange('CAT')}>
                    <Image
                    src= "/images/catshape.png"
                    width={80}
                    height={80}
                    alt="Silueta de un gato"
                    />
                  </div>
                <p className={`${inter.className} xs:text-sm mt-2 text-center text-black`}>Gato</p>
              </div>
            </div>
          </RadioGroup>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="flex flex-row xs:justify-center sm:justify-end mb-4 mx-4 xs:mb-0 xs:mt-2">
          <button className="bg-primary-orange xs:text-sm md:text-md hover:bg-orange-700  xs:px-4 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={handleNextStep}>
            Siguiente
          </button>
        </div>
    </div>
  )
};

export default Step1;