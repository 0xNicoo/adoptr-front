import React from "react";

const Stepper = ({ currentStep }) => {
  return (
      <div className="ml-5 pt-4 pb-4">
          <ol className="flex items-center w-full text-sm text-gray-500 font-medium sm:text-base">
              <li className={`flex md:w-full items-center ${currentStep >= 1 ? 'text-primary-blue' : 'text-gray-600'} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8`}>
                  <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2 ">
                      <span className={`w-6 h-6 ${currentStep >= 1 ? 'bg-primary-blue text-white' : 'bg-gray-100 border border-gray-200 text-gray-600'} rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10`}>1</span>
                      Crear usuario
                  </div>
              </li>
              <li className={`flex md:w-full items-center ${currentStep >= 2 ? 'text-primary-blue' : 'text-gray-600'} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8`}>
                  <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2 ">
                      <span className={`w-6 h-6 ${currentStep >= 2 ? 'bg-primary-blue text-white' : 'bg-gray-100 border border-gray-200 text-gray-600'} rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10`}>2</span>
                      Información personal
                  </div>
              </li>
              <li className={`flex md:w-full items-center ${currentStep >= 3 ? 'text-primary-blue' : 'text-gray-600'} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8`}>
                  <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2 ">
                      <span className={`w-6 h-6 ${currentStep >= 3 ? 'bg-primary-blue text-white' : 'bg-gray-100 border border-gray-200 text-gray-600'} rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10`}>3</span>
                      Crear perfil
                  </div>
              </li>
              <li className={`flex md:w-full items-center ${currentStep === 4 ? 'text-primary-blue' : 'text-gray-600'} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8`}>
                  <div className="flex items-center">
                      <span className={`w-6 h-6 ${currentStep === 4 ? 'bg-primary-blue text-white' : 'bg-gray-100 border border-gray-200 text-gray-600'} rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10`}>4</span>
                      Confirmar
                  </div>
              </li>
          </ol>
      </div>
  )
};

export default Stepper;