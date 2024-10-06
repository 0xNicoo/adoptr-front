import React from 'react';
import localFont from 'next/font/local';

const gladoliatwo = localFont({
  src: '../../../../resources/font/GladoliademoShadow.otf',
  display: 'swap',
});

const gladolia = localFont({
  src: '../../../../resources/font/GladoliademoRegular.otf',
  display: 'swap',
});


const Banner = ({ description, imageUrl }) => {
  return (
    <>
      {/* Banner para pantallas pequeñas */}
      <div className="md:hidden relative bg-white-800 w-full h-60 flex flex-col items-center justify-center shadow-md overflow-hidden">
        <div className="relative z-10 text-center px-4 mt-4">
        <h1 className="relative text-6xl lg:text-8xl mb-2 flex justify-center items-center">
            <span className={`${gladolia.className} text-primary-orange-light absolute right-0`}>
              Servicios
            </span>
            <span className={`${gladoliatwo.className} text-custom-light relative`}>
              Servicios
            </span>
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
        className="hidden md:flex relative w-full h-48 lg:h-[18rem] xl:h-[18rem] 2xl:h-[28rem] items-center justify-between shadow-md overflow-hidden"
        style={{
          backgroundImage: `url('/images/Background_services.jpg')`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat', 
        }}
      >
        <div className="relative z-10 text-center flex flex-col justify-center">
          <h1 className="relative text-6xl lg:text-8xl mb-2 left-10 flex justify-center items-center">
            <span className={`${gladolia.className} text-primary-orange-light absolute right-0`}>
              Servicios
            </span>
            <span className={`${gladoliatwo.className} text-custom-light relative`}>
              Servicios
            </span>
          </h1>
        </div>
      </div>

    </>
  );
};

export default Banner;
