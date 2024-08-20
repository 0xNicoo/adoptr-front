"use client";
import React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import Step1 from './step-1';
import Step2 from './step-2';
import Step3 from './step-3';
import Step4 from './step-4';
import Stepper from './stepper';
import { useFormStore } from './store';

const MultiStepForm = () => {
  const { step, nextStep, prevStep } = useFormStore();

  const renderStepper = () => {
    return (
      <Stepper currentStep={step} />
    )
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
       case 3:
        return <Step3 />;   
      case 4:
        return <Step4 />;
      default:
        return <Step1 />;
    }
  };

  const renderButtons = () => {
    return (
      <div className="flex flex-row justify-between mt-4 mb-4 items-end mx-4">
        {step > 1 && <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" onClick={prevStep}>Atrás</button>}
        {step < 4 && <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white"  onClick={nextStep}>Siguiente</button>}
        {step === 4 && <button className="bg-primary-orange hover:bg-orange-700 py-2 px-8 rounded-3xl transition-colors duration-300 text-white" type="submit">Publicar</button>}
      </div>
    );
  };

    return (
        <NextUIProvider>
          <div className="bg-background-gray min-h-screen flex pt-2 px-5 pb-2 justify-center">
            <div className="bg-white flex w-full border rounded-3xl drop-shadow-md flex-col">
                {renderStepper()}
                {renderStep()}
                {renderButtons()}
            </div>
        </div>
        </NextUIProvider>
    );
};

export default MultiStepForm;
