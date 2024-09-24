import { getService, getServiceType, getProvince, getLocality } from '../actions'; // Asegúrate de tener estas funciones
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button, Select, SelectItem } from '@nextui-org/react';

const FilterForm = ({ updateData, updateTotalPage, updateCurrentPage, updateFilters, initialFilters }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { register, handleSubmit, setValue, reset, watch } = useForm(); 
    const router = useRouter(); 

    // Estados para los tipos de servicio, provincias, localidades, y estado de carga
    const [provinces, setProvinces] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [loadingLocalities, setLoadingLocalities] = useState(false);
    const [error, setError] = useState(null);

    const selectedProvince = watch('province_id'); // Escuchar cambios en la provincia seleccionada

    // Cargar provincias al montar el componente
    useEffect(() => {
        async function fetchProvinces() {
            try {
                const provincesData = await getProvince();
                setProvinces(provincesData || []);
            } catch (error) {
                console.error("Error fetching provinces:", error);
                setError('Error al cargar las provincias');
            }
        }
        fetchProvinces();
    }, []);

    // Cargar localidades cuando cambia la provincia seleccionada
    useEffect(() => {
        async function fetchLocalities(provinceId) {
            if (provinceId) {
                setLoadingLocalities(true);
                try {
                    const localitiesData = await getLocality(provinceId);
                    setLocalities(localitiesData || []);
                } catch (error) {
                    console.error("Error fetching localities:", error);
                    setError('Error al cargar las localidades');
                } finally {
                    setLoadingLocalities(false);
                }
            } else {
                setLocalities([]); // Limpiar localidades si no hay provincia seleccionada
            }
        }

        fetchLocalities(selectedProvince);
    }, [selectedProvince]);

    // Sincronizar filtros iniciales
    useEffect(() => {
        Object.entries(initialFilters).forEach(([key, value]) => {
            setValue(key, value);
        });
    }, [initialFilters, setValue]);

    // Manejo del envío del formulario
    const onSubmit = async (filter) => {
        updateFilters(filter);
        const { total, data } = await getService(filter, 1);
        updateTotalPage(total);
        updateData(data);
        updateCurrentPage(1);
    };

    // Limpieza de filtros
    const handleClearFilters = async () => {
        const currentFilters = watch(); // Obtiene los filtros actuales

        // Mantener solo el serviceType_id
        const filtersToReset = { 
            title: '', 
            province_id: '', 
            locality_id: '' 
        };

        reset(filtersToReset); // Resetea los filtros

        // Actualiza los filtros manteniendo serviceType_id
        const updatedFilters = { ...currentFilters, ...filtersToReset };
        updateFilters(updatedFilters); 

        const { total, data } = await getService(updatedFilters, 1); 
        updateTotalPage(total);
        updateData(data);
        updateCurrentPage(1);
    };

    return (
        <div className="w-full">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="py-2 px-4 bg-primary-orange text-white mb-4 ml-4 mt-4"
            >
                {isOpen ? 'Ocultar filtro' : 'Mostrar filtro'}
            </Button>

            {isOpen && (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md w-full">
                    <div className="flex flex-col">
                        <div className="flex flex-item-center gap-4">

                            {/* Filtro por título */}
                            <div className="relative z-0 w-full md:w-1/4">
                                <input
                                    type="text"
                                    id="title"
                                    {...register('title')}
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="title"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0"
                                >
                                    Título
                                </label>
                            </div>
                    
                        </div>

                        <div className="flex flex-item-center gap-4 mt-8">
                            {/* Filtro por provincia */}
                            <div className="relative z-0 w-full md:w-1/4">
                                <Select 
                                    className="w-full min-w-[12rem]"
                                    placeholder='Seleccionar provincia'
                                    {...register('province_id')}
                                >
                                    {provinces.map((prov) => (
                                        <SelectItem key={prov.id} value={prov.id}>
                                            {prov.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            {/* Filtro por localidad */}
                            <div className="relative z-0 w-full md:w-1/4">
                                <Select 
                                    className="w-full min-w-[12rem]"
                                    placeholder='Seleccionar localidad'
                                    {...register('locality_id')}
                                    isDisabled={!selectedProvince || loadingLocalities} // Deshabilitar si no hay provincia seleccionada
                                >
                                    {localities.map((loc) => (
                                        <SelectItem key={loc.id} value={loc.id}>
                                            {loc.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                        </div>
                        <div className="flex justify-end gap-4 mt-4">
                            <Button
                                type="submit" className='bg-primary-blue text-white'
                            >
                                Filtrar
                            </Button>
                            <Button
                                type="button" className='bg-red-700 text-white'
                                onClick={() => handleClearFilters()}  
                            >
                                Limpiar filtro
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default FilterForm;
