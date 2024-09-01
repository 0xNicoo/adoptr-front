'use client';

import React from 'react';
import Link from 'next/link';

const mapSexType = (sexType) => {
  switch (sexType) {
    case 'MALE':
      return 'Macho';
    case 'FEMALE':
      return 'Hembra';
    default:
      return 'Desconocido'; 
  }
};

const PublicationList = ({ publications }) => {
  console.log('Publicaciones a mostrar:', publications);
  if (!publications || publications.length === 0) {
    return <p>No hay publicaciones</p>;
  }

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      {publications.map((pub) => (
        <div key={pub.id} className="border-2 border-gray-300 p-4 rounded-lg shadow-md bg-white">
          <Link href={`/adopcion/${pub.id}`} className="block">
            <img
              src={pub.s3Url} 
              alt={pub.title}
              className="rounded-lg mb-4 w-full h-64 object-cover"
            />
            <h2 className="text-center text-blue-600 text-2xl font-semibold mb-2">
              {pub.title}
            </h2>
            <p className="text-center text-gray-700 text-lg">{pub.ageYears} años {pub.ageMonths} meses</p>
            <p className="text-center text-gray-700 text-lg">{mapSexType(pub.sexType)}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PublicationList;
