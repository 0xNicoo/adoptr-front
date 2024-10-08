import { Select, SelectItem } from '@nextui-org/react';
import { useFormContext, Controller } from 'react-hook-form';

const ServiceTypeSelector = ({ actualServiceType, actualServiceTypeId, serviceTypes }) => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className='flex flex-col w-2/3 mt-6'>
      <label htmlFor="serviceType" className="block text-xl font-semibold mb-2">Tipo de Servicio</label>
      <Controller
        name="serviceType"
        control={control}
        defaultValue={actualServiceTypeId}
        render={({ field }) => (
          <Select
            {...field}
            aria-label="Seleccionar un tipo de servicio"
            placeholder={actualServiceType}
            className="w-full min-w-[12rem]"
            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
          >
            {serviceTypes && serviceTypes.length > 0 ? (
              serviceTypes.map((serv) => (
                <SelectItem key={serv.id} value={serv.id}>
                  {serv.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>
                No hay tipos de servicio disponibles
              </SelectItem>
            )}
          </Select>
        )}
      />
      {errors.serviceType && <p className='text-red-500 mt-2 text-sm'>{errors.serviceType.message}</p>}
    </div>
  );
};

export default ServiceTypeSelector;

