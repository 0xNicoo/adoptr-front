"use client"
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProfileCard from './components/profile-card';
import MiPerfilTabs from './components/tabs';
import { getPostsByUserIdAction } from '@/actions/post';
import { getAdoptionsAction } from '@/actions/adoption';
import { getProfilByUserIdAction } from '@/actions/profile';

export default function PerfilesPage() {
    const searchParams = useSearchParams();
    const userId = searchParams.get('id');
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [adoptions, setAdoptions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      if (!userId) {
        setError('No se proporcionó ID de usuario');
        setLoading(false);
        return;
      }

      try {
        const profileData = await getProfilByUserIdAction(userId);
        setProfile(profileData);
        console.log('profile', profileData);
        const postsData = await getPostsByUserIdAction(userId); 
        setPosts(postsData); 
        const adoptionsData = await getAdoptionsAction();
        const filteredAdoptions = adoptionsData.filter(adoption => adoption.user.id === profileData.user.id);
        setAdoptions(filteredAdoptions);
      } catch (err) {
        setError('Error al obtener el perfil ');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [userId]);

  if (loading) return <div>Cargando perfil...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>No se encontró el perfil</div>;

  return (
    <div className="flex flex-col lg:flex-row justify-center">
    <div className="w-full lg:w-1/3 mb-8 lg:mb-0 lg:mr-8">
      <ProfileCard profile={profile}/>
    </div>
    <div className="mt-4 w-full lg:w-2/3 mr-4">
      <MiPerfilTabs adoptions={adoptions} posts={posts} profile={profile}/>
    </div>
  </div>
  );
}