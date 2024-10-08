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

const AdoptionList = ({ adoptions }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
      {adoptions.length > 0 ? (
      adoptions.map((adoption) => (
        <div key={adoption.id} className="w-full">
          <Card className="items-center justify-center pb-2">
            <CardBody className="overflow-hidden p-0 flex justify-center relative">
            <div className="w-full h-[300px] overflow-hidden">
              <img
                alt="Imagen del post"
                src={adoption.s3Url}
                className="w-full h-full rounded-t-xl object-cover"    
                />
            </div>
            </CardBody>
            <CardHeader className="flex-col items-start p-4">
              <p className={`${inter.className} text-xs uppercase font-bold`}>
                {mapSexType(adoption.sexType)}
              </p>
              <small className={`${inter.className} text-default-500`}>
                {adoption.ageYears} años {adoption.ageMonths} meses
              </small>
              <h4 className={`${inter.className} text-lg`}>{adoption.title}</h4>
            </CardHeader>
            <a
            href={`/adopcion/${adoption.id}`}
            className={`${inter.className} text-primary-blue text-sm hover:text-blue-hover`}
            >
            Ver más
            </a>
          </Card>
          </div>
      ))
     ) : (
      <div className='max-w-4xl flex flex-row items-center w-2/3 mt-16'>
        <img 
          src="/images/globito2.png" 
          alt="No hay publicaciones" 
          className="w-48 h-48 object-cover ml-auto" 
        />
        <p className="text-gray-600 text-2xl">Aún no hay publicaciones</p>
      </div>
      )}
    </div>
  );
};

export default AdoptionList;
