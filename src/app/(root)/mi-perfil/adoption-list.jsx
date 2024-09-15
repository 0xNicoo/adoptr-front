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
          <Card key={adoption.id} className="overflow-hidden">
            <CardBody className="px-2">
              <div className="rounded-lg aspect-square w-full overflow-hidden">
                <Image
                  alt="Animal en adopción"
                  src={adoption.s3Url}
                  width="100%"
                  height="100%"
                  style={{ objectFit: 'cover' }}
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
        <Card>
          <CardBody>
            <p>No se encontraron publicaciones de mascotas</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default AdoptionList;
