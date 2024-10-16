'use client';

import React, { useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { getAllFavoritesAction } from '@/actions/favorite';
import CustomLoading from "@/app/components/customLoading";


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
    return <CustomLoading />
  }

  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-10">
      {publications.map((pub) => (
        <div key={pub.id} className="w-full">
          <Card className="items-center justify-center pb-2">
            <CardBody className="overflow-hidden p-0 flex justify-center">
            <div className="w-full h-[300px] overflow-hidden">
              <img
                alt="Imagen del post"
                src={pub.s3Url}
                className="w-full h-full rounded-t-xl object-cover"    
                />
            </div>
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
