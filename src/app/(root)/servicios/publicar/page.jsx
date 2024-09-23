"use client";
import React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import Step1 from './step-1';
import Step2 from './step-2';
import Step3 from './step-3';
import Stepper from './stepper';
import { useFormStoreServicio } from '@/app/store';

const MultiStepForm = () => {
  const { step, nextStep, prevStep } = useFormStoreServicio();

  const renderStepper = () => {
    return (
      <Stepper currentStep={step} />
    )
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 nextStep={nextStep}/>;
      case 2:
        return <Step2 nextStep={nextStep} prevStep={prevStep}/>;
      case 3:
        return <Step3 prevStep={prevStep}/>;
      default:
        return <Step1 nextStep={nextStep} prevStep={prevStep}/>;
    }
  };

    return (
        <NextUIProvider>
          <div className="bg-background-gray flex pt-2 px-5 pb-2 justify-center">
            <div className="bg-white flex w-full border rounded-3xl drop-shadow-md flex-col">
                {renderStepper()}
                {renderStep()}
            </div>
        </div>
        </NextUIProvider>
    );
};

export default MultiStepForm;