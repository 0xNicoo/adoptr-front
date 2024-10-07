import React, { useEffect, useState } from 'react';
import localFont from 'next/font/local';
import { getServiceTypesAction } from '@/actions/service';
import CustomLoading from "@/app/components/customLoading";

const gladolia = localFont({
  src: '../../../../../resources/font/GladoliademoRegular.otf',
  display: 'swap',
});

const gladoliatwo = localFont({
  src: '../../../../../resources/font/GladoliademoShadow.otf',
  display: 'swap',
});

const SectionService = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoadingServiceType] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchServiceTypes() {
      try {
        const serviceTypeData = await getServiceTypesAction();
        console.log(serviceTypeData);
        setServiceTypes(serviceTypeData || []);
        setLoadingServiceType(false);
      } catch (error) {
        console.error("Error fetching service type:", error);
        setError('Error al cargar los tipos de servicios');
        setLoadingServiceType(false);
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

  const serviceName = serviceTypes.length > 0 
    ? serviceTypes[0].name.replace(/[áéíóú]/g, match => {
        switch (match) {
          case 'á': return 'a';
          case 'é': return 'e';
          case 'í': return 'i';
          case 'ó': return 'o';
          case 'ú': return 'u';
          default: return match;
        }
      })
    : 'Nombre no disponible';

  return (
    <div className="text-center mt-10">
      <h1 className="relative text-6xl lg:text-6xl flex justify-center items-center">
        <span className={`${gladolia.className} text-primary-orange absolute right-0`}>
          {serviceName}
        </span>
        <span className={`${gladoliatwo.className} text-primary-blue relative`}>
          {serviceName}
        </span>
      </h1>
    </div>
  );
};

export default SectionService;
