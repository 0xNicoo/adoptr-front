"use client"
import React, { useEffect, useState } from 'react';
import { handleGetProfile, handleGetAdoptions, handleGetServices, handleGetPosts } from './actions';
import ProfileCard from './components/profile-card';
import MiPerfilTabs from './components/tabs';
import { useProfileEditStore } from '@/app/store';
import { useRouter } from 'next/navigation';

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
        const profileData = await handleGetProfile();
        setProfile(profileData);
        const adoptionsData = await handleGetAdoptions();
        const filteredAdoptions = adoptionsData.filter(adoption => adoption.user.id === profileData.user.id);
        setAdoptions(filteredAdoptions);
        const postsData = await handleGetPosts(); 
        setPosts(postsData); 
        const servicesData = await handleGetServices();
        const filteredServices = servicesData.filter(service => service.user.id === profileData.user.id);
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

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col lg:flex-row justify-center">
      <div className="w-full lg:w-1/3 mb-8 lg:mb-0 lg:mr-8">
        <ProfileCard profile={profile} onEdit={handleEdit} />
      </div>
      <div className="mt-4 w-full lg:w-2/3 mr-4">
        <MiPerfilTabs adoptions={adoptions} posts={posts} services={services} onPostsChange={onPostsChange} profile={profile} removePost={removePost}/>
      </div>
    </div>
  );
};

export default MiPerfil;
