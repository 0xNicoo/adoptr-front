import React from "react";

const Stepper = ({ currentStep }) => {
  return (
    <div className="ml-5 pt-4 pb-4">
      <ol className="flex items-center w-full text-xs sm:text-sm md:text-base text-gray-500 font-medium">
        {[
          { step: 1, label: 'Completá los datos' },
          { step: 2, label: 'Contanos más' },
          { step: 3, label: 'Listo' },
        ].map(({ step, label }, index) => (
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