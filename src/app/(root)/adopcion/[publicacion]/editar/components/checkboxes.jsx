import { useFormContext, Controller } from 'react-hook-form';
import { Checkbox } from '@nextui-org/react';

const Checkboxes = ({actualVaccinated, actualDewormed, actualCastrated}) => {
    const { control, formState: { errors } } = useFormContext();

    return (
        <div className='flex flex-row gap-6 mt-8'>
            <div className='flex items-center'>
                <Controller
                    name="vaccinated"
                    control={control}
                    defaultValue={actualVaccinated}
                    render={({ field }) => (
                        <Checkbox
                            {...field}
                            isSelected={field.value}
                            onChange={(e) => field.onChange(e.target.checked)} 
                        >
                            Vacunado
                        </Checkbox>
                    )}
                />
            </div>

            <div className='flex items-center'>
                <Controller
                    name="unprotected"
                    control={control}
                    defaultValue={actualDewormed} 
                    render={({ field }) => (
                        <Checkbox
                            {...field}
                            isSelected={field.value}
                            onChange={(e) => field.onChange(e.target.checked)} 
                        >
                            Desparacitado
                        </Checkbox>
                    )}
                />
            </div>

            <div className='flex items-center'>
                <Controller
                    name="castrated" 
                    control={control}
                    defaultValue={actualCastrated}
                    render={({ field }) => (
                        <Checkbox
                            {...field} 
                            isSelected={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                        >
                            Castrado
                        </Checkbox>
                    )}
                />
            </div>
        </div>
    );
};

export default Checkboxes;
