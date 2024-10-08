"use client"
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const ServiceList = ({ services }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
      {services.length > 0 ? (
      services.map((service) => (
        <div key={service.id} className="w-full">
          <Card className="items-center justify-center pb-2">
            <CardBody className="overflow-hidden p-0 flex justify-center relative">
            <div className="w-full h-[300px] overflow-hidden">
              <img
                alt="Imagen del post"
                src={service.s3Url}
                className="w-full h-full rounded-t-xl object-cover"    
                />
            </div>
            </CardBody>
            <CardHeader className="pb-2 pt-4 flex flex-col items-start">
              <p className={`${inter.className} text-xs uppercase font-bold`}>
                {service.serviceType.name}
              </p>
              <small className={`${inter.className} text-default-500`}>
                {service.locality.name} 
              </small>
              <h4 className={`${inter.className} text-lg mt-1`}>{service.title}</h4>
            </CardHeader>
            <a
            href={`/servicios/${service.id}`}
            className={`${inter.className} text-primary-blue text-sm hover:text-blue-hover mt-2`}
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

export default ServiceList;
