'use client';

import { CIcon } from '@coreui/icons-react';
import { cilImagePlus } from '@coreui/icons';
import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

const ImageSelector = ({ actualImage }) => {
    const { control, setValue } = useFormContext();
    const [imageName, setImageName] = useState('');
    const [image, setImage] = useState(actualImage);

    const imageHandler = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
            setImageName(file.name);
        }
    };

    return (
        <div className='flex flex-grow justify-between flex-col ml-12 mb-4'>
            <div className='flex flex-row mt-4'>
                <div className='flex flex-col'>
                    <div className='flex items-center'>
                        {image ? (
                            <div className="flex mb-4 items-center"> 
                                <img
                                    className='rounded-xl w-full md:w-80 lg:w-96'
                                    src={image}
                                    alt='Imagen seleccionada'
                                    width={250}
                                    height={300}
                                />
                            </div>   
                        ): (
                            <div className="flex mb-4 items-center pt-16 pb-16 px-16 bg-gray-100 rounded-xl">
                                <CIcon icon={cilImagePlus} className='xl:w-32 xl:h-32 2xl:w-40 2xl:w-40 text-gray-500'/>
                            </div>
                        ) 
                        } 
                    </div>
                    <div className="flex flex-column mt-2 justify-content items-center">
                        <Controller
                            name="image"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <input
                                        type="file"
                                        id="custom-input"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            imageHandler(e);
                                        }}
                                        hidden
                                    />
                                    <label
                                        htmlFor="custom-input"
                                        className="block xl:text-md 2xl:text-lg mr-4 py-2 px-4 rounded-xl text-sm bg-gray-100 text-black hover:bg-gray-200 cursor-pointer"
                                    >
                                        Elegir imagen
                                    </label>
                                    <label className="text-sm text-slate-500">
                                        {actualImage ? imageName : "Ningún archivo seleccionado"}
                                    </label>
                                </>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageSelector;
