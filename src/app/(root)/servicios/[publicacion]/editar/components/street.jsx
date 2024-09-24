import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@nextui-org/react';

const Street = ({actualStreet}) => {
    const { control, formState: { errors } } = useFormContext();

    return (
        <div className='flex flex-col w-2/3 mt-4'>
            <label htmlFor="calle" className="block text-xl font-semibold mb-2">Calle</label>
            <Controller
                name="street" 
                control={control}
                defaultValue={actualStreet}
                rules={{ required: 'Este campo es requerido' }} 
                render={({ field }) => (
                    <Input
                        {...field}
                        aria-label="Seleccionar calle"
                        type="text"
                        placeholder="Calle"
                        className='w-full'
                    />
                )}
            />
            {errors.title && <p className='text-red-500 mt-2 text-sm'>{errors.title.message}</p>}
        </div>
    );
};

export default Street;