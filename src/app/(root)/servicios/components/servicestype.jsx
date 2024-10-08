"use client";

import { useEffect, useState } from "react";
import { Card } from "@nextui-org/react";
import { useRouter } from "next/navigation"; 
import { getServiceTypesAction } from "@/actions/service";
import CustomLoading from "@/app/components/customLoading";
import { Roboto_Slab } from 'next/font/google';

const roboto = Roboto_Slab({
  subsets: ['latin'],
  weight: ['400','700'],
})

const ServiceType = () => {
  const [servicesTypes, setServiceTypes] = useState([]);
  const [loading, setLoadingServiceTypes] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); 

  useEffect(() => {
    async function fetchServiceTypes() {
      try {
        const serviceTypeData = await getServiceTypesAction();
        console.log(serviceTypeData);
        setServiceTypes(serviceTypeData || []);
        setLoadingServiceTypes(false);
      } catch (error) {
        console.error("Error fetching service type:", error);
        setError('Error al cargar los tipos de servicios');
        setLoadingServiceTypes(false);
      }
    }
    fetchServiceTypes();
  }, []);
  

  if (loading) {
    return <CustomLoading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-10 mt-20 mb-20"> {/* Aumentar espacio con mt-20 */}
      {servicesTypes.map((servT, index) => (
        <div key={index} className="text-center">
          {/* Nombre del servicio */}
          <h3 className={`${roboto.className} mb-2 text-2xl font-bold text-secondary-blue`}>{servT.name}</h3>

          {/* Tarjeta */}
          <Card
            isHoverable
            isPressable
            onClick={() => router.push(`/servicios/publicaciones?title=&serviceType_id=${servT.id}`)}
            className="w-96 h-96 relative group mb-10" // Agregar margen inferior a las tarjetas
          >
            <div className="absolute w-full h-full transition-transform duration-500 transform group-hover:rotate-y-180">
              <img
                src={servT.s3Url}
                alt={servT.name}
                width={384}
                height={384}  
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="absolute w-full h-full bg-gray-800 text-white flex items-center justify-center p-4 rounded-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500 transform rotate-y-180">
              <p>{servT.description}</p>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ServiceType;
