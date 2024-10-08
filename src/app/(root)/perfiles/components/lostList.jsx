"use client"
import { Card, CardBody, CardHeader, Image } from '@nextui-org/react';
import { Inter } from "next/font/google";

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

const LostList = ({ lost }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
      {lost?.length > 0 ? (
      lost.map((lost) => (
        <div key={lost.id} className="w-full">
          <Card className="items-center justify-center pb-2">
            <CardBody className="overflow-hidden p-0 flex justify-center relative">
            <div className="w-full h-[300px] overflow-hidden">
              <img
                alt="Imagen del post"
                src={lost.s3Url}
                className="w-full h-full rounded-t-xl object-cover"    
                />
            </div>
            </CardBody>
            <CardHeader className="pb-2 pt-4 flex flex-col items-start">
              <p className={`${inter.className} text-xs uppercase font-bold`}>
                {mapSexType(lost.sexType)}
              </p>
              <small className={`${inter.className} text-default-500`}>
                {lost.ageYears} años {lost.ageMonths} meses
              </small>
              <h4 className={`${inter.className} text-lg`}>{lost.title}</h4>
            </CardHeader>
            <a
                href={`/perdidas/${lost.id}`}
                className={`${inter.className} text-primary-blue text-sm hover:text-blue-hover mt-2`}
                >
                Ver más
                </a>
          </Card>
          </div>
        ))
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
    </div>
  );
};

export default LostList;