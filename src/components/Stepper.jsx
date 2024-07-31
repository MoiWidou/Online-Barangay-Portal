import React, { useEffect, useState, useRef, useMemo } from 'react';

const Stepper = ({ steps, currentStep }) => {
  const [newStep, setNewStep] = useState([]);
  const stepRef = useRef([]);

  const updateStep = (stepNumber, steps) => {
    const newSteps = steps.map((step, index) => {
      if (index === stepNumber) {
        return {
          ...step,
          highlighted: true,
          selected: true,
          completed: true,
        };
      } else if (index < stepNumber) {
        return {
          ...step,
          highlighted: false,
          selected: true,
          completed: true,
        };
      } else {
        return {
          ...step,
          highlighted: false,
          selected: false,
          completed: false,
        };
      }
    });
    return newSteps;
  };

  // Memoize steps array to avoid unnecessary re-renders
  const memoizedSteps = useMemo(() => {
    return steps.map((step, index) => ({
      description: step,
      completed: false,
      highlighted: index === 0,
      selected: index === 0,
    }));
  }, [steps]);

  useEffect(() => {
    stepRef.current = memoizedSteps;
    const current = updateStep(currentStep - 1, stepRef.current);
    if (JSON.stringify(newStep) !== JSON.stringify(current)) {
      setNewStep(current);
    }
  }, [memoizedSteps, currentStep]);
  
  // Determine if it's mobile view
  const isMobileView = window.innerWidth < 768;

  const displaySteps = newStep.map((step, index) => (
    <div key={index} className={index !== newStep.length - 1 ? "w-full flex items-center" : "flex items-center"}>
      <div className='relative flex flex-col items-center text-teal-600'>
        <div className={`rounded-full transition duration-500 ease-in-out border-2 border-gray-300 h-12 w-12 flex item-center justify justify-center py-3 ${step.selected ? "bg-green-600 text-white font-bold border border-green-600" : ""}`}>
          {step.completed ? (
            <span className="text-white font-bold text-xl">&#10003;</span>
          ) : (index + 1)}
        </div>
        {(isMobileView && index !== currentStep - 1) || (!isMobileView && index !== currentStep - 1) ? null : (
          <div className={`absolute top-0 text-center mt-16 w-32 text-xs font-medium uppercase ${step.highlighted ? "text-gray-900" : "text-gray-400"}`}>
            {step.description}
          </div>
        )}
      </div>
      <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${step.completed ? "border-green-600" : "border-gray-300" }`}>
      </div>
    </div>
  ));

  return (
    <div className="mx-4 p-4 flex justify-between items-center">
      {displaySteps}
    </div>
  );
}

export default Stepper;
