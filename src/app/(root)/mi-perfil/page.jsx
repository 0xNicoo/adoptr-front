"use client"
import React, { useEffect, useState } from 'react';
import { handleGetProfile } from './actions';
import { Textarea } from '@nextui-org/react';
import { CIcon } from '@coreui/icons-react';
import { cilLocationPin } from '@coreui/icons';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const miPerfil = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await handleGetProfile();
                setProfile(profileData);
            } catch (err) {
                setError('Error al obtener el perfil');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='relative flex items-start justify-center bg-white rounded-b-xl drop-shadow-lg w-1/3 mx-4 mb-4'>
            <div className='absolute top-0 flex items-center w-3/4 h-1/3 bg-primary-orange z-0 rounded-b-[30px]'></div>
            {profile ? (
                <div className='relative flex flex-col gap-2 items-center justify-center mt-2 mb-2'>
                    <img src={profile.s3Url} alt="foto" className='rounded-full xl:w-40 2xl:w-42 hover:scale-105 hover:shadow-xl'/>
                    <h1 className={`${inter.className} text-2xl text-primary-blue xl:text-xl 2xl:text-2xl`}>{profile.firstName} {profile.lastName}</h1>
                    <div className='flex items-center justify-center'>
                        <CIcon icon={cilLocationPin} className='mr-0.5 xl:w-5 xl:h-5 2xl:w-8 2xl:w-18 text-gray-500'/>
                        <p className={`${inter.className} text-gray-600 xl:text-md 2xl:text-lg`}>{profile.locality.name}, {profile.locality.province.name}</p>
                    </div>
                    <Textarea
                isReadOnly
                defaultValue={profile.description}
                className="max-w-xs"
                />
                </div>
            ) : (
                <p>No se encontró el perfil</p>
            )}
        </div>
    );
};

export default miPerfil;