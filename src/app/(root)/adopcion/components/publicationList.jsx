import React from 'react';
import { Inter } from "next/font/google";
import {Card, CardHeader, CardBody, Image} from "@nextui-org/react";

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

//TODO: agregar para que se ajuste un poco a mas resoluciones
//TODO: si tiene 0 años/meses que directamente no aparezca
// ${pub.id}

const PublicationList = ({ publications }) => {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      {publications.length > 0 ? (
        publications.map((pub) => (
          <div key={pub.id}>
              <Card className="py-4 items-center justify-content">
                <CardBody className="overflow-visible py-2">
                  <Image
                  alt="Animal en adopción"
                  className="object-cover rounded-xl"
                  src={pub.s3Url}
                  width={270}
                  height={300}
                  />
                </CardBody>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <p className={`${inter.className} text-xs uppercase font-bold`}>{mapSexType(pub.sexType)}</p>
                  <small className={`${inter.className} xl:text-default-500`}>{pub.ageYears} años {pub.ageMonths} meses</small>
                  <h4 className={`${inter.className} text-lg`}>{pub.title}</h4>
                </CardHeader>
                <a href={`/adopcion/${pub.id}`} className={`${inter.className} text-primary-blue text-sm hover:text-blue-hover`}>Ver más</a>
              </Card>
          </div>
        ))
      ) : (
        <p>No hay publicaciones</p>
      )}
    </div>

  );
};

export default PublicationList;
