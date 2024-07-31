import React, { useEffect, useContext, useState } from 'react';
import { StepperContext } from '../../context/StepperContext';

export default function UploadID({ triggerHighlight, handleUploadIDComplete, passIdToParent }) {
    const { userData, setUserData } = useContext(StepperContext);
    const [IdFiles, setIdFiles] = useState({});
    const [allFilesUploaded, setAllFilesUploaded] = useState(false); // Define allFilesUploaded state
    const [highlightedFields, setHighlightedFields] = useState([]);

    const passIdToParentFunction = () => {
        // Pass the proof of payment to the parent component
        passIdToParent(IdFiles);
    };

    useEffect(() => {
        // Logic that depends on the updated uploadedFiles state
        passIdToParentFunction();
        console.log("Selected Files:", IdFiles);
        
    }, [IdFiles]);

    useEffect(() => {
        // Check if all required files are uploaded
        const requiredFiles = ['government-id'];
        const filesUploaded = requiredFiles.every(fieldName => IdFiles[fieldName] && IdFiles[fieldName].length > 0);
        setAllFilesUploaded(filesUploaded);
        
        if (triggerHighlight) {
            const emptyFields = requiredFiles.filter(field => !IdFiles[field] || IdFiles[field].length === 0);
            setHighlightedFields(emptyFields);
        }
    }, [IdFiles, triggerHighlight]);

    const handleChange = (e, fieldName) => {
        const file = e.target.files[0];
        const updatedFiles = {
            ...IdFiles,
            [fieldName]: file ? [file] : null, // Always set as an array
        };
        setIdFiles(updatedFiles); // Update the uploadedFiles state

        if (file) {
            setHighlightedFields(prev => prev.filter(field => field !== fieldName));
        }
    };

    useEffect(() => {
        if (allFilesUploaded) {
            handleUploadIDComplete(true);
        } else {
            handleUploadIDComplete(false);
        }
    }, [allFilesUploaded, handleUploadIDComplete]);


    const handleCancelUpload = (fieldName, fileName) =>     {
        setIdFiles({
            ...IdFiles,
            [fieldName]: IdFiles[fieldName].filter(file => file.name !== fileName)
        });
    };

      useEffect(() => {
        passIdToParent(IdFiles); // Pass data to parent whenever inputData changes
    }, [passIdToParent]);

    return (
        <div className='flex flex-col'>
            <div className='w-full mx-2 flex-1'>
                <div className='font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase'>
                    Upload the Following:
                </div>
                <ul className='uploadList'>
                <div className={`w-full mx-2 flex-1 border rounded-md py-1 px-2 ${highlightedFields.includes("government-id") ? "border-red-500" : "border-gray-200"} rounded`}>

                <li className='flex justify-between items-center mb-8'>
                            <span className='text-sm sm:text-base mt-[10px] '>Government Issued ID: </span>
                            <input
                                type='file'
                                id='government-id-input'
                                name='government-id-input'
                                className='hidden'
                                onChange={(e) => handleChange(e, 'government-id')}
                                required // Mark as required
                            />
                            <label
                                htmlFor='government-id-input'
                                className='bg-blue-500 text-white py-1 px-2 rounded-md border border-gray-300 hover:bg-blue-600 cursor-pointer mr-2 mt-[10px] ml-auto'
                            >
                                Choose Files
                            </label>
                            <div>
                            {IdFiles['government-id'] && IdFiles['government-id'].map((file, index) => (
                                <div key={index} className="flex items-center bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2 mt-4">
                                    <p className="mr-2">{file.name}</p>
                                    <button className='ml-auto text-black-600 bg-red-600 w-[30px] rounded' onClick={() => handleCancelUpload('government-id', file.name)}>x</button>
                                </div>
                            ))}
                            </div>
                        </li>
                    </div>
                    
                </ul>
            </div>

        </div>
    )
}
