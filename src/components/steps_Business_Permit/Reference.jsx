import React, { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../context/StepperContext';
import {storage} from "../../../firebase";
import {ref, uploadBytes} from "firebase/storage";




export default function Upload({ handleUploadComplete }) {

    const { userData, setUserData } = useContext(StepperContext);
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [allFilesUploaded, setAllFilesUploaded] = useState(false);

    useEffect(() => {
        // Check if all required files are uploaded
        const requiredFiles = ['proof-of-business', 'contract-of-lease', 'picture-establishment', 'photos-business-loc', 'brgy-business-clearance', 'others-specify'];
        const filesUploaded = requiredFiles.every(fieldName => uploadedFiles[fieldName]);
        setAllFilesUploaded(filesUploaded);
    }, [uploadedFiles]);

    const handleChange = (e, fieldName) => {
        if (e && e.target && e.target.files) {
            const file = e.target.files[0];
            setUploadedFiles({
                ...uploadedFiles,
                [fieldName]: file ? file.name : null
            });
            setUserData({
                ...userData,
                uploadedFiles: {
                    ...userData.uploadedFiles,
                    [fieldName]: file
                }
            });
    };
    }

    useEffect(() => {
        if (allFilesUploaded) {
            handleUploadComplete(true);
        } else {
            handleUploadComplete(false);
        }
    }, [allFilesUploaded, handleUploadComplete]);

    const [imageUpload, setImageUpload] = useState(null);

    const uploadImage = () => {
        if (imageUpload == null) return;
        const imageRef = ref(storage, `BusinessPermit-Upload/${imageUpload.name }`);
        uploadBytes(imageRef, imageUpload ).then (() => {
            alert("File Uploaded");
        });
    };

    return (
        <div className='flex flex-col'>
        

            <div className='w-full mx-2 flex-1 '>
                <div className='font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase '>
                    
                    Upload the Following:
                </div>
                <div className='w-full mx-2 flex-1 '>
            
                <ul className='uploadList'>
                    
                    <li className='flex justify-between items-center mb-8'>
                        
                        <span className='text-sm sm:text-base'>Proof of Business Registration (DTI for Sole Proprietorship/SEC <br></br>for Corporations and Partnership / CDA for Cooperatives)</span>
                        <div className='flex items-center overflow-hidden whitespace-nowrap'>
                        <input
                            className='bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2'
                            type='file'
                            onChange={(event) => {
                                setImageUpload(event.target.files[0]);
                                // Optionally, update the uploadedFiles state as well
                                setUploadedFiles({
                                    ...uploadedFiles,
                                    ['proof-of-business']: event.target.files[0] ? event.target.files[0].name : "No File Uploaded"
                                });
                            }}
                        />
                            <button className= 'bg-red-500' onClick={uploadImage}>Submit</button>

                            <span className='text-sm sm:text-base uploaded-files truncate'></span>
                        </div>
                    </li>

                    <li className='flex justify-between items-center mb-8'>
                        <span className='text-sm sm:text-base'>Contract of Lease ( if leased ) or Tax Declaration (if owned) </span>
                        <div className='flex items-center overflow-hidden whitespace-nowrap'>
                            <input
                                type='file'
                                id='contract-of-lease'
                                name='contract-of-lease'
                                className='hidden'
                                onChange={(e) => handleChange(e, 'contract-of-lease')}
                            />
                            <label
                                htmlFor='contract-of-lease'
                                className='bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2'
                            >
                                Choose File
                            </label>
                            <span className='text-sm sm:text-base uploaded-files truncate'>{uploadedFiles['contract-of-lease'] ? uploadedFiles['contract-of-lease'] : "No File Uploaded"}</span>
                        </div>
                    </li>

                    <li className='flex justify-between items-center mb-8'>
                        <span className='text-sm sm:text-base'>Picture of Establishment</span>
                        <div className='flex items-center overflow-hidden whitespace-nowrap'>
                            <input
                                type='file'
                                id='picture-establishment'
                                name='picture-establishment'
                                className='hidden'
                                onChange={(e) => handleChange(e, 'picture-establishment')}
                            />
                            <label
                                htmlFor='picture-establishment'
                                className='bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2'
                            >
                                Choose File
                            </label>
                            <span className='text-sm sm:text-base uploaded-files truncate'>{uploadedFiles['picture-establishment'] ? uploadedFiles['picture-establishment'] : "No File Uploaded"}</span>
                        </div>
                    </li>

                    <li className='flex justify-between items-center mb-8'>
                        <span className='text-sm sm:text-base'>Sketch and Photos of location of Business</span>
                        <div className='flex items-center overflow-hidden whitespace-nowrap'>
                            <input
                                type='file'
                                id='photos-business-loc'
                                name='photos-business-loct'
                                className='hidden'
                                onChange={(e) => handleChange(e, 'photos-business-loc')}
                            />
                            <label
                                htmlFor='photos-business-loc'
                                className='bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2'
                            >
                                Choose File
                            </label>
                            <span className='text-sm sm:text-base uploaded-files truncate'>{uploadedFiles['photos-business-loc'] ? uploadedFiles['photos-business-loc'] : "No File Uploaded"}</span>
                        </div>
                    </li>
                    
                    <li className='flex justify-between items-center mb-8'>
                        <span className='text-sm sm:text-base'>Barangay Business Clearance</span>
                        <div className='flex items-center overflow-hidden whitespace-nowrap'>
                            <input
                                type='file'
                                id='brgy-business-clearance'
                                name='brgy-business-clearance'
                                className='hidden'
                                onChange={(e) => handleChange(e, 'brgy-business-clearance')}
                            />
                            <label
                                htmlFor='brgy-business-clearance'
                                className='bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2'
                            >
                                Choose File
                            </label>
                            <span className='text-sm sm:text-base uploaded-files truncate'>{uploadedFiles['brgy-business-clearance'] ? uploadedFiles['brgy-business-clearance'] : "No File Uploaded"}</span>
                        </div>
                    </li>
                    
                    <li className='flex justify-between items-center'>
                        <span className='text-sm sm:text-base'>Others, please specify</span>
                        <div className='flex items-center overflow-hidden whitespace-nowrap'>
                            <input
                                type='file'
                                id='others-specify'
                                name='others-specify'
                                className='hidden'
                                onChange={(e) => handleChange(e, 'others-specify')}
                            />
                            <label
                                htmlFor='others-specify'
                                className='bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2'
                            >
                                Choose File
                            </label>
                            <span className='text-sm sm:text-base uploaded-files truncate'>{uploadedFiles['others-specify'] ? uploadedFiles['others-specify'] : "No File Uploaded"}</span>
                            
                        </div>
                       
                    </li>

                </ul>
            </div>
                
            </div>
        </div>
    )
}

