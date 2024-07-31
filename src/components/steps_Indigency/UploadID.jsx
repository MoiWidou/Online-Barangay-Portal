import React, { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../context/StepperContext';

export default function Upload({ triggerHighlight, handleUploadIDComplete, passIdToParent }) {
    const { userData, setUserData } = useContext(StepperContext);
    const [IdFiles, setIdFiles] = useState({});
    const [allFilesUploaded, setAllFilesUploaded] = useState(false);
    const [highlightedFields, setHighlightedFields] = useState([]);

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

    useEffect(() => {
        // Logic that depends on the updated IdFiles state
        passIdToParent(IdFiles);
        console.log("Selected Files:", IdFiles);
        
    }, [IdFiles]);

    useEffect(() => {
        if (allFilesUploaded) {
            handleUploadIDComplete(true);
        } else {
            handleUploadIDComplete(false);
        }
    }, [allFilesUploaded, handleUploadIDComplete]);

    const handleChange = (e, fieldName) => {
        const file = e.target.files[0];
        const updatedFiles = {
            ...IdFiles,
            [fieldName]: file ? [file] : [], // Always set as an array
        };
        setIdFiles(updatedFiles); // Update the IdFiles state

        if (file) {
            setHighlightedFields(prev => prev.filter(field => field !== fieldName));
        } else {
            setHighlightedFields(prev => [...prev, fieldName]); // Highlight the field if empty
        }
    };

    const handleCancelUpload = (fieldName, fileName) => {
        const updatedFiles = IdFiles[fieldName].filter(file => file.name !== fileName);
        setIdFiles({
            ...IdFiles,
            [fieldName]: updatedFiles
        });

        if (updatedFiles.length === 0) {
            setHighlightedFields(prev => [...prev, fieldName]);
        } else {
            setHighlightedFields(prev => prev.filter(field => field !== fieldName)); // Remove highlight if a file is selected
        }
    };

    useEffect(() => {
        passIdToParent(IdFiles); // Pass data to parent whenever IdFiles changes
    }, [IdFiles, passIdToParent]);

    return (
        <div className='flex flex-col'>
            <div className='font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase'>
                Upload the Following:
            </div>
            <div className={`w-full mx-2 flex-1 border rounded-md py-1 px-2 ${highlightedFields.includes("government-id") ? "border-red-500" : "border-white"}`}>
                <ul className='uploadList'>
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
                </ul>
            </div>
        </div>
    );
}
