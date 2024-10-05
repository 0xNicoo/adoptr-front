"use client";
import React, { useEffect, useState } from 'react';
import { useFormStoreLost } from '@/app/store';
import { Radio, RadioGroup, Checkbox, Autocomplete, AutocompleteItem, Input, Select, SelectItem } from '@nextui-org/react';
import { Inter } from "next/font/google";
import Image from 'next/image';
import { getLocalitiesAction, getProvinceAction } from '@/actions/location';
import MapForm from './MapForm';
import { ErrorOutlineSharp } from '@mui/icons-material';

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
  //const [latitude, setLatitude] = useState(0);
  //const [longitude, setLongitude] = useState(0);
  const { animalType, title, ageYears, ageMonths, sexType, sizeType, locality, province, longitude, latitude, setNombre, setAnios, setMeses, setSexo, setTamanio, setLocality, setProvince, setLongitude, setLatitude } = useFormStoreLost();
  const [errors, setErrors] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingLocalities, setLoadingLocalities] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState('');

  const sexoAnimales = [
    { label: 'Macho', 
      key: 'MALE'},
    {
      label: 'Hembra',
      key: 'FEMALE'},
    {
      label: 'Indeterminado',
      key: 'INDETERMINATE'
    }
  ]

  const handleSexoChange = (value) => {
    setSexo(value);  

  };
  const handleTamanioChange = (value) => {
    setSelected(value); 
    setTamanio(value);
  }
  const handleAniosChange = (value) => { 
    if (value) {
      const numero = value.split(' ')[0];
      setAnios(numero);
    } else {
      setAnios(''); 
    }
  };
  const handleMesesChange = (value) => {
    if (value) {
      const numero = value.split(' ')[0];
      setMeses(numero);
    } else {
      setMeses('');
    }
  };
 
  useEffect(() => {
    setSelected(sizeType);
    setSexo(sexType);
  }, [sizeType, sexType]);

  const handleNextStep = () => {
    let newErrors = {}
    const fields = {
      title,
      ageYears,
      ageMonths,
      sexType,
      sizeType,
      province,
      locality,
      latitude,
      longitude,
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

  useEffect(() => {
    async function fetchProvinces() {
      try {
        const provincesData = await getProvinceAction();
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
          const localitiesData = await getLocalitiesAction(province);
          setLocalities(localitiesData || []);
          setLoadingLocalities(false);
        } catch (error) {
          console.error("Error al cargar localidades:", error);
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
    <div className='flex flex-grow mb-4 ml-12'>
      <div className='flex flex-col w-2/3 mb-4 ml-12'>
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
            <Autocomplete isRequired placeholder='Seleccionar' aria-label="Seleccionar sexo"
            selectedKey={sexType || ''}  
            onSelectionChange={(key) => handleSexoChange(key)}
            >
              {sexoAnimales.map((sexoAnimal) => (
                <AutocompleteItem key={sexoAnimal.key} value={sexoAnimal.key}>
                  {sexoAnimal.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            {errors.sexType && <p className='text-red-500 mt-2 text-xs'>{errors.sexType}</p>}
          </div>
        </div>

        <div className='flex flex-col mt-8'>
          <div className='flex flex-col'>
            <label htmlFor="edad" className="block xl:text-md 2xl:text-xl font-medium">Edad</label>
            <div className='flex flex-row gap-12 mt-2'>
              <div className='flex flex-col w-1/6'>
                <div className='flex'>
                  <Autocomplete 
                  isRequired 
                  placeholder='Seleccionar año' 
                  aria-label="Seleccionar año"
                  selectedKey={ageYears || ''}  
                  onSelectionChange={(key) => handleAniosChange(key)}
                  >
                    {aniosConst.map((anio) => (
                      <AutocompleteItem key={anio.key} value={anio.key}>
                        {anio.label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                {errors.ageYears && <p className='text-red-500 mt-2 text-xs'>{errors.ageYears}</p>}
              </div>
              <div className='flex flex-col w-1/6'>
                <div className='flex'>
                  <Autocomplete 
                  isRequired 
                  placeholder='Seleccionar mes' 
                  aria-label="Seleccionar mes"
                  selectedKey={ageMonths || ''}  
                  onSelectionChange={(key) => handleMesesChange(key)}
                  >
                    {mesesConst.map((mes) => (
                      <AutocompleteItem key={mes.key} value={mes.key}>
                        {mes.label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
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
                  <Select aria-label='Cargando' placeholder='Cargando...' className="w-full min-w-[12rem]" isLoading></Select>
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
                  <Select aria-label='Cargando' placeholder='Cargando...' className="w-full min-w-[12rem]" isLoading></Select>
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
        </div>  

        <div className='w-1/3 p-4'>
          <MapForm
            longitude={longitude}
            latitude={latitude}
            setLongitude={setLongitude}
            setLatitude={setLatitude}
          />
          {errors.latitude && <p className='text-red-500 mt-2 text-xs'>{errors.latitude}</p>}
          {errors.longitude && <p className='text-red-500 mt-2 text-xs'>{errors.longitude}</p>}
    </div>

      <div className="flex flex-row justify-between mt-4 items-end mr-4">
        <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={prevStep}>Atrás</button>
        <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={handleNextStep}>Siguiente</button>
      </div>
    </div>
  );
}

export default Step2;
