"use client";
import React, { useEffect } from 'react';
import { useFormStore } from './store';
import { Radio, RadioGroup, Checkbox, Select, SelectItem, Input } from '@nextui-org/react';
import { Inter } from "next/font/google";
import Image from 'next/image';

const inter = Inter({ subsets: ["latin"] });

const generarAnios = (min, max) => {
  const anios = [];
  for (let i = min; i <= max; i++) {
    anios.push({ key: `${i} año${i != 1 ? 's' : ''}`, label: `${i} año${i != 1 ? 's' : ''}` });
  }
  return anios;
}

const aniosConst = generarAnios(0, 20);

const generarMeses = (min, max) => {
  const meses = [];
  for (let i = min; i <= max; i++) {
    meses.push({ key: `${i} mes${i != 1 ? 'es' : ''}`, label: `${i} mes${i != 1 ? 'es' : ''}` });
  }
  return meses;
}

const mesesConst = generarMeses(0, 11);

const Step2 = () => {
  const [selected, setSelected] = React.useState(null);
  const { nombre, anios, meses, sexo, tamanio, vacunado, desparasitado, castrado, setNombre, setAnios, setMeses, setSexo, setTamanio, setVacunado, setDesparasitado, setCastrado } = useFormStore();
  
  const sexoAnimales = [
    { label: 'Masculino', 
      key: 'Masculino'},
    {
      label: 'Femenino',
      key: 'Femenino'
    }
  ]

  const handleVacunadoChange = (e) => setVacunado(e.target.checked);
  const handleDesparasitadoChange = (e) => setDesparasitado(e.target.checked);
  const handleCastradoChange = (e) => setCastrado(e.target.checked);
  const handleSexoChange = (value) => {
    setSexo(value);  
  };
  const handleTamanioChange = (value) => {
    setSelected(value); 
    setTamanio(value);
  }
  const handleAniosChange = (value) => { 
    setAnios(value);
  };
  const handleMesesChange = (value) => {
    setMeses(value);
  };
  useEffect(() => {
    setSelected(tamanio);
    setVacunado(vacunado);
    setSexo(sexo);
    setDesparasitado(desparasitado);
    setCastrado(castrado);
  }, [tamanio, vacunado, desparasitado, castrado, sexo]);

  return (
    <div className='flex flex-grow flex-col ml-12 mb-4'>
      <div className='flex flex-row gap-12'>
        <div className='flex flex-col'>
          <label htmlFor="nombre" className="block text-sm font-medium">Nombre</label>
          <div className="flex mt-2 gap-4">
            <Input aria-label="Seleccionar nombre" value={nombre} onChange={e => setNombre(e.target.value)} id="nombre" name="nombre" type="text" placeholder="Juan"/>
          </div>
        </div>

        <div className='flex flex-col w-2/6'>
          <label htmlFor="edad" className="block text-sm font-medium">Edad</label>
          <div className='flex flex-row gap-4 mt-2'>
            <Select placeholder='Seleccionar' aria-label="Seleccionar año"
            selectedKeys={anios ? [anios] : []}  
            onSelectionChange={(keys) => handleAniosChange(keys.values().next().value)}
            >
              {aniosConst.map((anio) => (
              <SelectItem key={anio.key} value={anio.key}>
                {anio.label}
              </SelectItem>
              ))}
            </Select>
            <Select placeholder='Seleccionar' aria-label="Seleccionar mes"
            selectedKeys={meses ? [meses] : []}  
            onSelectionChange={(keys) => handleMesesChange(keys.values().next().value)}
            >
              {mesesConst.map((mes) => (
              <SelectItem key={mes.key} value={mes.key}>
                {mes.label}
              </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <div className='flex-col mr-10 flex flex-wrap w-1/6 md:flex-nowrap'>
          <label htmlFor="sexo" className='block mb-2 text-sm font-medium'>Sexo</label>
          <Select placeholder='Seleccionar' aria-label="Seleccionar sexo"
          selectedKeys={sexo ? [sexo] : []}  
          onSelectionChange={(keys) => handleSexoChange(keys.values().next().value)}
          >
            {sexoAnimales.map((sexoAnimal) => (
            <SelectItem key={sexoAnimal.key} value={sexoAnimal.key}>
              {sexoAnimal.label}
            </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div className='flex flex-col mt-8'>
        <label htmlFor="tamanio" className="block text-sm font-medium">Tamaño</label>
        <div className='flex mt-4'>
          <RadioGroup value={selected} onValueChange={handleTamanioChange} orientation='horizontal'>
            <div className="flex flex-row gap-12 justify-center">
              <div className='flex flex-col justify-center items-center'>
                <Radio value="Pequeño" className="hidden" aria-label="Tamaño"/>
                  <div className={`flex items-center justify-center xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-200 bg-gray-100 ${selected === 'Pequeño' ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => handleTamanioChange('Pequeño')}>
                    <Image
                    src="/images/dog-small.png"
                    width={80}
                    height={80}
                    alt="Perro pequeño"
                    />
                  </div>
                  <p className={`${inter.className} mt-4 text-center text-black`}>Pequeño</p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <Radio value="Mediano" className="hidden" aria-label="Tamaño"/>
                  <div className={`flex items-center justify-center xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-200 bg-gray-100 ${selected === 'Mediano' ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => handleTamanioChange('Mediano')}>
                    <Image
                    src="/images/dog-medium.png"
                    width={80}
                    height={80}
                    alt="Perro mediano"
                    />
                  </div>
                <p className={`${inter.className} mt-4 text-center text-black`}>Mediano</p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <Radio value="Grande" className="hidden" aria-label="Tamaño"/>
                  <div className={`flex items-center justify-center xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-200 bg-gray-100 ${selected === 'Grande' ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => handleTamanioChange('Grande')}>
                  <Image
                  src="/images/dog-big.png"
                  width={80}
                  height={80}
                  alt="Perro grande"
                  />
                  </div>
                <p className={`${inter.className} mt-4 text-center text-black`}>Grande</p>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className='flex mt-8 gap-8'>
          <Checkbox isSelected={vacunado} onChange={handleVacunadoChange} checked={vacunado}>Vacunado</Checkbox>
          <Checkbox isSelected={desparasitado} onChange={handleDesparasitadoChange} checked={desparasitado}>Desparasitado</Checkbox>
          <Checkbox isSelected={castrado} onChange={handleCastradoChange} checked={castrado}>Castrado</Checkbox>
      </div>
    </div>
  );
}

export default Step2;
