"use client";
import React, { useState, useEffect } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import Step2 from './step-2';
import Step3 from './step-3';
import Step4 from './step-4';
import Stepper from './stepper';
import { useFormStorePerfil } from '../../store';

const MultiStepForm = () => {
  
  const { step, nextStep, prevStep } = useFormStorePerfil();
  const { firstName, lastName, description, image, locality } = useFormStorePerfil();

  const renderStepper = () => {
    return (
      <Stepper currentStep={step} />
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
          <div className="bg-background-gray min-h-screen flex pt-2 px-5 pb-2 justify-center">
            <div className="bg-white flex w-full border rounded-3xl drop-shadow-md flex-col">
                {renderStepper()}
                {renderStep()}
            </div>
        </div>
        </NextUIProvider>
    );
};

export default MultiStepForm;
