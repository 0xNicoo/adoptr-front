import React from 'react';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
});

const Banner = ({ description, imageUrl }) => {
  return (
    <div className="relative bg-gray-100 w-full h-64 md:h-80 flex items-center justify-center shadow-md rounded-lg overflow-hidden">
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Banner background" 
          className="absolute w-full h-full object-cover opacity-60" 
        />
      )}
      
      <div className="relative z-10 text-center px-4">
        <h1 className={`text-white text-2xl md:text-4xl font-bold mb-2 ${roboto.className}`}>
          ¡Bienvenido a servicios!
        </h1>
      </div>

      <div className="absolute inset-0 bg-black opacity-50"></div>
    </div>
  );
};

export default Banner;
