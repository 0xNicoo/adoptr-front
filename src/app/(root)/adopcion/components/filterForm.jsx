'use client'

import { getAdoption } from '../actions';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const FilterForm = ({updateData}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        const filteredList = await getAdoption(data)
        updateData(filteredList)
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


                        <button
                            type="submit"
                            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto"
                        >
                            Filtrar
                        </button>
                    </div>
                </div>
            </form>
        )}
    </div>
    );
};

export default FilterForm;
