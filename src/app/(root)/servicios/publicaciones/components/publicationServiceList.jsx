'use client';

import React from 'react';
import { Inter } from "next/font/google";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

const PublicationServiceList = ({ publications }) => {
  console.log('Publicaciones a mostrar:', publications);
  if (!publications || publications.length === 0) {
    return <p>No hay publicaciones</p>;
  }

  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {publications.map((pub) => (
        <div key={pub.id} className="w-full">
          <Card className="items-center justify-center p-4">
            <CardBody className="overflow-hidden p-0 flex justify-center">
              <Image
                alt="Servicio"
                className="object-cover rounded-xl"
                src={pub.s3Url}
                width={270}
                height={300}
              />
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
