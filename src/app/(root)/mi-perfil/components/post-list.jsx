"use client"
import { Card, CardHeader, CardBody, CardFooter, Divider, Image } from '@nextui-org/react';
import { Inter } from "next/font/google";
import { cilHeart } from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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

const PostList = ({ posts, profile, onOpen }) => {
  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="flex flex-col gap-3">
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => (
          <Card className="w-4/5" key={post.id}>
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
              <p>{post.description}</p>
            </CardBody>
            <Divider />
            <CardFooter>
              <CIcon icon={cilHeart} className="w-5 h-5 text-gray-500 mr-1" />
            </CardFooter>
          </Card>
        ))
      ) : (
        <Card>
          <CardBody>
            <p>No se encontraron novedades</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default PostList;
