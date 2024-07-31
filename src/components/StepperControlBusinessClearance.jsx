import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StepperControlBusinessClearance = ({ 
  handleClick, 
  currentStep, 
  steps, 
  uploadFieldsComplete, 
  businessInfoFieldsComplete, 
  addressInfoFieldsComplete, 
  personalDetailsComplete, 
  ownerAddressFieldsComplete, 
  paymentFieldsComplete, 
  uploadInputData, 
  uploadImages,
  setTriggerHighlight
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNextClick = async () => {
  setTriggerHighlight(false); // Reset triggerHighlight to false initially
  if (currentStep === 1 && !uploadFieldsComplete) {
    setErrorMessage('File uploads are incomplete.');
    setTriggerHighlight(true); // Set triggerHighlight to true only when incomplete
    return;
  } else if (currentStep === 2 && !businessInfoFieldsComplete) {
    setErrorMessage('Business information fields are incomplete.');
    setTriggerHighlight(true); // Set triggerHighlight to true only when incomplete
    return;
  } else if (currentStep === 3 && !addressInfoFieldsComplete) {
    setErrorMessage('Business address fields are incomplete.');
    setTriggerHighlight(true); // Set triggerHighlight to true only when incomplete
    return;
  } else if (currentStep === 4 && !personalDetailsComplete) {
    setErrorMessage('Personal information fields are incomplete.');
    setTriggerHighlight(true); // Set triggerHighlight to true only when incomplete
    return;
  } else if (currentStep === 5 && !ownerAddressFieldsComplete) {
    setErrorMessage('Owner address fields are incomplete.');
    setTriggerHighlight(true); // Set triggerHighlight to true only when incomplete
    return;
  } else if (currentStep === 6 && !paymentFieldsComplete) {
    setErrorMessage('Payment fields are incomplete.');
    setTriggerHighlight(true); // Set triggerHighlight to true only when incomplete
    return;
  } else if (currentStep === steps.length - 1) {
    setIsLoading(true); // Show loading overlay
    await uploadImages(); // Upload the uploads from Upload.jsx to the firebase storage
    console.log("Input Data received in stepper:", uploadInputData);
    setIsLoading(false); // Hide loading overlay
    handleClick("next");
  } else {
    setErrorMessage('');
    handleClick("next");
  }
};


  useEffect(() => {
    if (currentStep === 1 && uploadFieldsComplete) {
      setErrorMessage('');
    } else if (currentStep === 2 && businessInfoFieldsComplete) {
      setErrorMessage('');
    } else if (currentStep === 3 && addressInfoFieldsComplete) {
      setErrorMessage('');
    } else if (currentStep === 4 && personalDetailsComplete) {
      setErrorMessage('');
    } else if (currentStep === 5 && ownerAddressFieldsComplete) {
      setErrorMessage('');
    } else if (currentStep === 6 && paymentFieldsComplete) {
      setErrorMessage('');
    }
  }, [uploadFieldsComplete, businessInfoFieldsComplete, addressInfoFieldsComplete, personalDetailsComplete, ownerAddressFieldsComplete, paymentFieldsComplete, currentStep]);

  return (
    
    <div className="container flex flex-col justify-center items-center mt-4 mb-8">
      {errorMessage && (
        <div className="mt-4 text-red-500">
          {errorMessage}
        </div>
      )}
      {isLoading && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="flex flex-col items-center">
                        <div className="loader mb-4 w-10 h-10 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
                        <div className="text-white">Please wait until your files are uploaded...</div>
                    </div>
                </div>
            )}
      <div className="flex justify-around w-full">
        
        <button
          onClick={() => handleClick()}
          className={`bg-white text-slate-400 uppercase py-2 px-4 rounded-xl 
            font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 
            hover:text-white transition duration-200 ease-in-out ${currentStep === 1 ? "opacity-0 cursor-not-allowed pointer-events-none" : ""}`}
        >
          Back
        </button>
        <button
          onClick={handleNextClick}
          className={`next-button uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer transition duration-200 ease-in-out 
            ${(!uploadFieldsComplete && currentStep === 1) || 
              (!businessInfoFieldsComplete && currentStep === 2) || 
              (!addressInfoFieldsComplete && currentStep === 3) || 
              (!personalDetailsComplete && currentStep === 4) || 
              (!ownerAddressFieldsComplete && currentStep === 5) || 
              (!paymentFieldsComplete && currentStep === 6) ? "bg-green-200 text-gray-700 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-900 hover:text-white"}`}
        >
          {currentStep === steps.length - 1 ? "Confirm" : "Next"}
        </button>
      </div>
      
    </div>
  );
}

export default StepperControlBusinessClearance;
