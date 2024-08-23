"use client";
import React, { useEffect } from 'react';
import { useFormStore } from '../../../../store';
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

const Step2 = ({nextStep, prevStep}) => {
  const [selected, setSelected] = React.useState(null);
  const [errors, setErrors] = React.useState('');
  const { animalType, nombre, anios, meses, sexo, tamanio, vacunado, desparasitado, castrado, setNombre, setAnios, setMeses, setSexo, setTamanio, setVacunado, setDesparasitado, setCastrado } = useFormStore();
  
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

  const handleNextStep = () => {
    let newErrors = {}
    if (!nombre) {
      newErrors.nombre = '* Este campo es obligatorio';
    }
    if (!anios) {
      newErrors.anios = '* Este campo es obligatorio';
    }
    if (!meses) {
      newErrors.meses = '* Este campo es obligatorio';
    }
    if (!sexo) {
      newErrors.sexo = '* Este campo es obligatorio';
    }
    if (!tamanio) {
      newErrors.tamanio = '* Este campo es obligatorio';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      nextStep();
    }
  }

  return (
    <div className='flex flex-grow flex-col mb-4 ml-12'>
      <div className='flex flex-row gap-12'>
        <div className='flex flex-col'>
          <label htmlFor="nombre" className="block xl:text-md 2xl:text-xl font-medium">Nombre</label>
          <div className="flex mt-2 gap-4">
            <Input isRequired aria-label="Seleccionar nombre" value={nombre} onChange={e => setNombre(e.target.value)} id="nombre" name="nombre" type="text" placeholder="Juan"/>
          </div>
          {errors.nombre && <p className='text-red-500 mt-2 text-xs'>{errors.nombre}</p>}
        </div>

        <div className='flex flex-col'>
          <label htmlFor="edad" className="block xl:text-md 2xl:text-xl font-medium">Edad</label>
          <div className='flex flex-row gap-4 mt-2'>
            <div className='flex flex-col w-full'>
              <div className='flex'>
                <Select 
                isRequired 
                placeholder='Seleccionar año' 
                aria-label="Seleccionar año"
                selectedKeys={anios ? [anios] : []}  
                onSelectionChange={(keys) => handleAniosChange(keys.values().next().value)}
                className= "w-full min-w-[10rem]"
                >
                  {aniosConst.map((anio) => (
                    <SelectItem key={anio.key} value={anio.key}>
                      {anio.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              {errors.anios && <p className='text-red-500 mt-2 text-xs'>{errors.anios}</p>}
          </div>
          <div className='flex flex-col w-full'>
            <div className='flex'>
              <Select 
              isRequired 
              placeholder='Seleccionar mes' 
              aria-label="Seleccionar mes"
              selectedKeys={meses ? [meses] : []}  
              onSelectionChange={(keys) => handleMesesChange(keys.values().next().value)}
              className= "w-full min-w-[10rem]"
              >
                {mesesConst.map((mes) => (
                  <SelectItem key={mes.key} value={mes.key}>
                    {mes.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            {errors.meses && <p className='text-red-500 mt-2 text-xs'>{errors.meses}</p>}
          </div>
        </div>
      </div>

      <div className='flex flex-col'>
        <label htmlFor="sexo" className='block mb-2 xl:text-md 2xl:text-xl font-medium'>Sexo</label>
        <Select isRequired placeholder='Seleccionar' aria-label="Seleccionar sexo"
        className= "w-full min-w-[10rem]"
        selectedKeys={sexo ? [sexo] : []}  
        onSelectionChange={(keys) => handleSexoChange(keys.values().next().value)}
        >
          {sexoAnimales.map((sexoAnimal) => (
            <SelectItem key={sexoAnimal.key} value={sexoAnimal.key}>
              {sexoAnimal.label}
            </SelectItem>
          ))}
        </Select>
        {errors.sexo && <p className='text-red-500 mt-2 text-xs'>{errors.sexo}</p>}
      </div>
    </div>

      <div className='flex flex-col mt-8'>
        <label htmlFor="tamanio" className="block xl:text-md 2xl:text-xl font-medium">Tamaño</label>
        <div className='flex mt-4'>
          <RadioGroup value={selected} onValueChange={handleTamanioChange} orientation='horizontal'>
            <div className="flex flex-row gap-12 justify-center">
              <div className='flex flex-col justify-center items-center'>
                <Radio value="Pequeño" className="hidden" aria-label="Tamaño"/>
                  <div className={`flex items-center justify-center xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-200 bg-gray-100 ${selected === 'Pequeño' ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => handleTamanioChange('Pequeño')}>
                    <Image
                    src={animalType == "perro" ? "/images/dog-small.png" : "/images/cat-small.png" } 
                    width={80}
                    height={80}
                    alt={animalType == "perro" ? "Perro pequeño" : "Gato pequeño"}
                    />
                  </div>
                  <p className={`${inter.className} mt-4 text-center text-black`}>Pequeño</p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <Radio value="Mediano" className="hidden" aria-label="Tamaño"/>
                  <div className={`flex items-center justify-center xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-200 bg-gray-100 ${selected === 'Mediano' ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => handleTamanioChange('Mediano')}>
                    <Image
                    src={animalType == "perro" ? "/images/dog-medium.png" : "/images/cat-medium.png" }
                    width={80}
                    height={80}
                    alt={animalType == "perro" ? "Perro mediano" : "Gato mediano"}
                    />
                  </div>
                <p className={`${inter.className} mt-4 text-center text-black`}>Mediano</p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <Radio value="Grande" className="hidden" aria-label="Tamaño"/>
                  <div className={`flex items-center justify-center xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-200 bg-gray-100 ${selected === 'Grande' ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => handleTamanioChange('Grande')}>
                  <Image
                  src={animalType == "perro" ? "/images/dog-big.png" : "/images/cat-big.png" }
                  width={80}
                  height={80}
                  alt={animalType == "perro" ? "Perro grande" : "Gato grande"}
                  />
                  </div>
                <p className={`${inter.className} mt-4 text-center text-black`}>Grande</p>
              </div>
            </div>
          </RadioGroup>
        </div>
        {errors.tamanio && <p className='text-red-500 mt-2 text-xs'>{errors.tamanio}</p>}
      </div>

      <div className='flex mt-8 gap-8'>
          <Checkbox isSelected={vacunado} onChange={handleVacunadoChange} checked={vacunado}>Vacunado</Checkbox>
          <Checkbox isSelected={desparasitado} onChange={handleDesparasitadoChange} checked={desparasitado}>Desparasitado</Checkbox>
          <Checkbox isSelected={castrado} onChange={handleCastradoChange} checked={castrado}>Castrado</Checkbox>
      </div>
      <div className="flex flex-row justify-between mt-4 items-end mr-4">
        <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={prevStep}>Atrás</button>
        <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={handleNextStep}>Siguiente</button>
      </div>
    </div>
  );
}

export default Step2;
