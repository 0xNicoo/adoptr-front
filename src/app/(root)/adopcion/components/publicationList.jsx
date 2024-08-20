import React from 'react';
import Link from 'next/link';

const PublicationList = ({ publications, handlePageChange, currentPage }) => {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      {publications.map((pub) => (
        <div key={pub.id} className="border-2 border-gray-300 p-4 rounded-lg shadow-md bg-white">
          <Link href={`/publication/${pub.id}`} className="block">
            <img
              src={pub.image}
              alt={pub.name}
              className="rounded-lg mb-4 w-full h-64 object-cover"
            />
            <h2 className="text-center text-blue-600 text-2xl font-semibold mb-2">
              {pub.name}
            </h2>
            <p className="text-center text-gray-700 text-lg">{pub.age}</p>
            <p className="text-center text-gray-700 text-lg">{pub.sexo}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PublicationList;
