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

const AdoptionList = ({ adoptions, handleDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {adoptions.length > 0 ? (
        adoptions.map((adoption) => (
          <Card key={adoption.id} className='items-center justify-center p-4'>
            <CardBody className="overflow-hidden p-0 flex justify-center">
              <Image
                alt="Animal en adopción"
                className="object-cover rounded-xl"
                src={adoption.s3Url}
                width={270}
                height={300}
              />
            </CardBody>
            <CardHeader className="flex-col items-start p-4">
              <p className={`${inter.className} text-xs uppercase font-bold`}>
                {mapSexType(adoption.sexType)}
              </p>
              <small className={`${inter.className} text-default-500`}>
                {adoption.ageYears} años {adoption.ageMonths} meses
              </small>
              <h4 className={`${inter.className} text-lg mt-1`}>{adoption.title}</h4>
              <div className="flex justify-between w-full items-center">
                <div>
                  <a
                    href={`/adopcion/${adoption.id}`}
                    className={`${inter.className} text-primary-blue text-sm hover:text-blue-hover mt-2`}
                  >
                    Ver más
                  </a>
                </div>
              </div>
            </CardHeader>
          </Card>
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

export default AdoptionList;
