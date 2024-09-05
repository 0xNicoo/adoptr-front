import { getAdoption } from '../actions';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'; // Importa useRouter para manejar la redirección
import { Checkbox } from '@nextui-org/react';

const FilterForm = ({ updateData, updateTotalPage, updateCurrentPage, updateFilters, initialFilters }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { register, handleSubmit, setValue, reset } = useForm(); // Agrega watch para observar los cambios
    const router = useRouter(); // Inicializa useRouter para redireccionar

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

    const onSubmit = async (filter) => {
        // Agrega los valores de los checkboxes al filtro
        const combinedFilter = { ...filter, ...filters };

        const cleanFilter = Object.fromEntries(
            Object.entries(combinedFilter).filter(([_, value]) => value)
        );

        updateFilters(cleanFilter);
        const { total, data } = await getAdoption(cleanFilter, 1);
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
        
        const { total, data } = await getAdoption({}, 1);
        updateTotalPage(total);
        updateData(data);
        updateCurrentPage(1);
    };

    return (
        <div className="w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
            >
                {isOpen ? 'Ocultar Filtro' : 'Mostrar Filtro'}
            </button>

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

                            <button
                                type="submit"
                                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto"
                            >
                                Filtrar
                            </button>
                            <button
                                type="button"  
                                onClick={() => handleClearFilters()}  
                                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto"
                            >
                                Limpiar filtro
                            </button>

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
                    </div>
                </form>
            )}
        </div>
    );
};

export default FilterForm;

