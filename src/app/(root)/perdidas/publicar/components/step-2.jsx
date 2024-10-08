"use client";
import React, { useEffect, useState } from 'react';
import { useFormStoreLost } from '@/app/store';
import { Radio, RadioGroup, Checkbox, Autocomplete, AutocompleteItem, Input, Select, SelectItem } from '@nextui-org/react';
import { Inter } from "next/font/google";
import Image from 'next/image';
import { getLocalitiesAction, getProvinceAction } from '@/actions/location';
import MapForm from './mapForm';


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
  <div className="flex flex-col w-full px-4 py-4">
    <div className="flex mb-8">
      <div className="w-2/3 pr-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-row gap-12">
            <div className="flex flex-col w-1/4">
              <label htmlFor="nombre" className="block text-md font-medium mb-2">Nombre</label>
              <Input
                isRequired
                aria-label="Seleccionar nombre"
                value={title}
                onChange={e => setNombre(e.target.value)}
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Juan"
              />
              {errors.title && <p className='text-red-500 mt-2 text-xs'>{errors.title}</p>}
            </div>
            <div className="flex flex-col w-1/4">
              <label htmlFor="sexo" className='block mb-2 text-md font-medium'>Sexo</label>
              <Autocomplete
                isRequired
                placeholder='Seleccionar'
                aria-label="Seleccionar sexo"
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

          <div className="flex flex-col">
            <label htmlFor="edad" className="block text-md font-medium mb-2">Edad</label>
            <div className='flex flex-row gap-12'>
              <div className='flex flex-col w-1/4'>
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
                {errors.ageYears && <p className='text-red-500 mt-2 text-xs'>{errors.ageYears}</p>}
              </div>
              <div className='flex flex-col w-1/4'>
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
                {errors.ageMonths && <p className='text-red-500 mt-2 text-xs'>{errors.ageMonths}</p>}
              </div>
            </div>
          </div>

          <div className='flex flex-row gap-12'>
            <div className='flex flex-col w-1/4'>
              <label htmlFor="provincia" className='block text-md font-medium mb-2'>Provincia</label>
              <Autocomplete
                placeholder='Seleccionar'
                isRequired
                aria-label="Seleccionar provincia"
                selectedKey={province || ''}
                onSelectionChange={(key) => setProvince(key)}
              >
                {provinces.map((prov) => (
                  <AutocompleteItem key={prov.id} value={prov.id}>
                    {prov.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {errors.province && <p className='text-red-500 mt-2 text-xs'>{errors.province}</p>}
            </div>
            <div className='flex flex-col w-1/4'>
              <label htmlFor="localidad" className='block text-md font-medium mb-2'>Localidad</label>
              {loadingLocalities ? (
               <Select aria-label='Cargando' placeholder='Cargando...' isLoading></Select>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <Select 
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
              {errors.locality && <p className='text-red-500 mt-2 text-xs'>{errors.locality}</p>}
            </div>
          </div>

          <div className='flex flex-col'>
            <label htmlFor="tamanio" className="block text-md font-medium mb-2">Tamaño</label>
            <RadioGroup value={selected} onValueChange={handleTamanioChange} orientation='horizontal'>
              <div className="flex flex-row gap-12 justify-center">
                {['SMALL', 'MEDIUM', 'BIG'].map((size) => (
                  <div key={size} className='flex flex-col justify-center items-center'>
                    <Radio value={size} className="hidden" aria-label="Tamaño"/>
                    <div className={`flex items-center justify-center w-48 h-48 p-8 drop-shadow-md border border-gray-50 rounded-lg cursor-pointer hover:bg-gray-200 ${selected === size ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => handleTamanioChange(size)}>
                      <Image
                        src={animalType === "DOG" ? `/images/dog-${size.toLowerCase()}.png` : `/images/cat-${size.toLowerCase()}.png`}
                        width={80}
                        height={80}
                        alt={`${animalType === "DOG" ? "Perro" : "Gato"} ${size.toLowerCase()}`}
                      />
                    </div>
                    <p className="mt-4 text-center text-black">{size === 'SMALL' ? 'Pequeño' : size === 'MEDIUM' ? 'Mediano' : 'Grande'}</p>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {errors.sizeType && <p className='text-red-500 mt-2 text-xs'>{errors.sizeType}</p>}
          </div>
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
      </div>
    </div>

    <div className='flex justify-between mt-8 w-full'>
      <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={prevStep}>
        Atrás
      </button>
      <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={handleNextStep}>
        Siguiente
      </button>
    </div>
  </div>
);
}

export default Step2;
