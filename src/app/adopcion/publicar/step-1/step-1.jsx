"use client";
import React from 'react';
import { Radio, RadioGroup } from '@nextui-org/react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

/*export const Paso1 = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const base = useSelector(state => state.base)
  const { register, handleSubmit } = useForm({ defaultValues: { base } })

  const onSubmit = (data) => {
    dispatch(chooseBase(data.base))
    history.push("./paso-2/page.jsx")
  } 
}
 */

const Step1 = () => {
  const [selected, setSelected] = React.useState(null);
  return (
        <div>
          <h1 className={`2xl:text-4xl xl:text-2xl text-center font-bold text-primary-blue mb-10 ${inter.ClassName}`}>¿Qué animal vas a publicar?</h1>
          <RadioGroup value={selected} onValueChange={setSelected} orientation='horizontal'>
            <div className="flex flex-row gap-12 justify-center">
              <div className='justify-center'>
                <Radio value="perro" className={`justify-center xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-200 bg-gray-100 ${selected === 'perro' ? 'bg-gray-300' : 'bg-gray-100'}`}>
                  <Image className='h-full'
                  src= "/images/dogshape.png"
                  width={80}
                  height={80}
                  alt="Silueta de un perro"
                  />
                </Radio>
                <p className={`${inter.className} mt-2 text-center text-black`}>Perro</p>
              </div>
              <div className='justify-center items-center'>
                <Radio value="gato" className={`justify-center xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-200 bg-gray-100 ${selected === 'gato' ? 'bg-gray-300' : 'bg-gray-100'}`} >
                  <Image
                  src= "/images/catshape.png"
                  width={80}
                  height={80}
                  alt="Silueta de un gato"
                  />
                </Radio>
                <p className={`${inter.className} mt-2 text-center text-black`}>Gato</p>
              </div>
            </div>
          </RadioGroup>
        </div>
  )
};

export default Step1;