"use client"
import React, { useEffect, useState } from 'react';
import { handleGetProfile, handleGetAdoptions } from './actions';
import { Textarea, Tabs, Tab, Card, CardBody, CardHeader, Image } from '@nextui-org/react';
import { CIcon } from '@coreui/icons-react';
import { cilLocationPin } from '@coreui/icons';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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

const miPerfil = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adoptions, setAdoptions] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await handleGetProfile();
                setProfile(profileData);
                console.log(profileData);
                const adoptionsData = await handleGetAdoptions();
                const filteredAdoptions = adoptionsData.filter(adoption => adoption.user.id === profileData.user.id);
                setAdoptions(filteredAdoptions);
                console.log(adoptionsData);
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
        <div className='flex flex-row justify-center'>
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
            <div className="flex w-full flex-col mt-2 mr-10">
                <Tabs aria-label="Options">
                    <Tab key="novedades" title="Novedades">
                        <Card>
                            <CardBody>
                            <p>No se encontraron novedades</p>
                            </CardBody>
                        </Card>  
                    </Tab>
                    <Tab key="publicaciones" title="Publicaciones de mascotas">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {adoptions.length > 0 ? (
                                    adoptions.map((adoption) => (
                                        <div key={adoption.id}>
                                            <Card className="py-4 items-center justify-content mb-2">
                                                <CardBody className="overflow-visible py-2">
                                                    <Image
                                                    alt="Animal en adopción"
                                                    className="object-cover rounded-xl"
                                                    src={adoption.s3Url}
                                                    width={270}
                                                    height={300}
                                                    />
                                                </CardBody>
                                                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                                    <p className={`${inter.className} text-xs uppercase font-bold`}>{mapSexType(adoption.sexType)}</p>
                                                    <small className={`${inter.className} xl:text-default-500`}>{adoption.ageYears} años {adoption.ageMonths} meses</small>
                                                    <h4 className={`${inter.className} text-lg`}>{adoption.title}</h4>
                                                </CardHeader>
                                                <a href={`/adopcion/${adoption.id}`} className={`${inter.className} text-primary-blue text-sm hover:text-blue-hover`}>Ver más</a>
                                            </Card>
                                        </div>
                                    ))
                                ) : (
                                    <p>No se encontraron publicaciones de mascotas</p>
                                )} 
                        </div>
                    </Tab>
                    <Tab key="servicios" title="Servicios">
                        <Card>
                            <CardBody>
                                <p>No se encontraron servicios</p>
                            </CardBody>
                        </Card>  
                    </Tab>
                </Tabs>
            </div>  
        </div>
    );
};

export default miPerfil;