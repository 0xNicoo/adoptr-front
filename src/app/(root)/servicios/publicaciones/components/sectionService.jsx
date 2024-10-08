import React, { useEffect, useState } from 'react';
import localFont from 'next/font/local';
import { getServiceTypeIdAction } from '@/actions/service';
import CustomLoading from "@/app/components/customLoading";

const gladolia = localFont({
  src: '../../../../../resources/font/GladoliademoRegular.otf',
  display: 'swap',
});

const gladoliatwo = localFont({
  src: '../../../../../resources/font/GladoliademoShadow.otf',
  display: 'swap',
});

// Función para quitar acentos
const removeAccents = (text) => {
  return text ? text.replace(/[áéíóú]/g, match => {
    switch (match) {
      case 'á': return 'a';
      case 'é': return 'e';
      case 'í': return 'i';
      case 'ó': return 'o';
      case 'ú': return 'u';
      default: return match;
    }
  }) : 'Nombre no disponible';
};

const SectionService = ({ serviceType_id }) => {
  const [serviceType, setServiceType] = useState(null);
  const [loading, setLoadingServiceType] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (serviceType_id) {
      async function fetchServiceTypeId() {
        try {
          const serviceTypeData = await getServiceTypeIdAction(serviceType_id);
          setServiceType(serviceTypeData);
          setLoadingServiceType(false);
        } catch (error) {
          console.error("Error fetching service type:", error);
          setError('Error al cargar el tipo de servicio');
          setLoadingServiceType(false);
        }
      }
      fetchServiceTypeId();
    }
  }, [serviceType_id]);

  if (loading) {
    return <CustomLoading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const serviceName = removeAccents(serviceType?.name);

  return (
    <div className="text-center mt-10">
      <h1 className="relative text-6xl lg:text-6xl flex justify-center items-center">
        {/* Sombras y colores en los textos con Gladolia */}
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
