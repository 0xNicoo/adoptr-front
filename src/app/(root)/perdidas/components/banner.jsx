import React from 'react';
import { Roboto } from 'next/font/google';
import localFont from 'next/font/local';

const gladolia = localFont({
  src: '../../../../resources/font/GladoliademoRegular.otf',
  display: 'swap',
});

const gladoliatwo = localFont({
  src: '../../../../resources/font/GladoliademoShadow.otf',
  display: 'swap',
});

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
          <h1 className="relative text-6xl lg:text-8xl font-bold mb-2 flex justify-center items-center">
            <span className={`${gladolia.className} text-custom-orange absolute left-0 right-0`}>
              Mascotas perdidas
            </span>
            <span className={`${gladoliatwo.className} text-secondary-blue relative`}>
              Mascotas perdidas
            </span>
          </h1>
        </div>

        {/* Imágenes posicionadas en el banner */}
        <img 
          src="/images/BannerLostIzq.png" 
          alt="Imagen 1" 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-16 h-16"
        />
        <img 
          src="/images/BannerLostEsqL.png" 
          alt="Imagen 2" 
          className="absolute left-0 bottom-0 w-16 h-16"
        />
        <img 
          src="/images/BannerLostMid.png" 
          alt="Imagen 3" 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-16"
        />
        <img 
          src="/images/BannerLostEsqR.png" 
          alt="Imagen 4" 
          className="absolute right-0 bottom-0 w-16 h-16"
        />
        <img 
          src="/images/BannerLostDer.png" 
          alt="Imagen 5" 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-16 h-16"
        />

        <div className="absolute inset-0 bg-white opacity-5"></div>
      </div>

      {/* Banner para pantallas medianas y grandes */}
      <div
          className="hidden md:flex relative w-full h-48 lg:h-[18rem] xl:h-[18rem] 2xl:h-[28rem] items-center justify-center shadow-md overflow-hidden"
          style={{
            backgroundImage: `url('/images/PerdidasBanner.png')`, 
            backgroundSize: 'cover', // Cambiado a cover para que la imagen de fondo cubra el área sin distorsionarse
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <img 
            src="/images/Snoopy.png" 
            alt="Imagen 1" 
            className="absolute left-2 md:left-8 top-1/2 transform -translate-y-1/2 max-w-full max-h-40 md:max-h-60 w-auto h-auto" // Cambiado el tamaño máximo para mejor ajuste
          />

          <img 
            src="/images/DogCrying.png" 
            alt="Imagen 2" 
            className="absolute right-2 md:right-8 top-1/2 transform -translate-y-1/2 max-w-full max-h-40 md:max-h-60 w-auto h-auto" // Cambiado el tamaño máximo para mejor ajuste
          />

          <div className="relative z-10 text-center flex flex-col items-center justify-center">
            <h1 className="relative text-4xl md:text-6xl lg:text-8xl mb-2 flex justify-center items-center">
              <span className={`${gladolia.className} text-custom-orange absolute left-0 right-0`}>
                Mascotas perdidas
              </span>
              <span className={`${gladoliatwo.className} text-secondary-blue relative`}>
                Mascotas perdidas
              </span>
            </h1>
          </div>
        </div>

    </>
  );
};

export default Banner;
