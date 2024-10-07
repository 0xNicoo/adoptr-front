"use client"

import { Card, CardHeader, CardBody, CardFooter, Divider, Image, useDisclosure } from '@nextui-org/react';
import { Inter } from "next/font/google";
import { cilHeart } from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useInView } from 'react-intersection-observer'
import CustomLoading from '@/app/components/customLoading';
import { useEffect, useState } from 'react';
import { getPostsAction } from '@/actions/post';
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

const inter = Inter({ subsets: ["latin"] });

const PostList = ({ posts, profile, onOpen, setPosts }) => {
  const PAGE_SIZE = 10
  const [ref, inView] = useInView()
  const [currentPage, setPage] = useState(0)
  const [endOfList, setEndOfList] = useState(false)
  const { isOpen, onOpen: openModal, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);

  const onScroll = async () => {
    const nextPage = currentPage + 1
    const postsData = await getPostsAction(nextPage, PAGE_SIZE)
    if(postsData.length < 10){
      setEndOfList(true)
    }
    setPage(nextPage)
    setPosts([...posts, ...postsData])
  }

  useEffect(() => {
    if(inView){
      onScroll()
    }
  }, [inView])

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    openModal();
  };

  return (
    <div className="flex flex-col gap-3">
      {posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="flex flex-row justify-between">
                <div className='flex flex-row gap-2'>
                  <div className='flex flex-col'>
                    <Image
                      alt="Foto de perfil del usuario"
                      height={40}
                      width={40}
                      src={profile.s3Url}
                      className='rounded-full'
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-md">{profile.firstName} {profile.lastName}</p>
                    <p className="text-small text-default-500">{formatDate(post.date)}</p>
                  </div>
                </div>
                <div className='flex flex-col'>
                <button onClick={() => onOpen(post.id)}>
                  <MoreVertIcon className='text-primary-blue'/>
                </button>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className='flex items-start break-words'>{post.description}</p>
                {post.s3Url ? (
                  <div className="w-full h-[500px] overflow-hidden mt-2 rounded-lg mx-auto flex items-center justify-center">
                    <img
                      alt="Imagen del post"
                      src={post.s3Url}
                      className="w-full h-full object-cover"
                      onClick={() => handleImageClick(post.s3Url)}
                    />
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
            {endOfList ? 
              <p className='text-gray-600'>Ya no hay mas post para cargar :c</p> 
            : 
            (
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
              className="w-48 h-48 object-cover" 
            />
            <p className="mt-4 text-gray-600 text-2xl">Aún no hay publicaciones</p>
        </div>
      )}
       <PostImageModal isOpen={isOpen} onClose={onClose} imageUrl={selectedImage} />
    </div>
    
  );
};

export default PostList;
