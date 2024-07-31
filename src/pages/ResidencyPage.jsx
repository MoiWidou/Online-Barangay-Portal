import React, { useState, useRef, useEffect } from 'react';
import Stepper from '../components/Stepper';

import { StepperContext } from '../context/StepperContext';
import { getDownloadURL } from "firebase/storage";
import UploadID from '../components/steps_Residency/UploadID';
import PersonalInfo from '../components/steps_Residency/PersonalInfo';
import ResidencyAddress from '../components/steps_Residency/ResidencyAddress';
import Final from '../components/steps_Residency/Final';
import Payment from '../components/steps_Residency/Payment';
import StepperControlResidency from '../components/StepperControlResidency'

import { storage } from "../../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path based on your folder structure

function ResidencyPage({numberOfCopies}) {

    const [currentStep, setCurrentStep] = useState(1);
    const [userData, setUserData] = useState({
        "fullname": "",
        "sex": "",
        "residency-purpose": "",
        "house-bldg-number": "",
        "building-name": "",
        "lot-number": "",
        "subdivision": "",
        "street": "",
        "region": "",
        "province": "",
        "city": "",
        "barangay": "",
        "government-id": "",
        "proof-of-payment" : "",
        "reference-number" : "",
        "date-of-payment" : "",
        "document-type" : "Residency",
        "number-of-copies" : numberOfCopies
    });
    const [finalData, setFinalData] = useState([]);
    const [personalInfoFieldsComplete, setPersonalInfoFieldsComplete] = useState(false);
    const [residencyAddressFieldsComplete, setresidencyAddressFieldsComplete] = useState(false);
    const [uploadIDFieldsComplete, setuploadIDFieldsComplete] = useState(false);
    const [paymentFieldsComplete, setPaymentFieldsComplete] = useState(false);

    const steps = [
        "Personal Information",
        "Address",
        "Upload",
        "Payment",
        "Complete"
    ];

    const handlePersonalInfoFieldsComplete = (isComplete) => {
        setPersonalInfoFieldsComplete(isComplete);
    };

    const handleresidencyAddressFieldsComplete = (isComplete) => {
        setresidencyAddressFieldsComplete(isComplete);
    };

    const handleuploadIDFieldsComplete = (isComplete) => {
        setuploadIDFieldsComplete(isComplete);
    };

    const handPaymentIDFieldsComplete = (isComplete, uploadFieldComplete) => {
        setPaymentFieldsComplete(isComplete & uploadFieldComplete);
    };

    const handlePaymentFieldsComplete = (isComplete, uploadFieldComplete) => {
        setPaymentFieldsComplete(isComplete && uploadFieldComplete);
      };
      

    const displayStep = (step) => {
        switch (step) {
            case 1:
                return <PersonalInfo triggerHighlight={triggerHighlight} handlePersonalInfoFieldsComplete={handlePersonalInfoFieldsComplete} passInputDataToParent={passInputDataToParent}/>;
            case 2:                      
                return <ResidencyAddress triggerHighlight={triggerHighlight} handleResidencyAddressFieldsComplete={handleresidencyAddressFieldsComplete} passInputDataToParent={passInputDataToParent}/>;
            case 3:
                return <UploadID triggerHighlight={triggerHighlight} handleUploadIDComplete={handleuploadIDFieldsComplete} passIdToParent={handleUploadedIdFiles}/>;
            case 4:
                return <Payment triggerHighlight={triggerHighlight} handlePaymentFieldsComplete = {handPaymentIDFieldsComplete} passInputDataToParent={passInputDataToParent} passPaymentToParent={handleUploadedPaymentFiles}/>;
            case 5:
                return <Final />;
            default:
                return null;
        }
    };

    const handleClick = (direction) => {
        let newStep = currentStep;
    
        direction === "next" ? newStep++ : newStep--;
        // check if steps are within bounds
        newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
    };

    const handleGoBack = () => {
        // Redirect to the DocumentTypeSection page
        // Replace '/document-types' with the actual path of DocumentTypeSection
        window.location.href = '/';
    };

    const [inputData, setInputData] = useState({}); // Define inputData state as an empty object

    const passInputDataToParent = (inputData) => {
        console.log("Inputs Received in Parent Component:", inputData);
        setInputData(inputData); // Set inputData state
        // Do whatever you want with the inputData in the parent component
    };

    const [IdFiles, setIdFiles] = useState({}); // Define uploadedFiles state
    const handleUploadedIdFiles = (idFiles) => {
        console.log("Received ID Files from UploadID component:", idFiles);
        setIdFiles(idFiles);
    };
    const [paymentFiles, setPaymentFiles] = useState({}); // Define uploadedFiles state
    const handleUploadedPaymentFiles = (paymentFiles) => {
        console.log("Received Payment Files from Payment component:", paymentFiles);
        console.log("Received Id Files from Payment component:", IdFiles);
        setPaymentFiles(paymentFiles);
    };

    const uploadImages = async () => {
        try {
            const uniqueFolderId = uuidv4(); // Generate a unique ID for the folder
            const uploadPromises = [];
            const inputDataWithDownloadUrls = { ...inputData }; // Create a copy of inputData
    
            // Merge paymentFiles with uploadedFiles
            const allFiles = { ...IdFiles, ...paymentFiles };
    
            // Loop through each entry in allFiles
            Object.entries(allFiles).forEach(([fieldName, files]) => {
                // Check if the entry contains a file
                if (files) {
                    // If the files are paymentFiles, use 'proof-of-payment' as the fieldName
                    const field = fieldName === 'proof-of-payment' ? 'proof-of-payment' : fieldName;
                    files.forEach((file) => {
                        const imageRef = ref(storage, `Residency-Upload/${uniqueFolderId}/${file.name}`); // Use uniqueFolderId for folder structure
                        uploadPromises.push(
                            uploadBytes(imageRef, file).then(async (snapshot) => {
                                // Get the download URL for the uploaded file
                                const downloadURL = await getDownloadURL(snapshot.ref);
    
                                // Store the download URL in the inputData object
                                inputDataWithDownloadUrls[field] = downloadURL;
                            })
                        );
                    });
                }
            });
    
            // Wait for all files to be uploaded and download URLs to be obtained
            await Promise.all(uploadPromises);
    
            // Generate a unique ID for the document
            const docId = uuidv4();
    
            // Add the inputData with download URLs to Firestore
            await addDoc(collection(db, 'userData'), {
                [docId]: inputDataWithDownloadUrls
            });
    
            // Log success message
            console.log('Input data and download URLs uploaded successfully to Firestore');
        } catch (error) {
            // Log and handle errors
            console.error('Error uploading input data and download URLs to Firestore:', error);
        }
    };
    

    const receiveFilesFromUpload = (files) => {
        console.log("Received Files from Upload Component:");
    };

    const containerRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            // Trigger the "Next" button action
            const nextButton = document.querySelector('.next-button');
            if (nextButton) {
                nextButton.click();
            }
        }
    };

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.focus();
        }
    }, []);
    
    const [triggerHighlight, setTriggerHighlight] = useState(false);

    return (
        <>
            {/* Go Back to Request Page button */}
            <div className="text-left mt-8 ml-4">
                <button onClick={handleGoBack} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.707 6.293a1 1 0 1 1 1.414-1.414L3.414 8l3.707 3.707a1 1 0 0 1-1.414 1.414L1.586 8.707A1 1 0 0 1 1.586 7.293l4-4z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M11 5a1 1 0 0 0-1 1v2.586l-5.707-5.707A1 1 0 1 0 3.707 4.707L10 11.414V14a1 1 0 1 0 2 0V5z" clipRule="evenodd" />
                    </svg>
                    Go Back to Request Page
                </button>
            </div>

            <div 
                className="flex" 
                ref={containerRef} 
                tabIndex="0" 
                onKeyDown={handleKeyDown}
            >
                <div className="w-full md:w-1/2 mx-auto shadow-xl rounded-2xl pb-2 bg-white mt-8 mb-10 px-4 md:px-0">
                    <h1 className="text-3xl font-bold text-center mb-4 mt-8">Residency Form</h1>

                    {/*Stepper*/}
                    <div className="container horizontal mt-5">
                        <Stepper
                            steps={steps}
                            currentStep={currentStep}
                        />

                        {/* Display Components */}
                        <div className="my-10 p-10">
                            <StepperContext.Provider value={{
                                userData,
                                setUserData,
                                finalData,
                                setFinalData
                            }}>
                                {displayStep(currentStep)}
                            </StepperContext.Provider>
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    {currentStep !== steps.length &&
                        <StepperControlResidency
                            handleClick={handleClick}
                            currentStep={currentStep}
                            steps={steps}
                            personalInfoFieldsComplete={personalInfoFieldsComplete}
                            residencyAddressFieldsComplete = {residencyAddressFieldsComplete}
                            uploadIDFieldsComplete = {uploadIDFieldsComplete}
                            paymentFieldsComplete = {paymentFieldsComplete}
                        
                            inputData={inputData}
                            passIdToParent={handleUploadedIdFiles}
                            uploadImages={uploadImages}
                            
                            passPaymentToParent={handleUploadedPaymentFiles}  



                            receiveFilesFromUpload={receiveFilesFromUpload}  // send files to stepperControl
                        
                            IdFiles={IdFiles} // Pass IdFiles
                            paymentFiles={paymentFiles} // Pass paymentFiles
                            setTriggerHighlight={setTriggerHighlight}
                        />
                    }
                </div>
            </div>
        </>
    );
}

export default ResidencyPage;
