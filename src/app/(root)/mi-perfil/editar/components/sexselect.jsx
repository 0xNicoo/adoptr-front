import { useFormContext, Controller } from 'react-hook-form';
import { Select, SelectItem } from '@nextui-org/react';

const mapSexType = (genderType) => {
    switch (genderType) {
      case 'MALE':
        return 'Masculino';
      case 'FEMALE':
        return 'Femenino';
      default:
        return 'Indefinido'; 
    }
};

const sexOptions = [
    {label: "Masculino", value: "MALE"},
    {label: "Femenino", value: "FEMALE"}
];

const SexSelect = ({actualGender}) => {
    const { control, formState: { errors } } = useFormContext();

    return (
        <div className='flex flex-col w-1/6 mt-4'>
            <label htmlFor="gender" className="block xl:text-md 2xl:text-xl font-medium">Sexo</label>
            <div className="flex mt-2 gap-4">
                <Controller
                    name="genderType" 
                    control={control}
                    defaultValue={actualGender}
                    rules={{ required: 'Seleccionar un sexo es requerido' }} 
                    render={({ field }) => (
                        <Select
                            {...field} 
                            aria-label="Seleccionar sexo"
                            placeholder={mapSexType(actualGender)}
                            className="w-full min-w-[12rem]"
                            items={sexOptions}
                        >
                            {
                                (sexOption) => <SelectItem key={sexOption.value} value={sexOption.value}>
                                    {sexOption.label}
                                </SelectItem>
                            }
                        </Select>
                    )}
                />
            </div>
            {errors.gender && <p className='text-red-500 mt-2 text-xs'>{errors.gender.message}</p>}
        </div>
    );
};

export default SexSelect;
