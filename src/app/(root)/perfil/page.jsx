"use client";
import React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import Step2 from './components/step-2';
import Step3 from './components/step-3';
import Step4 from './components/step-4';
import Stepper from './components/stepper';
import { useFormStorePerfil } from '../../store';

const MultiStepForm = () => {
  
  const { step, nextStep, prevStep } = useFormStorePerfil();

  const renderStepper = () => {
    return (
      <Stepper currentStep={step+1} />
    )
  }

const renderStep = () => {
    switch (step) {
      case 1:
        return <Step2 nextStep={nextStep} prevStep={prevStep} />;
       case 2:
        return <Step3 nextStep={nextStep} prevStep={prevStep}/>;   
        case 3:
          return <Step4 prevStep={prevStep} />;
      default:
        return <Step2 nextStep={nextStep} prevStep={prevStep} />;
    }
  };

    return (
        <NextUIProvider>
          <div className="bg-background-gray flex xl:pt-2 xl:px-5 xl:pb-2 2xl:px-12 2xl:pt-8 justify-center">
            <div className="bg-white flex w-full border rounded-3xl drop-shadow-md flex-col">
                {renderStepper()}
                {renderStep()}
            </div>
        </div>
        </NextUIProvider>
    );
};

export default MultiStepForm;
