import React from 'react';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
});

const Banner = ({ description, imageUrl }) => {
  return (
    <div className="relative bg-white-800 w-full h-80 md:h-[25rem] flex items-center justify-between shadow-md overflow-hidden">
      
      <div className="relative z-10 text-left px-7">
        <h1 className={`text-8xl md:text-9xl font-bold mb-2 ${roboto.className}`}>
          <span className="text-primary-blue">Servi</span>
          <span className="text-primary-orange">cios</span>
        </h1>
      </div>

      <div className="relative z-10 w-1/3">
        <img src='/images/Servicio-2.png' alt="Descripción de la imagen" className="h-full object-cover" />
      </div>

      <div className="absolute inset-0 bg-black opacity-5"></div>
    </div>
  );
};

export default Banner;
