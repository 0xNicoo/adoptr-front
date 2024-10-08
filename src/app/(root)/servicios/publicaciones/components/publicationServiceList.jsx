'use client';

import React from 'react';
import { Inter } from "next/font/google";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

const PublicationServiceList = ({ publications }) => {
  console.log('Publicaciones a mostrar:', publications);
  if (!publications || publications.length === 0) {
    return (
    <div className="flex flex-col items-center justify-center">
      <img 
        src="/images/globito.png" 
        alt="No hay publicaciones" 
        className="w-64 h-64 object-cover" 
        />
      <p className="mt-4 text-gray-600 text-3xl">Aún no hay publicaciones</p>
    </div>
    );
  }

  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mx-8">
      {publications.map((pub) => (
        <div key={pub.id} className="w-full">
          <Card className="items-center justify-center">
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
                {(pub.serviceType.name)}
              </p>
              <small className={`${inter.className} text-gray-500`}>
                {pub.locality.name}, {pub.locality.province.name} 
              </small>
              <h4 className={`${inter.className} text-lg`}>{pub.title}</h4>
            </CardHeader>
            <a 
              href={`/servicios/${pub.id}`} 
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

export default PublicationServiceList;
