"use client"
import { Textarea } from '@nextui-org/react';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { CIcon } from '@coreui/icons-react';
import { cilLocationPin } from '@coreui/icons';
import { Inter } from "next/font/google";
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

const ProfileCard = ({ profile, onEdit }) => {
  const router = useRouter();

  if (!profile) return <p>No se encontró el perfil</p>;

  return (
    <div className="sticky top-0 bg-white rounded-b-xl shadow-lg overflow-hidden">
      <div className="absolute mx-10 top-0 left-0 right-0 h-1/3 bg-primary-orange rounded-b-[30px]"></div>
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
        <div className='mt-8'>
          <button onClick={onEdit}>
            <Cog6ToothIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
