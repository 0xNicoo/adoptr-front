import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'; // Importa useRouter para manejar la redirección
import { Checkbox, Button, Select, SelectItem } from '@nextui-org/react';
import { getAdoptionsAction } from '@/actions/adoption';
import { getLocalitiesAction, getProvinceAction } from '@/actions/location';

const FilterForm = ({ updateData, updateTotalPage, updateCurrentPage, updateFilters, initialFilters }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { register, handleSubmit, setValue, reset, watch } = useForm(); // Agrega watch para observar los cambios
    const router = useRouter(); // Inicializa useRouter para redireccionar

    const [provinces, setProvinces] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [loadingServiceTypes, setLoadingServiceTypes] = useState(true);
    const [loadingLocalities, setLoadingLocalities] = useState(false);

    const selectedProvince = watch('province_id');

    // Guarda el estado de los checkboxes
    const [filters, setFilters] = useState({
        vaccinated: initialFilters.vaccinated || false,
        unprotected: initialFilters.unprotected || false,
        castrated: initialFilters.castrated || false
    });
    useEffect(() => {
        // Sincroniza el estado inicial de los filtros con react-hook-form
        Object.entries(initialFilters).forEach(([key, value]) => {
            setValue(key, value);
        });
    }, [initialFilters, setValue]);
    useEffect(() => {
        // Sincroniza el estado de los checkboxes con react-hook-form
        setValue('vaccinated', filters.vaccinated);
        setValue('unprotected', filters.unprotected);
        setValue('castrated', filters.castrated);
    }, [filters, setValue]);
    // Actualiza el estado de los checkboxes
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: checked
        }));
    };

    // Cargar provincias al montar el componente
    useEffect(() => {
        async function fetchProvinces() {
            try {
                const provincesData = await getProvinceAction();
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
                    const localitiesData = await getLocalitiesAction(provinceId);
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

    const onSubmit = async (filter) => {
        // Agrega los valores de los checkboxes al filtro
        const combinedFilter = { ...filter, ...filters };
        const cleanFilter = Object.fromEntries(
            Object.entries(combinedFilter).filter(([_, value]) => value)
        );
        updateFilters(cleanFilter);
        const { total, data } = await getAdoptionsAction(cleanFilter, 1);
        updateTotalPage(total);
        updateData(data);
        updateCurrentPage(1);
    };
    const handleClearFilters = async () => {
        reset();
        setFilters({
            vaccinated: false,
            unprotected: false,
            castrated: false
        });
    
        updateFilters({});
        
        const { total, data } = await getAdoptionsAction({}, 1);
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
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Título
                                </label>
                            </div>

                            <div className="relative z-0 w-full md:w-1/4">
                                <select
                                    id="animalType"
                                    {...register('animalType')}
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                >
                                    <option value="">Seleccione un tipo</option>
                                    <option value="CAT">Gato</option>
                                    <option value="DOG">Perro</option>
                                </select>
                                <label
                                    htmlFor="type"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Tipo
                                </label>
                            </div>

                            <div className="relative z-0 w-full md:w-1/4">
                                <select
                                    id="sizeType"
                                    {...register('sizeType')}
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                >
                                    <option value="">Seleccione un tamaño</option>
                                    <option value="SMALL">Pequeño</option>
                                    <option value="MEDIUM">Mediano</option>
                                    <option value="BIG">Grande</option>
                                </select>
                                <label
                                    htmlFor="sizeType"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Tamaño
                                </label>
                            </div>

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
                        <div className='flex mt-8 gap-8'>
                                <Checkbox
                                    name="vaccinated"
                                    isSelected={filters.vaccinated} // Usamos isSelected para que el estado se refleje visualmente
                                    onChange={() => setFilters(prev => ({ ...prev, vaccinated: !prev.vaccinated }))}
                                >
                                    Vacunado
                                </Checkbox>
                                <Checkbox
                                    name="unprotected"
                                    isSelected={filters.unprotected} // Usamos isSelected para que el estado se refleje visualmente
                                    onChange={() => setFilters(prev => ({ ...prev, unprotected: !prev.unprotected }))}
                                >
                                    Desparasitado
                                </Checkbox>
                                <Checkbox
                                    name="castrated"
                                    isSelected={filters.castrated} // Usamos isSelected para que el estado se refleje visualmente
                                    onChange={() => setFilters(prev => ({ ...prev, castrated: !prev.castrated }))}
                                >
                                    Castrado
                                </Checkbox>
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

                    </div>
                </form>
            )}
        </div>
    );
};
export default FilterForm;