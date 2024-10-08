import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@nextui-org/react';

const Number = ({actualNumber}) => {
    const { control, formState: { errors } } = useFormContext();

    return (
        <div className='flex flex-col w-2/3 mt-4'>
            <label htmlFor="nombre" className="block text-xl font-semibold mb-2">Número</label>
            <Controller
                name="number" 
                control={control}
                defaultValue={actualNumber}
                rules={{ required: 'Este campo es requerido' }} 
                render={({ field }) => (
                    <Input
                        {...field}
                        aria-label="Seleccionar nombre"
                        //type="integer"
                        placeholder="Numero"
                        className='w-full'
                    />
                )}
            />
            {errors.title && <p className='text-red-500 mt-2 text-sm'>{errors.title.message}</p>}
        </div>
    );
};

export default Number;
