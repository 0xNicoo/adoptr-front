import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const Stepper = () => {
    return (
        <div className="ml-5">
<ol className="flex items-center w-full text-sm text-gray-500 font-medium sm:text-base">
  <li className="flex md:w-full items-center text-primary-blue sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8 ">
    <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2 ">
      <span className="w-6 h-6 bg-primary-blue rounded-full flex justify-center items-center mr-3 text-sm text-white lg:w-10 lg:h-10">1</span>Seleccioná el animal
    </div>
  </li>
  <li className="flex md:w-full items-center text-gray-600 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8 ">
    <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2 ">
      <span className="w-6 h-6 bg-gray-100 border border-gray-200 rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10">2</span>Completá los datos
    </div>
  </li>
  <li className="flex md:w-full items-center text-gray-600 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8 ">
    <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2 ">
      <span className="w-6 h-6 bg-gray-100 border border-gray-200 rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10">3</span> Contanos más
    </div>
  </li>
  <li className="flex md:w-full items-center text-gray-600 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8 ">
    <div className="flex items-center">
      <span className="w-6 h-6 bg-gray-100 border border-gray-200 rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10">4</span> Listo
    </div>
  </li>
</ol>
</div>
    )
};
export default Stepper;