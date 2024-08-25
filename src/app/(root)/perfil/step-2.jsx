"use client";
import React, { useEffect, useState } from 'react';
import { useFormStorePerfil } from '../../store';
import { Select, SelectItem, Input } from '@nextui-org/react';
import { Inter } from "next/font/google";
import { getProvince, getLocality } from './actions';

const inter = Inter({ subsets: ["latin"] });

const Step2 = ({ nextStep, prevStep }) => {
  const [errors, setErrors] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingLocalities, setLoadingLocalities] = useState(false);
  const [error, setError] = useState(null);

  const { firstName, lastName, genderType, locality, province, setFirstName, setLastName, setGenderType, setLocality, setProvince } = useFormStorePerfil();

  const generoPersonas = [
    { label: 'Masculino', 
      key: 'MALE'},
    {
      label: 'Femenino',
      key: 'FEMALE'},
  ];

  const handleGenderChange = (value) => {
    setGenderType(value);  
  };

  const handleNextStep = () => {
    let newErrors = {};
    if (!firstName) {
      newErrors.firstName = '* Este campo es obligatorio';
    }
    if (!lastName) {
      newErrors.lastName = '* Este campo es obligatorio';
    }
    if (!genderType) {
      newErrors.genderType = '* Este campo es obligatorio';
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
        <div className='flex flex-col'>
          <label htmlFor="nombre" className="block xl:text-md 2xl:text-xl font-medium">Nombre</label>
          <div className="flex mt-2 gap-4">
            <Input isRequired aria-label="Seleccionar nombre" value={firstName} onChange={e => setFirstName(e.target.value)} id="nombre" name="nombre" type="text" placeholder="Juan" />
          </div>
          {errors.firstName && <p className='text-red-500 mt-2 text-xs'>{errors.firstName}</p>}
        </div>
        <div className='flex flex-col'>
          <label htmlFor="apellido" className='block xl:text-md 2xl:text-xl font-medium'>Apellido</label>
          <div className="flex mt-2 gap-4">
            <Input isRequired aria-label="Seleccionar apellido" value={lastName} onChange={e => setLastName(e.target.value)} id="apellido" name="apellido" type="text" placeholder="Perez" />
          </div>
          {errors.lastName && <p className='text-red-500 mt-2 text-xs'>{errors.lastName}</p>}
        </div>
        <div className='flex flex-col'>
          <label htmlFor="genero" className='block xl:text-md 2xl:text-xl font-medium'>Género</label>
          <div className="flex mt-2 gap-4">
            <Select isRequired placeholder='Seleccionar' aria-label="Seleccionar género"
            className= "w-full min-w-[10rem]"
            selectedKeys={genderType ? [genderType] : []}  
            onSelectionChange={(keys) => handleGenderChange(keys.values().next().value)}
            >
              {generoPersonas.map((generoPersona) => (
                <SelectItem key={generoPersona.key} value={generoPersona.key}>
                  {generoPersona.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          {errors.genderType && <p className='text-red-500 mt-2 text-xs'>{errors.genderType}</p>}
        </div>
      </div>
      <div className='flex flex-row gap-12 mt-10'>
        <div className='flex flex-col'>
          <label htmlFor="provincia" className='block xl:text-md 2xl:text-xl font-medium'>Provincia</label>
          <div className='flex mt-2 gap-4'>
            {loadingProvinces ? (
              <p>Cargando provincias...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <Select className= "w-full min-w-[10rem]"
                placeholder='Seleccionar'
                isRequired
                aria-label="Seleccionar provincia"
                value={province}
                onChange={e => {
                  setProvince(e.target.value);
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
        <div className='flex flex-col'>
          <label htmlFor="localidad" className='block xl:text-md 2xl:text-xl font-medium'>Localidad</label>
          <div className='flex mt-2 gap-4'>
            {loadingLocalities ? (
              <p>Cargando localidades...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <Select className= "w-full min-w-[10rem]"
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
      <div className="flex flex-row justify-end xl:mb-4 xl:mx-4 2xl:mb-8 2xl:mx-8">
        <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={handleNextStep}>
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Step2;
