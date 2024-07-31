import React, { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../context/StepperContext';
import { storage } from "../../../firebase";
import { ref, uploadBytes } from "firebase/storage";


export default function Upload({ triggerHighlight, handleUploadComplete, passFilesToParent}) {
    const { userData, setUserData } = useContext(StepperContext);
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [allFilesUploaded, setAllFilesUploaded] = useState(false); // State to track all files uploaded
    const [selectedFiles, setSelectedFiles] = useState({
        'proof-of-business': [],
        'contract-of-lease': [],
        'picture-of-establishment': [], 
        'barangay-business-clearance' : []
    });
    const [highlightedFields, setHighlightedFields] = useState([]);

    const passFilesToParentFunction = () => {
        // Pass the selected files to the parent component
        passFilesToParent(selectedFiles);
    };


    useEffect(() => {
        // Update parent component when all required files are uploaded
        if (allFilesUploaded) {
            handleUploadComplete(true);
        } else {
            handleUploadComplete(false);
        }
    }, [allFilesUploaded, handleUploadComplete]);
    
    useEffect(() => {   
        // Check if all required files are uploaded
        const requiredFiles = [
            'proof-of-business',
            'contract-of-lease',
            'picture-of-establishment',
            'barangay-business-clearance'
        ];

        // Check if all required files are uploaded for each field
        const allFilesUploaded = requiredFiles.every(fieldName => {
            return selectedFiles[fieldName].length > 0;
        });

        // Log selectedFiles and allFilesUploaded
        console.log("Selected Files:", selectedFiles);
        console.log("All Files Uploaded:", allFilesUploaded);

        // Set the allFilesUploaded state
        setAllFilesUploaded(allFilesUploaded);

        if (triggerHighlight) {
            const emptyFields = requiredFiles.filter(field => !selectedFiles[field] || selectedFiles[field].length === 0);
            setHighlightedFields(emptyFields);
            console.log("Updated Highlighted Fields:", emptyFields); // Add this console log
          } else {
            setHighlightedFields([]); // Clear highlights if triggerHighlight is false
          }
    }, [selectedFiles, triggerHighlight]);

    // Function to handle file input change
    const handleChange = (e, fieldName) => {
        if (e && e.target && e.target.files) {
            const files = Array.from(e.target.files);
            console.log("Selected files:", files); // Log selected files
            setSelectedFiles((prevSelectedFiles) => ({
                ...prevSelectedFiles,
                [fieldName]: files
            }));
            passFilesToParentFunction(selectedFiles); // Call the function to pass selected files to the parent
            // Check if all required files are uploaded
            const requiredFiles = [
                'proof-of-business',
                'contract-of-lease',
                'picture-of-establishment',
                'barangay-business-clearance'
            ];
    
            // Check if all required files are uploaded for each field
            const allFilesUploaded = requiredFiles.every(fieldName => {
                return selectedFiles[fieldName].length > 0;
            });

            console.log("All Files Uploaded:", allFilesUploaded);
    
            // Set the allFilesUploaded state
            setAllFilesUploaded(allFilesUploaded);

            if (triggerHighlight) {
                const requiredFields = [
                    'proof-of-business',
                    'contract-of-lease',
                    'picture-of-establishment',
                    'barangay-business-clearance'
                ];
                if (requiredFields.includes(fieldName)) {
                    setHighlightedFields(prev => prev.filter(field => field !== fieldName));
                }
            }
        }
    };
    
    // Function to handle cancellation of upload
    const handleCancelUpload = (fieldName, fileName) =>     {
        setSelectedFiles({
            ...selectedFiles,
            [fieldName]: selectedFiles[fieldName].filter(file => file.name !== fileName)
        });
    };

    useEffect(() => {
        // Pass the selected files to the parent component
        passFilesToParent(selectedFiles);

    }, [selectedFiles, passFilesToParent]);
    


    return (
        <div className='flex flex-col'>
            
            <div className='w-full mx-2 flex-1 '>
                
                <div className='font-bold h-6 text-gray-500 text-xs leading-8 uppercase '>
                    Upload the Following:
                </div>
                <div className='w-full mx-2 flex-1 '>
                    <ul className='uploadList'>
                    <div className={`w-full mx-2 flex-1 border rounded-md py-1 px-2 ${highlightedFields.includes("proof-of-business") ? "border-red-500" : "border-white"}`}>     
                        <li className='flex justify-between items-center mb-8'>
                            <span className='text-sm sm:text-base mt-[10px] '>*Proof of Business Registration (DTI/SEC/CDA)</span>
                            <input
                                type='file'
                                id='proof-of-business-input'
                                name='proof-of-business-input'
                                className='hidden'
                                onChange={(e) => handleChange(e, 'proof-of-business')}
                                required // Mark as required
                            />
                            <label
                                htmlFor='proof-of-business-input'
                                className='bg-blue-500 text-white py-1 px-2 rounded-md border border-gray-300 hover:bg-blue-600 cursor-pointer mr-2 mt-[10px] ml-auto'
                            >
                                Choose Files
                            </label>
                            <div>
                                {selectedFiles['proof-of-business'].map((file, index) => (
                                    <div key={index} className="flex items-center bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2 mt-4 ">
                                        <p className="mr-2">{file.name}</p>
                                        <button className='ml-auto text-black-600 bg-red-600 w-[30px] rounded' onClick={() => handleCancelUpload('proof-of-business', file.name)}>x</button>
                                    </div>
                                ))}
                            </div>
                        </li>
                    </div>

                    <div className={`w-full mx-2 flex-1 border rounded-md py-1 px-2 ${highlightedFields.includes("contract-of-lease") ? "border-red-500" : "border-white"}`}>     

                        {/* Contract of Lease */}
                        <li className='flex justify-between items-center mb-8'>
                            <span className='text-sm sm:text-base mt-[10px] '>*Contract of Lease ( if leased ) or<br></br> Tax Declaration (if owned)</span>
                            <input
                                type='file'
                                id='contract-of-lease-input'
                                name='contract-of-lease-input'
                                className='hidden'
                                onChange={(e) => handleChange(e, 'contract-of-lease')}
                                required // Mark as required
                            />
                            <label
                                htmlFor='contract-of-lease-input'
                                className='bg-blue-500 text-white py-1 px-2 rounded-md border border-gray-300 hover:bg-blue-600 cursor-pointer mr-2 mt-[10px] ml-auto'
                            >
                                Choose Files
                            </label>
                            <div>
                                {selectedFiles['contract-of-lease'].map((file, index) => (
                                    <div key={index} className="flex items-center bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2 mt-4">
                                        <p className="mr-2">{file.name}</p>
                                        <button className='ml-auto text-black-600 bg-red-600 w-[30px] rounded' onClick={() => handleCancelUpload('contract-of-lease', file.name)}>x</button>
                                    </div>
                                ))}
                            </div>
                        </li>
                    </div>              
                        {/* New list for Picture of Establishment */}
                        <div className={`w-full mx-2 flex-1 border rounded-md py-1 px-2 ${highlightedFields.includes("picture-of-establishment") ? "border-red-500" : "border-white"}`}>     
                    
                        <li className='flex justify-between items-center mb-8'>
                            <span className='text-sm sm:text-base mt-[10px] '>*Picture of Establishment</span>
                            <input
                                type='file'
                                id='picture-establishment-input'
                                name='picture-establishment-input'
                                className='hidden'
                                onChange={(e) => handleChange(e, 'picture-of-establishment')}
                                required // Mark as required
                            />
                            <label
                                htmlFor='picture-establishment-input'
                                className='bg-blue-500 text-white py-1 px-2 rounded-md border border-gray-300 hover:bg-blue-600 cursor-pointer mr-2 mt-[10px] ml-auto'
                            >
                                Choose Files
                            </label>
                            <div>
                                {selectedFiles['picture-of-establishment'].map((file, index) => (
                                    <div key={index} className="flex items-center bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2 mt-4">
                                        <p className="mr-2">{file.name}</p>
                                        <button className='ml-auto text-black-600 bg-red-600 w-[30px] rounded' onClick={() => handleCancelUpload('picture-of-establishment', file.name)}>x</button>
                                    </div>
                                ))}
                            </div>
                        </li>
                    </div>

                    <div className={`w-full mx-2 flex-1 border rounded-md py-1 px-2 ${highlightedFields.includes("barangay-business-clearance") ? "border-red-500" : "border-white"}`}>     

                        <li className='flex justify-between items-center mb-8'>
                            <span className='text-sm sm:text-base mt-[10px] '>*Barangay Business Clearance</span>
                            <input
                                type='file'
                                id='barangay-business-clearance-input'
                                name='barangay-business-clearance-input'
                                className='hidden'
                                onChange={(e) => handleChange(e, 'barangay-business-clearance')}
                                required // Mark as required
                            />
                            <label
                                htmlFor='barangay-business-clearance-input'
                                className='bg-blue-500 text-white py-1 px-2 rounded-md border border-gray-300 hover:bg-blue-600 cursor-pointer mr-2 mt-[10px] ml-auto'
                            >
                                Choose Files
                            </label>
                            <div>
                                {selectedFiles['barangay-business-clearance'].map((file, index) => (
                                    <div key={index} className="flex items-center bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2 mt-4">
                                        <p className="mr-2">{file.name}</p>
                                        <button className='ml-auto text-black-600 bg-red-600 w-[30px] rounded' onClick={() => handleCancelUpload('barangay-business-clearance', file.name)}>x</button>
                                    </div>
                                ))}
                            </div>
                        </li>
                    </div>
                        <div>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    );
}
