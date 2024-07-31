import React, { useState, useRef, useEffect } from 'react';
import Stepper from '../components/Stepper';
import { StepperContext } from '../context/StepperContext';
import EventDetails from '../components/steps_community_events/EventDetails';
import UploadID from '../components/steps_community_events/UploadID';
import OrganizerInformation from '../components/steps_community_events/OrganizerInformation';
import ParticipantInformation from '../components/steps_community_events/ParticipantInformation';
import Final from '../components/steps_community_events/Final';
import Payment from '../components/steps_community_events/Payment';
import StepperControlCommunity from '../components/StepperControlCommunity';
import { getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path based on your folder structure
function CommunityEventsPage({numberOfCopies}) {

    const [currentStep, setCurrentStep] = useState(1);
    const [userData, setUserData] = useState({
        // Initialize userData with default values for all required fields
        "event-name": "",
        "event-purpose": "",
        "date-and-time-of-event": "",
        "event-venue": "",
        "event-description": "",
        "event-organizer": "",
        "organizer-contact-number": "",
        "organizer-contact-email": "",
        "organizer-address": "",
        "participant-number": "",
        "participant-target": "",
        "participant-requirements": "",
        "government-id": "",
        "proof-of-payment" : "",
        "reference-number" : "",
        "date-of-payment" : "",
        "document-type" : "Community Events",
        "number-of-copies" : numberOfCopies
    });

    const [finalData, setFinalData] = useState([]);
    const [eventDetailsFieldsComplete, setEventDetailsFieldsComplete] = useState(false);
    const [organizerInformationFieldsComplete, setOrganizerInformationFieldsComplete] = useState(false);
    const [participantInformationFieldsComplete, setParticipantInformationFieldsComplete] = useState(false);
    const [allFilesUploaded, setAllFilesUploaded] = useState(false);
    const [paymentFieldsComplete, setpaymentFieldsComplete] = useState(false);
    const [triggerHighlight, setTriggerHighlight] = useState(false);
    
    const steps = [
        "Event Details",
        "Organizer Information",
        "Participant Information",
        "Id Documents",
        "Payment",
        "Complete"
    ];

    const handleEventDetailsFieldsComplete = (isComplete) => {
        setEventDetailsFieldsComplete(isComplete);
    };

    const handleOrganizerInformationFieldsComplete = (isComplete) => {
        setOrganizerInformationFieldsComplete(isComplete);
    };

    const handleParticipantInformationFieldsComplete = (isComplete) => {
        setParticipantInformationFieldsComplete(isComplete);
    };

    const handleUploadIDFieldsComplete = (isComplete) => {
        setAllFilesUploaded(isComplete);
    };

    const handlePaymentFieldsComplete = (isComplete, uploadFieldComplete) => {
        setpaymentFieldsComplete(isComplete && uploadFieldComplete);
    };

    const handleClick = (direction) => {
        let newStep = currentStep;
    
        direction === "next" ? newStep++ : newStep--;
        // check if steps are within bounds
        newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
    }

    const handleGoBack = () => {
        // Redirect to the DocumentTypeSection page
        // Replace '/document-types' with the actual path of DocumentTypeSection
        window.location.href = '/';
    }

    const [inputData, setInputData] = useState({}); // Define inputData state as an empty object

    const passInputDataToParent = (inputData) => {
        console.log("Inputs Received in Parent Component:", inputData);
        setInputData(inputData); // Set inputData state
        // Do whatever you want with the inputData in the parent component
    };

    const [IdFiles, setIdFiles] = useState({}); // Define uploadedFiles state
    const handleUploadedIdFiles = (IdFiles) => {
        console.log("Received ID Files from UploadID component:", IdFiles);
        setIdFiles(IdFiles);
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
                        const imageRef = ref(storage, `CommunityEvents-Upload/${uniqueFolderId}/${file.name}`); // Use uniqueFolderId for folder structure
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

    return (
        <>
            {/* Go Back to Request Page button */}
            <div className="text-left mt-8 ml-4">
                <button onClick={handleGoBack} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.707 6.293a1 1 0 1 1 1.414-1.414L3.414 8l3.707 3.707a1 1 0 0 1-1.414 1.414L1.586 8.707A1 1 0 0 1 1.586 7.293l4-4z" clipRule="evenodd"/>
                        <path fillRule="evenodd" d="M11 5a1 1 0 0 0-1 1v2.586l-5.707-5.707A1 1 0 1 0 3.707 4.707L10 11.414V14a1 1 0 1 0 2 0V5z" clipRule="evenodd"/>
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
                    <h1 className="text-3xl font-bold text-center mb-4 mt-8">Community and Events Form</h1>

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
                                {currentStep === 1 && <EventDetails handleEventDetailsFieldsComplete={handleEventDetailsFieldsComplete} passInputDataToParent={passInputDataToParent} triggerHighlight={triggerHighlight} />}
                                {currentStep === 2 && <OrganizerInformation handleOrganizerInformationFieldsComplete={handleOrganizerInformationFieldsComplete} passInputDataToParent={passInputDataToParent} triggerHighlight={triggerHighlight}/>}
                                {currentStep === 3 && <ParticipantInformation handleParticipantInformationFieldsComplete={handleParticipantInformationFieldsComplete} passInputDataToParent={passInputDataToParent} triggerHighlight={triggerHighlight}/>}
                                {currentStep === 4 && <UploadID handleUploadIDFieldsComplete={handleUploadIDFieldsComplete} passIdToParent={handleUploadedIdFiles} triggerHighlight={triggerHighlight}/>}
                                {currentStep === 5 && <Payment handlePaymentFieldsComplete={handlePaymentFieldsComplete} passPaymentToParent={handleUploadedPaymentFiles} passInputDataToParent={passInputDataToParent} triggerHighlight={triggerHighlight}/>}
                                {currentStep === 6 && <Final />}
                            </StepperContext.Provider>
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    {currentStep !== steps.length &&
                        <StepperControlCommunity
                            handleClick={handleClick}
                            currentStep={currentStep}
                            steps={steps}
                            eventDetailsFieldsComplete={eventDetailsFieldsComplete}
                            organizerInformationFieldsComplete={organizerInformationFieldsComplete}
                            participantInformationFieldsComplete={participantInformationFieldsComplete}
                            uploadIDFieldsComplete={allFilesUploaded}
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

export default CommunityEventsPage;
