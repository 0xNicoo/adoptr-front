'use client'

import { useFormContext, Controller } from 'react-hook-form';
import { Select, SelectItem } from '@nextui-org/react';

const AgeSelect = ({ actualYears, actualMonths }) => {
    const { control, formState: { errors } } = useFormContext();

    const years = Array.from({ length: 21 }, (_, i) => i);
    const months = Array.from({ length: 13 }, (_, i) => i);

    return (
        <div className='flex flex-col mt-4'>
            <label htmlFor="age" className="block text-lg font-medium mb-2">Edad</label>
            <div className='flex flex-row gap-6'>
                <div className='flex flex-col w-1/2'>
                    <label htmlFor="ageYears" className="block text-sm font-medium mb-1">Años</label>
                    <Controller
                        name="ageYears"
                        control={control}
                        defaultValue={actualYears}
                        rules={{ required: 'Seleccionar años es requerido' }}
                        render={({ field }) => (
                            <Select
                                {...field} 
                                aria-label="Seleccionar años"
                                placeholder={`${actualYears} ${actualYears === 1 ? 'año' : 'años'}`}
                                className="w-full"
                            >
                                {years.map(year => (
                                    <SelectItem 
                                        key={year} 
                                        value={String(year)} 
                                        textValue={`${year} ${year === 1 ? 'año' : 'años'}`}
                                    >
                                        {year} {year === 1 ? 'año' : 'años'}
                                    </SelectItem>
                                ))}
                            </Select>
                        )}
                    />
                    {errors.ageYears && <p className='text-red-500 mt-2 text-xs'>{errors.ageYears.message}</p>}
                </div>

                <div className='flex flex-col w-1/2'>
                    <label htmlFor="ageMonths" className="block text-sm font-medium mb-1">Meses</label> 
                    <Controller
                        name="ageMonths"
                        control={control}
                        defaultValue={actualMonths}
                        rules={{ required: 'Seleccionar meses es requerido' }}
                        render={({ field }) => (
                            <Select
                                {...field} 
                                aria-label="Seleccionar meses"
                                className="w-full"
                                placeholder={`${actualMonths} ${actualMonths === 1 ? 'mes' : 'meses'}`}
                            >
                                {months.map(month => (
                                    <SelectItem 
                                        key={month} 
                                        value={month}
                                        textValue={`${month} ${month === 1 ? 'mes' : 'meses'}`}
                                    >
                                        {month} {month === 1 ? 'mes' : 'meses'}
                                    </SelectItem>
                                ))}
                            </Select>
                        )}
                    />
                    {errors.ageMonths && <p className='text-red-500 mt-2 text-xs'>{errors.ageMonths.message}</p>}
                </div>
            </div>
        </div>
    );
};

export default AgeSelect;
