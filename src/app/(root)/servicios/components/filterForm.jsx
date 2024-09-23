import { getService } from '../actions';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';

const FilterForm = ({ updateData, updateTotalPage, updateCurrentPage, updateFilters, initialFilters }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { register, handleSubmit, setValue, reset } = useForm(); 
    const router = useRouter(); 

    useEffect(() => {
        // Sincroniza el estado inicial de los filtros con react-hook-form
        Object.entries(initialFilters).forEach(([key, value]) => {
            setValue(key, value);
        });
    }, [initialFilters, setValue]);

    const onSubmit = async (filter) => {
        updateFilters(filter);
        const { total, data } = await getService(filter, 1);
        updateTotalPage(total);
        updateData(data);
        updateCurrentPage(1);
    };

    const handleClearFilters = async () => {
        reset(); 
        updateFilters({}); 

        const { total, data } = await getService({}, 1); 
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

                            <Button
                                type="submit" className='bg-primary-blue text-white'
                            >
                                Filtrar
                            </Button>
                            <Button
                                type="button" className='bg-red-700 text-white'
                                onClick={handleClearFilters}  
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
