"use client"
import React, { useEffect, useState } from 'react';
import ProfileCard from './components/profile-card';
import MiPerfilTabs from './components/tabs';
import { useProfileEditStore } from '@/app/store';
import { useRouter } from 'next/navigation';
import { getProfileAction } from '@/actions/profile';
import { getAdoptionsAction } from '@/actions/adoption';
import { getPostsAction } from '@/actions/post';
import { getServicesAction } from '@/actions/service';
import CustomLoading from "@/app/components/customLoading";

const MiPerfil = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adoptions, setAdoptions] = useState(null);
  const [services, setServices] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const { setProfileStore } = useProfileEditStore();
  const router = useRouter();
  


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfileAction();
        setProfile(profileData);
        var { total, data } = await getAdoptionsAction();
        const filteredAdoptions = data.filter(adoption => adoption.user.id === profileData.user.id); //TODO: deberiamos crear un endpoint para obtener las adopciones del usuario
        setAdoptions(filteredAdoptions);
        const postsData = await getPostsAction(); 
        setPosts(postsData); 
        var { total, data } = await getServicesAction();
        const filteredServices = data.filter(service => service.user.id === profileData.user.id); //TODO: deberiamos crear un endpoint para obtener los servicios de usuario
        setServices(filteredServices);
      } catch (err) {
        setError('Error al obtener el perfil');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setProfileStore(profile);
    router.push('/mi-perfil/editar');
  };

  if (loading) return <CustomLoading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col lg:flex-row justify-center">
      <div className="w-full lg:w-1/3 mb-8 lg:mb-0 lg:mr-8">
        <ProfileCard profile={profile} onEdit={handleEdit} />
      </div>
      <div className="mt-4 w-full lg:w-2/3 mr-4">
        <MiPerfilTabs profile={profile} adoptions={adoptions} posts={posts} services={services} />
      </div>
    </div>
  );
};

export default MiPerfil;
