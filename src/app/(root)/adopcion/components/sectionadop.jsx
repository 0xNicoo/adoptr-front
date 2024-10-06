import React from 'react';
import localFont from 'next/font/local';

const gladolia = localFont({
  src: '../../../../resources/font/GladoliademoRegular.otf',
  display: 'swap',
});

const gladoliatwo = localFont({
  src: '../../../../resources/font/GladoliademoShadow.otf',
  display: 'swap',
});

const SectionAdop = () => {
  return (
    <div className="text-center mt-16">
      <h1 className="relative text-6xl lg:text-6xl mb-2 left-10 flex justify-center items-center">
        <span className={`${gladolia.className} text-primary-orange absolute right-0`}>
          Encontra tu mascota ideal
        </span>
        <span className={`${gladoliatwo.className} text-primary-blue relative`}>
          Encontra tu mascota ideal
        </span>
      </h1>
    </div>
  );
};

export default SectionAdop;
