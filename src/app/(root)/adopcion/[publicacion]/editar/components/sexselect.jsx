import { useFormContext, Controller } from 'react-hook-form';
import { Select, SelectItem } from '@nextui-org/react';

const mapSexType = (sexType) => {
    switch (sexType) {
      case 'MALE':
        return 'Macho';
      case 'FEMALE':
        return 'Hembra';
      default:
        return 'Indefinido'; 
    }
  };

const SexSelect = ({actualSex}) => {
    const { control, formState: { errors } } = useFormContext();

    return (
        <div className='flex flex-col w-1/6 mt-4'>
            <label htmlFor="gender" className="block xl:text-md 2xl:text-xl font-medium">Sexo</label>
            <div className="flex mt-2 gap-4">
                <Controller
                    name="sexType" 
                    control={control}
                    defaultValue={actualSex}
                    rules={{ required: 'Seleccionar un sexo es requerido' }} 
                    render={({ field }) => (
                        <Select
                            {...field} 
                            aria-label="Seleccionar sexo"
                            placeholder={mapSexType(actualSex)}
                            className="w-full min-w-[12rem]"
                        >
                            <SelectItem value="MALE">Macho</SelectItem>
                            <SelectItem value="FEMALE">Hembra</SelectItem>
                            <SelectItem value="INDETERMINATE">Indeterminado</SelectItem>
                        </Select>
                    )}
                />
            </div>
            {errors.gender && <p className='text-red-500 mt-2 text-xs'>{errors.gender.message}</p>}
        </div>
    );
};

export default SexSelect;
