"use client";
import React, { useEffect, useState } from 'react';
import { useFormStoreServicio } from '@/app/store';
import { Input, Select, SelectItem } from '@nextui-org/react';
import { Inter } from "next/font/google";
import { getLocalitiesAction, getProvinceAction } from '@/actions/location';
import { getServiceTypesAction } from '@/actions/service';

const inter = Inter({ subsets: ["latin"] });

const Step1 = ({nextStep}) => {

  const { title, locality, province, street, number, serviceType, setNombre, setLocality, setProvince, setCalle, setNumero, setServiceType } = useFormStoreServicio();
  const [errors, setErrors] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingLocalities, setLoadingLocalities] = useState(false);
  const [loadingSetServiceType, setLoadingServiceTypes] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState('');
 
  
  const handleNextStep = () => {
    let newErrors = {}
    const fields = {
      title,
      province,
      locality,
      serviceType,
      street,
      number,
    };
    
    Object.entries(fields).forEach(([key, value]) => {
      if (!value) {
        newErrors[key] = '* Este campo es obligatorio';
      }
       else if (key === "number" && isNaN(Number(value))) {
        newErrors[key] = '* El número debe ser un valor numérico';
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

  useEffect(() => {
    async function fetchServiceTypes() {
      try {
        const serviceTypeData = await getServiceTypesAction();
        setServiceTypes(serviceTypeData || []);
        setLoadingServiceTypes(false);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setError('Error al cargar las provincias');
        setLoadingServiceTypes(false);
      }
    }
    fetchServiceTypes();
  }, []);

  return (
    <div className='flex flex-grow flex-col mb-4 xs:ml-4 sm:ml-12'>
      <div className='flex xs:flex-col md:flex-row xs:gap-4 md:gap-12'>
        <div className='flex flex-col xs:w-5/6 md:w-1/6'>
          <label htmlFor="nombre" className="block xs:text-sm md:text-md 2xl:text-xl font-medium">Nombre</label>
          <div className="flex mt-2 gap-4">
            <Input isRequired aria-label="Seleccionar nombre" value={title} onChange={e => setNombre(e.target.value)} id="nombre" name="nombre" type="text" placeholder="Juan"/>
          </div>
          {errors.title && <p className='text-red-500 mt-2 text-xs'>{errors.title}</p>}
        </div>

        <div className='flex flex-col xs:w-5/6 md:w-1/6'>
          <label htmlFor="serviceType" className='xs:text-sm block md:text-md 2xl:text-xl font-medium'>Tipo de servicio</label>
          <div className='flex mt-2 gap-4 md:w-1/6'>
            {loadingSetServiceType ? (
               <Select aria-label='Cargando' placeholder='Cargando...' className="w-full min-w-[12rem]" isLoading></Select>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <Select className="w-full min-w-[12rem]"
              placeholder='Seleccionar'
              isRequired
              aria-label="Seleccionar un tipo de servicio"
              value={serviceType}
              onChange={e => {
                const selectedServ = serviceTypes.find(serv => serv.id == e.target.value);
                setServiceType(selectedServ);  
              }}
            >
              {serviceTypes.map((serv) => (
                <SelectItem key={serv.id} value={serv.id}>
                  {serv.name}
                </SelectItem>
              ))}
            </Select>
            )}
          </div>
          {errors.serviceType && <p className='text-red-500 mt-2 text-xs'>{errors.serviceType}</p>}
        </div>
    </div>

    <div className='flex flex-col xs:mt-4 sm:mt-8'>
      <div className='flex xs:flex-col md:flex-row xs:gap-4 md:gap-12'>
        <div className='flex flex-col xs:w-5/6 md:w-1/6'>
        <label htmlFor="provincia" className='xs:text-sm block md:text-md 2xl:text-xl font-medium'>Provincia</label>
          <div className='flex flex-col mt-2 xs:gap-2 sm:gap-4 xs:w-5/6 md:w-1/6'>
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
        <div className='flex flex-col xs:w-5/6 md:w-1/6'>
          <label htmlFor="localidad" className='xs:text-sm block md:text-md 2xl:text-xl font-medium'>Localidad</label>
          <div className='flex mt-2 xs:gap-2 sm:gap-4 xs:w-5/6 md:w-1/6'>
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

    <div className='flex xs:flex-col md:flex-row xs:gap-4 md:gap-12 xs:mt-4 sm:mt-8'>
        <div className='flex flex-col xs:w-5/6 md:w-1/6'>
          <label htmlFor="calle" className="xs:text-sm block md:text-md 2xl:text-xl font-medium">Calle</label>
          <div className="flex mt-2 xs:gap-2 sm:gap-4">
            <Input isRequired aria-label="Seleccionar calle" value={street} onChange={e => setCalle(e.target.value)} id="calle" name="calle" type="text" placeholder="Av.Corrientes"/>
          </div>
          {errors.street && <p className='text-red-500 mt-2 text-xs'>{errors.street}</p>}
        </div>

        <div className='flex flex-col xs:w-5/6 md:w-1/6'>
          <label htmlFor="numero" className="xs:text-sm block md:text-md 2xl:text-xl font-medium">Número</label>
          <div className="flex mt-2 xs:gap-2 sm:gap-4">
            <Input isRequired aria-label="Seleccionar número" value={number} onChange={e => setNumero(e.target.value)} id="numero" name="numero" type="text" placeholder="3247"/>
          </div>
          {errors.number && <p className='text-red-500 mt-2 text-xs'>{errors.number}</p>}
        </div>
    </div>
  </div>

    <div className="flex flex-row justify-between mt-4 items-end mr-4 xs:mt-4 sm:mt-8">
        <button className="bg-primary-orange xs:text-sm md:text-md hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={handleNextStep}>Siguiente</button>
    </div>
  </div>
  );
}

export default Step1;