"use client"
import React, { useEffect, useState } from 'react';
import { handleGetProfile, handleGetAdoptions } from './actions';
import { Textarea, Tabs, Tab, Card, CardBody, CardHeader, Image } from '@nextui-org/react';
import { CIcon } from '@coreui/icons-react';
import { cilLocationPin } from '@coreui/icons';
import { Inter } from "next/font/google";
import { deleteAdoptionAction, getUserId } from './actions';

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
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
          setUserId(await getUserId())
        }
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
        fetchUserId()
        fetchProfile();
    }, []);

    //TODO(nico): cuando se ejecuta, poner un loading en el boton de eliminar
    const handleDelete = async (id) => {
      await deleteAdoptionAction(id)
      const updatedAdoptions = adoptions.filter(adoption => adoption.id !== id);
      setAdoptions(updatedAdoptions);
    };

    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p>{error}</p>;

    return (
      <div className="flex flex-col lg:flex-row justify-center">
      <div className="w-full lg:w-1/3 mb-8 lg:mb-0 lg:mr-8">
        <div className="relative bg-white rounded-b-xl shadow-lg overflow-hidden">
          <div className="absolute mx-10 top-0 left-0 right-0 h-1/3 bg-primary-orange rounded-b-[30px]"></div>
          {profile ? (
            <div className="relative flex flex-col items-center pt-8 pb-4">
              <div className="w-32 h-32 lg:w-40 lg:h-40 relative mb-4">
                <img 
                  src={profile.s3Url} 
                  alt="foto" 
                  className="w-full h-full object-cover rounded-full shadow-lg transition-transform hover:scale-105"
                />
              </div>
              <h1 className={`${inter.className} text-xl lg:text-2xl text-primary-blue mb-2`}>
                {profile.firstName} {profile.lastName}
              </h1>
              <div className="flex items-center justify-center mb-4">
                <CIcon icon={cilLocationPin} className="w-5 h-5 text-gray-500 mr-1"/>
                <p className={`${inter.className} text-sm lg:text-base text-gray-600`}>
                  {profile.locality.name}, {profile.locality.province.name}
                </p>
              </div>
              <Textarea
                isReadOnly
                defaultValue={profile.description}
                className="max-w-xs lg:max-w-sm"
              />
            </div>
          ) : (
            <p>No se encontró el perfil</p>
          )}
        </div>
      </div>
      
      <div className="mt-4 w-full lg:w-2/3 mr-4">
        <Tabs aria-label="Options">
          <Tab key="novedades" title="Novedades">
            <Card>
              <CardBody>
                <p>No se encontraron novedades</p>
              </CardBody>
            </Card>  
          </Tab>
          <Tab key="publicaciones" title="Publicaciones de mascotas">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {adoptions.length > 0 ? (
                adoptions.map((adoption) => (
                  <Card key={adoption.id} className="overflow-hidden">
                    <CardBody className="px-2">
                        <div className="rounded-lg aspect-square w-full overflow-hidden">
                            <Image
                            alt="Animal en adopción"
                            src={adoption.s3Url}
                            width="100%"
                            height="100%"
                            style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </CardBody>
                    <CardHeader className="flex-col items-start p-4">
                      <p className={`${inter.className} text-xs uppercase font-bold`}>
                        {mapSexType(adoption.sexType)}
                      </p>
                      <small className={`${inter.className} text-default-500`}>
                        {adoption.ageYears} años {adoption.ageMonths} meses
                      </small>
                      <h4 className={`${inter.className} text-lg mt-1`}>{adoption.title}</h4>
                      <div className="flex justify-between w-full items-center">
                        <div>
                            <a
                            href={`/adopcion/${adoption.id}`}
                            className={`${inter.className} text-primary-blue text-sm hover:text-blue-hover mt-2`}
                          >
                            Ver más
                          </a>
                        </div>
                        {adoption.user.id == userId ? (
                          <button
                            onClick={() => handleDelete(adoption.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded ml-4 hover:bg-red-700"
                          >
                            Eliminar
                          </button>
                        ) : (
                          <></>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardBody>
                    <p>No se encontraron publicaciones de mascotas</p>
                  </CardBody>
                </Card>
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