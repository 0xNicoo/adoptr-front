"use client";

import Link from 'next/link';
import { Card, CardHeader, CardBody, CardFooter, Divider, Image, useDisclosure } from '@nextui-org/react';
import { cilHeart } from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
import { useInView } from 'react-intersection-observer';
import CustomLoading from '@/app/components/customLoading';
import { useEffect, useState } from 'react';
import { getAllPostsAction } from '@/actions/post';
import { getProfilByUserIdAction } from '@/actions/profile';
import PostImageModal from './postImageModal';

const formatDate = (dateString) => {
  const postDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now - postDate;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMins = Math.floor(diffInMs / (1000 * 60));

  if (diffInHours < 1) {
    return `Hace ${diffInMins} minuto${diffInMins !== 1 ? 's' : ''}`;
  } else if (diffInHours < 24) {
    return `Hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
  } else {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(postDate);
  }
};

const PostList = ({ posts, setPosts }) => {
  const [profiles, setProfiles] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const PAGE_SIZE = 10;
  const [ref, inView] = useInView();
  const [currentPage, setPage] = useState(0);
  const [endOfList, setEndOfList] = useState(false);
  const { isOpen, onOpen: openModal, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profileDataPromises = posts.map((post) =>
          getProfilByUserIdAction(post.user.id) 
        );

        const profileDataResults = await Promise.all(profileDataPromises); 
        const newProfiles = {};
        posts.forEach((post, index) => {
          newProfiles[post.user.id] = profileDataResults[index];
        });

        setProfiles(newProfiles); 
      } catch (err) {
        setError('Error al obtener los perfiles');
      } finally {
        setLoading(false);
      }
    };

    if (posts.length > 0) {
      fetchProfiles();
    }
  }, [posts]); 

  const onScroll = async () => {
    const nextPage = currentPage + 1;
    const postsData = await getAllPostsAction(nextPage, PAGE_SIZE);

    if (postsData.length < 10) {
      setEndOfList(true);
    }
    setPage(nextPage);
    setPosts([...posts, ...postsData]);
  };

  useEffect(() => {
    if (inView) {
      onScroll();
    }
  }, [inView]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    openModal();
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col justify-center gap-3">
      {posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <Card className="flex" key={post.id}>
              <CardHeader className="flex flex-row justify-between">
                <div className="flex flex-row gap-2">
                  <div className="flex flex-col">
                    {profiles[post.user.id]?.s3Url ? (
                      <Image
                        alt="Foto de perfil del usuario"
                        height={40}
                        width={40}
                        src={profiles[post.user.id].s3Url} 
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    )}
                  </div>
                  <div className="flex flex-col">
                  <Link href={`/perfiles?id=${post.user.id}`}>
                    <p className="text-md hover:underline underline-offset-4 text-secondary-blue font-medium">{profiles[post.user.id]?.firstName || 'Nombre'} {profiles[post.user.id]?.lastName || 'Apellido'}</p>
                  </Link>
                    <p className="text-small text-default-500">{formatDate(post.date)}</p>
                  </div>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className='break-words'>{post.description}</p>
                {post.s3Url ? (
                  <div className="w-full flex justify-center mt-2">
                    <div className="w-full h-[500px] overflow-hidden rounded-md">
                      <img
                        alt="Imagen del post"
                        src={post.s3Url}
                        className="w-full h-full object-cover"
                        onClick={() => handleImageClick(post.s3Url)}
                      />
                    </div>
                  </div>
                ) : null}
              </CardBody>
              <Divider />
              <CardFooter>
                <CIcon icon={cilHeart} className="w-5 h-5 text-gray-500 mr-1" />
              </CardFooter>
            </Card>
          ))}
          <div className="flex justify-center items-center my-4 w-4/5">
            {endOfList ? (
              <p className="text-gray-600">Ya no hay más posts para cargar :c</p>
            ) : (
              <div ref={ref}>
                <CustomLoading />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <img 
            src="/images/globito.png" 
            alt="No hay publicaciones" 
            className="w-64 h-64 object-cover" 
            />
          <p className="mt-4 text-gray-600 text-3xl">Aún no hay publicaciones</p>
        </div>
      )}
      <PostImageModal isOpen={isOpen} onClose={onClose} imageUrl={selectedImage} />
    </div>
  );
};

export default PostList;
