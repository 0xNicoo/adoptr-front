'use client';

import React, { useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { getAllFavoritesAction } from '@/actions/adoption';

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

const PublicationFavoriteList = () => {
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavPublication = async () => {
      const resp = await getAllFavoritesAction()
      console.log(resp)
      setPublications(resp)
    }
    fetchFavPublication()
    setLoading(false)
  },[])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-10">
      {publications.map((pub) => (
        <div key={pub.id} className="w-full">
          <Card className="items-center justify-center p-4">
            <CardBody className="overflow-hidden p-0 flex justify-center">
              <Image
                alt="Animal en adopción"
                className="object-cover rounded-xl"
                src={pub.s3Url}
                width={270}
                height={300}
              />
            </CardBody>
            <CardHeader className="pb-2 pt-4 flex flex-col items-start">
              <p className={`${inter.className} text-xs uppercase font-bold`}>
                {mapSexType(pub.sexType)}
              </p>
              <small className={`${inter.className} text-gray-500`}>
                {pub.ageYears} años {pub.ageMonths} meses
              </small>
              <h4 className={`${inter.className} text-lg`}>{pub.title}</h4>
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

export default PublicationFavoriteList;
