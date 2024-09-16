"use client"
import React, { useEffect, useState } from 'react';
import { handleGetProfile, handleGetAdoptions, handleGetPosts } from './actions';
import ProfileCard from './profile-card';
import MiPerfilTabs from './tabs';
import { useProfileEditStore } from '@/app/store';
import { useRouter } from 'next/navigation';

const MiPerfil = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adoptions, setAdoptions] = useState(null);
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
      } catch (err) {
        setError('Error al obtener el perfil');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const onPostsChange = (post) => {
    setPosts([...posts, post]) 
  }

  const removePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

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
        <MiPerfilTabs adoptions={adoptions} posts={posts} onPostsChange={onPostsChange} profile={profile} removePost={removePost}/>
      </div>
    </div>
  );
};

export default MiPerfil;
