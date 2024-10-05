import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@nextui-org/react';

const TitleInput = ({actualTitle}) => {
    const { control, formState: { errors } } = useFormContext();

    return (
        <div className='flex flex-col w-2/3 mt-4'>
            <label htmlFor="nombre" className="block text-xl font-semibold mb-2">Título</label>
            <Controller
                name="title" 
                control={control}
                defaultValue={actualTitle}
                rules={{ required: 'Este campo es requerido' }} 
                render={({ field }) => (
                    <Input
                        {...field}
                        aria-label="Seleccionar nombre"
                        id="nombre"
                        type="text"
                        placeholder="Título"
                        className='w-full'
                    />
                )}
            />
            {errors.title && <p className='text-red-500 mt-2 text-sm'>{errors.title.message}</p>}
        </div>
    );
};

export default TitleInput;
