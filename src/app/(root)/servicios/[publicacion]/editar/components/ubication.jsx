'use client'

import { useFormContext, Controller } from 'react-hook-form';
import { Select, SelectItem } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { getLocalitiesAction, getProvinceAction } from '@/actions/location';

const Ubication = ({ actualLocality, actualLocalityId, actualProvince }) => {
    const { formState: { errors }, control } = useFormContext();
    const [provinces, setProvinces] = useState([]);
    const [province, setProvince] = useState("");
    const [loadingLocalities, setLoadingLocalities] = useState(false);
    const [loadingProvinces, setLoadingProvinces] = useState(true);
    const [localities, setLocalities] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const provincesData = await getProvinceAction();
                setProvinces(provincesData || []);
                setLoadingProvinces(false);
            } catch (error) {
                console.error("Error fetching provinces:", error);
                setError('Error al cargar las provincias');
                setLoadingProvinces(false);
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        async function fetchLocalities() {
            if (province) {
                setLoadingLocalities(true);
                try {
                    const localitiesData = await getLocalitiesAction(province);
                    setLocalities(localitiesData || []);
                    setLoadingLocalities(false);
                } catch (error) {
                    console.error("Error al cargar localidades:", error);
                    setError('Error al cargar las localidades');
                    setLoadingLocalities(false);
                }
            } else {
                setLocalities([]);
            }
        }

        fetchLocalities();
    }, [province]);

    return (
        <div className='flex flex-col mt-8'>
            <label className="block text-xl font-semibold mb-2">Ubicación</label>
            <div className='flex flex-row gap-8'>
                <div className='flex flex-col w-1/2'>
                    <label htmlFor="provincia" className='block text-sm font-medium mb-1'>Provincia</label>
                    <div className='flex flex-col mt-2'>
                        {loadingProvinces ? (
                            <Select aria-label='Cargando' placeholder='Cargando...' className="w-full" isLoading></Select>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <Select
                                className="w-full"
                                placeholder={actualProvince}
                                aria-label="Seleccionar provincia"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                            >
                                {provinces.map((prov) => (
                                    <SelectItem key={prov.id} value={prov.id}>
                                        {prov.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        )}
                    </div>
                    {errors.province && <p className='text-red-500 mt-2 text-xs'>{errors.province.message}</p>}
                </div>
                <div className='flex flex-col w-1/2'>
                    <label htmlFor="localidad" className='block text-sm font-medium mb-1'>Localidad</label>
                    <div className='flex flex-col mt-2'>
                        {loadingLocalities ? (
                            <Select aria-label='Cargando' placeholder='Cargando...' className="w-full" isLoading></Select>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <Controller
                                name="locality_id"
                                control={control}
                                defaultValue={actualLocalityId}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        className="w-full"
                                        placeholder={actualLocality}
                                        aria-label="Seleccionar localidad"
                                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                    >
                                        {localities.map((loc) => (
                                            <SelectItem key={loc.id} value={loc.id}>
                                                {loc.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        )}
                    </div>
                    {errors.locality && <p className='text-red-500 mt-2 text-xs'>{errors.locality.message}</p>}
                </div>
            </div>
        </div>
    );
};

export default Ubication;
