import React, { useState, useRef, useEffect } from 'react';
import Stepper from '../components/Stepper';

import Upload from '../components/steps_Business_Clearance/Upload';
import BusinessInfo from '../components/steps_Business_Clearance/BusinessInfo';
import Final from '../components/steps_Business_Clearance/Final';
import { StepperContext } from '../context/StepperContext';
import Address from '../components/steps_Business_Clearance/Address';
import PersonalDetails from '../components/steps_Business_Clearance/PersonalDetails';
import OwnerAddress from '../components/steps_Business_Clearance/OwnerAddress';
import Payment from '../components/steps_Business_Clearance/Payment';
import StepperControlBusinessClearance from '../components/StepperControlBusinessClearance';

import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path based on your folder structure

function BusinessClearancePage({ numberOfCopies }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [userData, setUserData] = useState({
        // Initialize userData with default values for all required fields
        "fsi-certificate": "",
        "health-permit": "",
        "zoning-clearance": "",
        "business-permit-or-license": "",
        "income-statements": "",
        "balance-sheets": "",
        "afp": "",
        "registration-type": "",
        "registration-number": "",
        "registration-date": "",
        "tin": "",
        "business-name": "",
        "trade-name": "",
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
        "surname": "",
        "given-name": "",
        "middle-name": "",
        "suffix": "",
        "sex": "",
        "owner-house-bldg-number": "",
        "owner-building-name": "",
        "owner-lot-number": "",
        "owner-subdivision": "",
        "owner-street": "",
        "owner-region": "",
        "owner-province": "",
        "owner-city": "",
        "owner-barangay": "",
        "document-type" : "Business Clearance",
        "number-of-copies" : numberOfCopies
    });

    const [finalData, setFinalData] = useState([]);
    const [uploadFieldsComplete, setUploadFieldsComplete] = useState(false);
    const [businessInfoFieldsComplete, setBusinessInfoFieldsComplete] = useState(false);
    const [addressInfoFieldsComplete, setAddressInfoFieldsComplete] = useState(false);
    const [personalDetailsFieldsComplete, setPersonalDetailsFieldsComplete] = useState(false);
    const [ownerAddressFieldsComplete, setOwnerAddressFieldsComplete] = useState(false);
    const [paymentFieldsComplete, setPaymentFieldsComplete] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [selectedFiles, setSelectedFiles] = useState({});
    const [inputData, setInputData] = useState({});
    const [idFiles, setIdFiles] = useState({});

    const steps = [
        "Upload Required Documents",
        "Business Information and Registration",
        "Business Location / Address",
        "Personal Details",
        "Owner Address",
        "Payment",
        "Complete"
    ];

    const handleUploadFieldsComplete = (isComplete) => {
        setUploadFieldsComplete(isComplete);
    };

    const handleBusinessInfoFieldsComplete = (isComplete) => {
        setBusinessInfoFieldsComplete(isComplete);
    };

    const handleAddressInfoFieldsComplete = (isComplete) => {
        setAddressInfoFieldsComplete(isComplete);
    };

    const handlePersonalDetailsFieldsComplete = (isComplete, isFileUploaded) => {
        setPersonalDetailsFieldsComplete(isComplete && isFileUploaded );
    };

    const handleOwnerAddressFieldsComplete = (isComplete) => {
        setOwnerAddressFieldsComplete(isComplete);
    };

    const handlePaymentFieldsComplete = (isComplete, isFileUploaded) => {
        setPaymentFieldsComplete(isComplete && isFileUploaded);
    };

    const handleSelectedFiles = (files) => {
        setSelectedFiles(files);
    };

    const passInputDataToParent = (inputData) => {
        setInputData(inputData);
    };

    const handleUploadedIdFiles = (idFiles) => {
        setIdFiles(idFiles);
    };

    const handleUploadedFiles = (files) => {
        setUploadedFiles(files);
    };

    const displayStep = (step) => {
        switch (step) {
            case 1: 
                return <Upload handleUploadFieldsComplete={handleUploadFieldsComplete} passFilesToParent={handleSelectedFiles} triggerHighlight={triggerHighlight}/>;
            case 2: 
                return <BusinessInfo handleBusinessInfoFieldsComplete={handleBusinessInfoFieldsComplete} passInputDataToParent={passInputDataToParent} triggerHighlight={triggerHighlight}/>;
            case 3: 
                return <Address handleAddressInfoFieldsComplete={handleAddressInfoFieldsComplete} passInputDataToParent={passInputDataToParent} triggerHighlight={triggerHighlight}/>;
            case 4: 
                return <PersonalDetails handlePersonalDetailsFieldsComplete={handlePersonalDetailsFieldsComplete} passInputDataToParent={passInputDataToParent} passIdToParent={handleUploadedIdFiles} triggerHighlight={triggerHighlight}/>;
            case 5: 
                return <OwnerAddress handleOwnerAddressFieldsComplete={handleOwnerAddressFieldsComplete} passInputDataToParent={passInputDataToParent} triggerHighlight={triggerHighlight}/>;
            case 6: 
                return <Payment handlePaymentFieldsComplete={handlePaymentFieldsComplete} passPaymentToParent={handleUploadedFiles} passInputDataToParent={passInputDataToParent} triggerHighlight={triggerHighlight}/>;
            case 7: 
                return <Final />;
            default:
                return null;
        }
    }

    const handleClick = (direction) => {
        let newStep = currentStep;
        direction === "next" ? newStep++ : newStep--;
        newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
    }

    const handleGoBack = () => {
        window.location.href = '/homepage';
    }

    const uploadImages = async () => {
        try {
            const uniqueFolderId = uuidv4();
            const uploadPromises = [];
            const inputDataWithDownloadUrls = { ...inputData };
    
            const allFiles = { ...uploadedFiles, ...selectedFiles, ...idFiles };
    
            Object.entries(allFiles).forEach(([fieldName, files]) => {
                if (Array.isArray(files)) {
                    files.forEach((file) => {
                        const imageRef = ref(storage, `BusinessClearance-Upload/${uniqueFolderId}/${file.name}`);
                        uploadPromises.push(
                            uploadBytes(imageRef, file).then(async (snapshot) => {
                                const downloadURL = await getDownloadURL(snapshot.ref);
                                inputDataWithDownloadUrls[fieldName] = downloadURL;
                            })
                        );
                    });
                } else {
                    console.warn(`Expected an array for field ${fieldName}, but got:`, files);
                }
            });
    
            await Promise.all(uploadPromises);
    
            const docId = uuidv4();
    
            await addDoc(collection(db, 'userData'), {
                [docId]: inputDataWithDownloadUrls
            });
    
            console.log('Input data and download URLs uploaded successfully to Firestore');
        } catch (error) {
            console.error('Error uploading input data and download URLs to Firestore:', error);
        }
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
            <div className="text-left mt-8 ml-4">
                <button onClick={handleGoBack} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center mt-">
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
                    <h1 className="text-3xl font-bold text-center mb-4 mt-8">Business Clearance Form</h1>
                    <div className="container horizontal mt-5">
                        <Stepper steps={steps} currentStep={currentStep} />
                        <div className="my-10 p-10">
                            <StepperContext.Provider value={{ userData, setUserData, finalData, setFinalData }}>
                                {displayStep(currentStep)}
                            </StepperContext.Provider>
                        </div>
                    </div>
                    {currentStep !== steps.length &&
                        <StepperControlBusinessClearance
                            handleClick={handleClick}
                            currentStep={currentStep}
                            steps={steps}
                            uploadFieldsComplete={uploadFieldsComplete}
                            businessInfoFieldsComplete={businessInfoFieldsComplete}
                            addressInfoFieldsComplete={addressInfoFieldsComplete}
                            personalDetailsComplete={personalDetailsFieldsComplete}
                            ownerAddressFieldsComplete={ownerAddressFieldsComplete}
                            paymentFieldsComplete={paymentFieldsComplete}
                            
                            uploadImages={uploadImages}
                            setTriggerHighlight={setTriggerHighlight}
                            
                        />
                    }
                </div>
            </div>
        </>
    );
}

export default BusinessClearancePage;
