"use client"
import { Card, CardBody, CardHeader, Image } from '@nextui-org/react';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const ServiceList = ({ services }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services?.length > 0 ? (
        services.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <CardBody className="px-2">
              <div className="rounded-lg aspect-square w-full overflow-hidden">
                <Image
                  alt="Publicacion de servicio"
                  src={service.s3Url}
                  width={270}
                  height={300}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </CardBody>
            <CardHeader className="flex-col items-start p-4">
              <p className={`${inter.className} text-xs uppercase font-bold`}>
                {service.serviceType.name}
              </p>
              <small className={`${inter.className} text-default-500`}>
                {service.locality.name} 
              </small>
              <h4 className={`${inter.className} text-lg mt-1`}>{service.title}</h4>
              <div className="flex justify-between w-full items-center">
                <div>
                  <a
                    href={`/servicios/${service.id}`}
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

export default ServiceList;
