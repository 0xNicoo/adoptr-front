"use client";
import React, { useEffect, useState } from 'react';
import { useFormStoreAdopcion } from '../../../../store';
import { Radio, RadioGroup, Checkbox, Select, SelectItem, Input } from '@nextui-org/react';
import { Inter } from "next/font/google";
import Image from 'next/image';
import { getProvince, getLocality } from './actions';

const inter = Inter({ subsets: ["latin"] });

const generarAnios = (min, max) => {
  const ageYears = [];
  for (let i = min; i <= max; i++) {
    ageYears.push({ key: `${i}`, label: `${i} año${i != 1 ? 's' : ''}` });
  }
  return ageYears;
}

const aniosConst = generarAnios(0, 20);

const generarMeses = (min, max) => {
  const ageMonths = [];
  for (let i = min; i <= max; i++) {
    ageMonths.push({ key: `${i}`, label: `${i} mes${i != 1 ? 'es' : ''}` });
  }
  return ageMonths;
}

const mesesConst = generarMeses(0, 11);

const Step2 = ({nextStep, prevStep}) => {

  const { animalType, title, ageYears, ageMonths, sexType, sizeType, vaccinated, unprotected, castrated, locality, province, setNombre, setAnios, setMeses, setSexo, setTamanio, setVacunado, setDesparasitado, setCastrado, setLocality, setProvince } = useFormStoreAdopcion();
  const [errors, setErrors] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingLocalities, setLoadingLocalities] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState('');
  
  const sexoAnimales = [
    { label: 'Masculino', 
      key: 'MALE'},
    {
      label: 'Femenino',
      key: 'FEMALE'},
    {
      label: 'Indeterminado',
      key: 'INDETERMINATE'
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
    const numero = value.split(' ')[0];
    setAnios(numero);
  };
  const handleMesesChange = (value) => {
    const numero = value.split(' ')[0];
    setMeses(numero);
  };
 
  useEffect(() => {
    setSelected(sizeType);
    setVacunado(vaccinated);
    setSexo(sexType);
    setDesparasitado(unprotected);
    setCastrado(castrated);
  }, [sizeType, vaccinated, unprotected, castrated, sexType]);

  const handleNextStep = () => {
    let newErrors = {}
    if (!title) {
      newErrors.title = '* Este campo es obligatorio';
    }
    if (!ageYears) {
      newErrors.ageYears = '* Este campo es obligatorio';
    }
    if (!ageMonths) {
      newErrors.ageMonths = '* Este campo es obligatorio';
    }
    if (!sexType) {
      newErrors.sexType = '* Este campo es obligatorio';
    }
    if (!sizeType) {
      newErrors.sizeType = '* Este campo es obligatorio';
    }
    if (!province) {
      newErrors.province = '* Este campo es obligatorio';
    }
    if (!locality) {
      newErrors.locality = '* Este campo es obligatorio';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      nextStep();
    }
  }

  useEffect(() => {
    async function fetchProvinces() {
      try {
        const provincesData = await getProvince();
        setProvinces(provincesData || []);
        setLoadingProvinces(false);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setError('Error al cargar las provincias');
        setLoadingProvinces(false);
      }
    }
    fetchProvinces();
  }, []);

  useEffect(() => {
    async function fetchLocalities() {
      if (province) {
        setLoadingLocalities(true);
        try {
          const localitiesData = await getLocality(province);
          setLocalities(localitiesData || []);
          setLoadingLocalities(false);
        } catch (error) {
          console.error("Error fetching localities:", error);
          setError('Error al cargar las localidades');
          setLoadingLocalities(false);
        }
      } else {
        setLocalities([]);
      }
    }
    fetchLocalities();
  }, [province]);

  return (
    <div className='flex flex-grow flex-col mb-4 ml-12'>
      <div className='flex flex-row gap-12'>
        <div className='flex flex-col w-1/6'>
          <label htmlFor="nombre" className="block xl:text-md 2xl:text-xl font-medium">Nombre</label>
          <div className="flex mt-2 gap-4">
            <Input isRequired aria-label="Seleccionar nombre" value={title} onChange={e => setNombre(e.target.value)} id="nombre" name="nombre" type="text" placeholder="Juan"/>
          </div>
          {errors.title && <p className='text-red-500 mt-2 text-xs'>{errors.title}</p>}
        </div>

      <div className='flex flex-col w-1/6'>
        <label htmlFor="sexo" className='block mb-2 xl:text-md 2xl:text-xl font-medium'>Sexo</label>
        <Select isRequired placeholder='Seleccionar' aria-label="Seleccionar sexo"
        selectedKeys={sexType ? [sexType] : []}  
        onSelectionChange={(keys) => handleSexoChange(keys.values().next().value)}
        >
          {sexoAnimales.map((sexoAnimal) => (
            <SelectItem key={sexoAnimal.key} value={sexoAnimal.key}>
              {sexoAnimal.label}
            </SelectItem>
          ))}
        </Select>
        {errors.sexType && <p className='text-red-500 mt-2 text-xs'>{errors.sexType}</p>}
      </div>
    </div>

    <div className='flex flex-col mt-8'>
      <div className='flex flex-col'>
        <label htmlFor="edad" className="block xl:text-md 2xl:text-xl font-medium">Edad</label>
        <div className='flex flex-row gap-12 mt-2'>
          <div className='flex flex-col w-1/6'>
            <div className='flex'>
              <Select 
              isRequired 
              placeholder='Seleccionar año' 
              aria-label="Seleccionar año"
              selectedKeys={ageYears ? [ageYears] : []}  
              onSelectionChange={(keys) => handleAniosChange(keys.values().next().value)}
              >
                {aniosConst.map((anio) => (
                  <SelectItem key={anio.key} value={anio.key}>
                    {anio.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            {errors.ageYears && <p className='text-red-500 mt-2 text-xs'>{errors.ageYears}</p>}
          </div>
          <div className='flex flex-col w-1/6'>
            <div className='flex'>
              <Select 
              isRequired 
              placeholder='Seleccionar mes' 
              aria-label="Seleccionar mes"
              selectedKeys={ageMonths ? [ageMonths] : []}  
              onSelectionChange={(keys) => handleMesesChange(keys.values().next().value)}
              >
                {mesesConst.map((mes) => (
                  <SelectItem key={mes.key} value={mes.key}>
                    {mes.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            {errors.ageMonths && <p className='text-red-500 mt-2 text-xs'>{errors.ageMonths}</p>}
          </div>
        </div>
      </div>
    </div>

    <div className='flex flex-col mt-8'>
      <div className='flex flex-row gap-12'>
        <div className='flex flex-col w-1/6'>
        <label htmlFor="provincia" className='block xl:text-md 2xl:text-xl font-medium'>Provincia</label>
          <div className='flex flex-col mt-2 gap-4 w-1/6'>
            {loadingProvinces ? (
              <p>Cargando provincias...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <Select className="w-full min-w-[12rem]"
                placeholder='Seleccionar'
                isRequired
                aria-label="Seleccionar provincia"
                value={province}
                onChange={e => {
                  setProvince(e.target.value);
                  console.log(province);
                }}
              >
                {provinces.map((prov) => (
                  <SelectItem key={prov.id} value={prov.id}>
                    {prov.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          </div>
          {errors.province && <p className='text-red-500 mt-2 text-xs'>{errors.province}</p>}
        </div>
        <div className='flex flex-col w-1/6'>
          <label htmlFor="localidad" className='block xl:text-md 2xl:text-xl font-medium'>Localidad</label>
          <div className='flex mt-2 gap-4 w-1/6'>
            {loadingLocalities ? (
              <p>Cargando localidades...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <Select className="w-full min-w-[12rem]"
                placeholder='Seleccionar'
                isRequired
                aria-label="Seleccionar localidad"
                value={locality}
                onChange={e => {
                  const selectedLoc = localities.find(loc => loc.id == e.target.value);
                  setLocality(selectedLoc);  
                }}
              >
                {localities.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          </div>
          {errors.locality && <p className='text-red-500 mt-2 text-xs'>{errors.locality}</p>}
        </div>
    </div>
  </div>

      <div className='flex flex-col mt-8'>
        <label htmlFor="tamanio" className="block xl:text-md 2xl:text-xl font-medium">Tamaño</label>
        <div className='flex mt-4'>
          <RadioGroup value={selected} onValueChange={handleTamanioChange} orientation='horizontal'>
            <div className="flex flex-row gap-12 justify-center">
              <div className='flex flex-col justify-center items-center'>
                <Radio value="SMALL" className="hidden" aria-label="Tamaño"/>
                  <div className={`flex items-center justify-center xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-200 bg-gray-100 ${selected === 'SMALL' ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => handleTamanioChange('SMALL')}>
                    <Image
                    src={animalType == "DOG" ? "/images/dog-small.png" : "/images/cat-small.png" } 
                    width={80}
                    height={80}
                    alt={animalType == "DOG" ? "Perro pequeño" : "Gato pequeño"}
                    />
                  </div>
                  <p className={`${inter.className} mt-4 text-center text-black`}>Pequeño</p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <Radio value="MEDIUM" className="hidden" aria-label="Tamaño"/>
                  <div className={`flex items-center justify-center xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-200 bg-gray-100 ${selected === 'MEDIUM' ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => handleTamanioChange('MEDIUM')}>
                    <Image
                    src={animalType == "DOG" ? "/images/dog-medium.png" : "/images/cat-medium.png" }
                    width={80}
                    height={80}
                    alt={animalType == "DOG" ? "Perro mediano" : "Gato mediano"}
                    />
                  </div>
                <p className={`${inter.className} mt-4 text-center text-black`}>Mediano</p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <Radio value="BIG" className="hidden" aria-label="Tamaño"/>
                  <div className={`flex items-center justify-center xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-200 bg-gray-100 ${selected === 'BIG' ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => handleTamanioChange('BIG')}>
                  <Image
                  src={animalType == "DOG" ? "/images/dog-big.png" : "/images/cat-big.png" }
                  width={80}
                  height={80}
                  alt={animalType == "DOG" ? "Perro grande" : "Gato grande"}
                  />
                  </div>
                <p className={`${inter.className} mt-4 text-center text-black`}>Grande</p>
              </div>
            </div>
          </RadioGroup>
        </div>
        {errors.sizeType && <p className='text-red-500 mt-2 text-xs'>{errors.sizeType}</p>}
      </div>

      <div className='flex mt-8 gap-8'>
          <Checkbox isSelected={vaccinated} onChange={handleVacunadoChange} checked={vaccinated}>Vacunado</Checkbox>
          <Checkbox isSelected={unprotected} onChange={handleDesparasitadoChange} checked={unprotected}>Desparasitado</Checkbox>
          <Checkbox isSelected={castrated} onChange={handleCastradoChange} checked={castrated}>Castrado</Checkbox>
      </div>
      <div className="flex flex-row justify-between mt-4 items-end mr-4">
        <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={prevStep}>Atrás</button>
        <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={handleNextStep}>Siguiente</button>
      </div>
    </div>
  );
}

export default Step2;
