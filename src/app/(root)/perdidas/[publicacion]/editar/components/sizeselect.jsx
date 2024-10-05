import { useFormContext, Controller } from 'react-hook-form';
import { Select, SelectItem } from '@nextui-org/react';

const mapSizeType = (sizeType) => {
    switch (sizeType) {
      case 'SMALL':
        return 'Pequeño';
      case 'MEDIUM':
        return 'Mediano';
      case 'BIG':
        return 'Grande';
      default:
        return 'Indefinido';
    }
  };

  const sizeOptions = [
    {label: "Pequeño", value: "MALSMALLE"},
    {label: "Mediano", value: "MEDIUM"},
    {label: "Grande", value: "BIG"}
];


const SizeSelect = ({actualSize}) => {
    const { control, formState: { errors } } = useFormContext();

    return (
        <div className='flex flex-col w-1/6 mt-4'>
            <label htmlFor="size" className="block xl:text-md 2xl:text-xl font-medium">Tamaño</label>
            <div className="flex mt-2 gap-4">
                <Controller
                    name="sizeType" 
                    control={control}
                    defaultValue={actualSize}
                    rules={{ required: 'Seleccionar un tamaño es requerido' }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            aria-label="Seleccionar tamaño"
                            placeholder={mapSizeType(actualSize)}
                            className="w-full min-w-[12rem]"
                            items={sizeOptions}
                        >
                            {
                                (sizeOption) => <SelectItem key={sizeOption.value} value={sizeOption.value}>
                                    {sizeOption.label}
                                </SelectItem>
                            }
                        </Select>
                    )}
                />
            </div>
            {errors.size && <p className='text-red-500 mt-2 text-xs'>{errors.size.message}</p>}
        </div>
    );
};

export default SizeSelect;
