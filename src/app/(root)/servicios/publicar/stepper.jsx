import React from "react";

const Stepper = ({ currentStep }) => {
  const getLabelForCurrentStep = (step) => {
    const stepLabels = {
      1: 'Completá los datos',
      2: 'Contanos más',
      3: 'Listo',
    };
    return stepLabels[step] || '';
  };

  return (
    <div className="px-4 xs:ml-0 pt-4 pb-4">
      {/*Pantallas chicas */}
      <div className="flex items-center justify-center text-xs sm:hidden text-primary-blue font-medium text-center">
        <li
          key={currentStep}
          className="flex w-full items-center justify-center text-primary-blue"
        >
          <div className="flex text-xl items-center">
            <span
              className={`mr-1 w-6 h-6 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-primary-blue text-white rounded-full flex justify-center items-center`}
            >
              {currentStep}
            </span>
            {getLabelForCurrentStep(currentStep)}
          </div>
        </li>
      </div>
      
      {/* Pantallas grandes*/}
      <ol className="hidden sm:flex items-center w-full text-xs sm:text-sm md:text-base text-gray-500 font-medium ">
        {[
          { step: 1, label: 'Seleccioná el animal' },
          { step: 2, label: 'Completá los datos' },
          { step: 3, label: 'Contanos más' },
          { step: 4, label: 'Listo' },
        ].map(({ step, label }) => (
          <li
            key={step}
            className={`flex w-full items-center ${currentStep >= step ? 'text-primary-blue' : 'text-gray-600'} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:hidden sm:after:inline-block after:mx-2 sm:after:mx-4 lg:after:mx-6`}
          >
            <div className="flex items-center whitespace-nowrap">
              <span
                className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${
                  currentStep >= step ? 'bg-primary-blue text-white' : 'bg-gray-100 border border-gray-200 text-gray-600'
                } rounded-full flex justify-center items-center mr-2 sm:mr-3`}
              >
                {step}
              </span>
              {label}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Stepper;