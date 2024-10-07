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

const LostList = ({ lost, handleDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {lost?.length > 0 ? (
        lost.map((lost) => (
          <Card key={lost.id} className='items-center justify-center p-4'>
            <CardBody className="overflow-hidden p-0 flex justify-center">
              <Image
                alt="Animal en adopción"
                className="object-cover rounded-xl"
                src={lost.s3Url}
                width={270}
                height={300}
              />
            </CardBody>
            <CardHeader className="flex-col items-start p-4">
              <p className={`${inter.className} text-xs uppercase font-bold`}>
                {mapSexType(lost.sexType)}
              </p>
              <small className={`${inter.className} text-default-500`}>
                {lost.locality.name} 
              </small>
              <h4 className={`${inter.className} text-lg mt-1`}>{lost.title}</h4>
              <div className="flex justify-between w-full items-center">
                <div>
                  <a
                    href={`/perdidas/${lost.id}`}
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

export default LostList;