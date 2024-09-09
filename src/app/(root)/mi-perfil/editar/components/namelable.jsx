import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@nextui-org/react';

const NameLabel = ({ actualFirstName, actualLastName }) => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className='flex flex-col w-2/3 mt-4'>
      <label htmlFor="firstName" className="block text-xl font-semibold mb-2">Nombre</label>
      <Controller
        name="firstName"
        control={control}
        defaultValue={actualFirstName}
        rules={{ required: 'Este campo es requerido' }}
        render={({ field }) => (
          <Input
            {...field}
            aria-label="Nombre"
            id="firstName"
            type="text"
            placeholder={actualFirstName}
            className='w-full'
          />
        )}
      />
      {errors.firstName && <p className='text-red-500 mt-2 text-sm'>{errors.firstName.message}</p>}

      <label htmlFor="lastName" className="block text-xl font-semibold mb-2 mt-4">Apellido</label>
      <Controller
        name="lastName"
        control={control}
        defaultValue={actualLastName}
        rules={{ required: 'Este campo es requerido' }}
        render={({ field }) => (
          <Input
            {...field}
            aria-label="Apellido"
            id="lastName"
            type="text"
            placeholder={actualLastName}
            className='w-full'
          />
        )}
      />
      {errors.lastName && <p className='text-red-500 mt-2 text-sm'>{errors.lastName.message}</p>}
    </div>
  );
};

export default NameLabel;
