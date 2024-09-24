import { useFormContext, Controller } from 'react-hook-form';
import { Textarea } from '@nextui-org/react';

const Description = ({actualDescription}) => {
    const { control, formState: { errors } } = useFormContext();

    return (
        <div className='flex flex-col mt-8'>
            <label htmlFor="description" className="block xl:text-md 2xl:text-xl font-medium">Descripción</label>
            <div className="flex mt-2">
                <Controller
                    name="description" 
                    control={control}
                    defaultValue={actualDescription}
                    rules={{ required: 'La descripción es requerida' }}
                    render={({ field }) => (
                        <Textarea
                            {...field} 
                            aria-label="Descripción"
                            placeholder="Escribe una descripción aquí"
                            rows={4} 
                            className="w-full min-w-[12rem]"
                        />
                    )}
                />
            </div>
            {errors.description && <p className='text-red-500 mt-2 text-xs'>{errors.description.message}</p>}
        </div>
    );
};

export default Description;
