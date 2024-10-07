'use client';

import React, { useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon as OutlineBookmarkIcon } from '@heroicons/react/24/outline';
import { getUserIdAction } from '@/actions/global';
import { getFavoriteAction, setFavoriteAction } from '@/actions/favorite';

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

const PublicationList = ({ publications }) => {
  const [userId, setUserId] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserIdAction();
      setUserId(id);
    };

    const fetchFavorites = async () => {
      const favs = {};
      for (const pub of publications) {
        const isFavorite = await getFavoriteAction(pub.id);
        favs[pub.id] = isFavorite;
      }
      setFavorites(favs);
    };

    fetchUserId();
    fetchFavorites();
  }, [publications]);

  const handleFavorite = async (publicationId, e) => {
    e.preventDefault();
    const isFavorite = favorites[publicationId];
    if (isFavorite) {
      await setFavoriteAction(publicationId, false);
    } else {
      await setFavoriteAction(publicationId, true);
    }
    setFavorites({ ...favorites, [publicationId]: !isFavorite });
  };

  if (!publications || publications.length === 0) {
    return <p>No hay publicaciones</p>;
  }

  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {publications.map((pub) => (
        <div key={pub.id} className="w-full">
          <Card className="items-center justify-center pb-2">
            <CardBody className="overflow-hidden p-0 flex justify-center relative">
              <Image
                alt="Animal en adopción"
                className="object-cover rounded-none"
                src={pub.s3Url}
                width={270}
                height={300}
              />
              {pub.user.id !== userId && (
                <button 
                  className="absolute top-2 right-2 z-10 bg-white bg-opacity-65 hover:bg-opacity-75 rounded-full p-1 transition-all duration-100 outline-none"
                  onClick={(e) => handleFavorite(pub.id, e)}
                >
                  {favorites[pub.id] ? 
                    <SolidBookmarkIcon className="h-6 w-6 text-yellow-500" /> : 
                    <OutlineBookmarkIcon className="h-6 w-6 text-gray-400"/>
                  }
                </button>
              )}
            </CardBody>
            <CardHeader className="pb-2 pt-4 flex flex-col items-start">
              <p className={`${inter.className} text-xs uppercase font-bold`}>
                {mapSexType(pub.sexType)}
              </p>
              <small className={`${inter.className} text-gray-500`}>
                {pub.ageYears} años {pub.ageMonths} meses
              </small>

              <div className="flex items-center"> 
                <h4 className={`${inter.className} text-lg`}>{pub.title}</h4>
                {pub.adoptionStatusType == "ADOPTED" ? (
                  <button 
                    className="bg-green-500 text-white py-1 px-3 ml-4 rounded-3xl items-end" 
                    disabled 
                  >
                    ADOPTADO
                  </button>
                ) : (<></>)}
              </div>

      
            </CardHeader>
            <a 
              href={`/adopcion/${pub.id}`} 
              className={`${inter.className} text-primary-blue text-sm hover:text-blue-hover mt-2`}
            >
              Ver más
            </a>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default PublicationList;