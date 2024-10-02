import React from 'react';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const Banner = ({ description, imageUrl }) => {
  return (
    <>
      {/* Banner para pantallas pequeñas */}
      <div className="md:hidden relative bg-white-800 w-full h-60 flex flex-col items-center justify-center shadow-md overflow-hidden">
        <div className="relative z-10 text-center px-4 mt-4">
          <h1 className={`text-6xl lg:text-8xl font-bold mb-2 ${roboto.className}`}>
            <span className="text-primary-blue">Servicios</span>
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 w-full flex justify-center">
          <img
            src='/images/mascotas_servicios.png' 
            className="h-24 object-contain" 
          />
        </div>
        <div className="absolute inset-0 bg-white opacity-5"></div>
      </div>


      {/* Banner para pantallas medianas y grandes */}
      <div
        className="hidden md:flex relative w-full h-80 lg:h-[25rem] items-center justify-between shadow-md overflow-hidden"
        style={{
          backgroundImage: `url('/images/Background_services.jpg')`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat', 
        }}
      >
        <div className="relative z-10 text-left px-7">
          <h1 className={`text-6xl lg:text-8xl font-bold mb-2 ${roboto.className}`}>
            <span className="text-primary-blue">Servicios</span>
          </h1>
        </div>
      </div>

    </>
  );
};

export default Banner;
