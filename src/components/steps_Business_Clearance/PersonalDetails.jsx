import React, { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../context/StepperContext';

export default function PersonalDetails({ triggerHighlight, handlePersonalDetailsFieldsComplete, passInputDataToParent, passIdToParent }) {
  const { userData, setUserData } = useContext(StepperContext);
  const [inputData, setInputData] = useState(userData);
  const [IdFiles, setIdFiles] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({}); // State to track uploaded files
  const [isFileUploaded, setIsFileUploaded] = useState(false); // Define isFileUploaded state
  const [highlightedFields, setHighlightedFields] = useState([]);

  useEffect(() => {
    passIdToParent(IdFiles); // Pass the proof of payment to the parent component whenever IdFiles changes
  }, [IdFiles, passIdToParent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData(prevInputData => ({ ...prevInputData, [name]: value }));
    passInputDataToParent(inputData); // Step 2: Pass data to parent

    if (value.trim() !== '') {
      setHighlightedFields(prev => prev.filter(field => field !== name));
    }
  };

  useEffect(() => {
    setUserData(inputData);
  }, [inputData, setUserData]);

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setIdFiles(prevIdFiles => ({
      ...prevIdFiles,
      [fieldName]: file ? [file] : [], // Set as an array with the file or an empty array if no file is selected

      if (file) {
        setHighlightedFields(prev => prev.filter(field => field !== fieldName));
      }
    }));
  
    // Set isFileUploaded to true when a file is uploaded
    setIsFileUploaded(true);
  };

  
  useEffect(() => {
    // Check if all required fields are filled
    const requiredFields = ["surname", "given-name", "middle-name", "suffix", "sex"];
    const isComplete = requiredFields.every(field => !!userData[field]);

    // Check if the file is uploaded


    handlePersonalDetailsFieldsComplete(isComplete, isFileUploaded);
    console.log("isFileUploaded state: ", isFileUploaded)

    if (triggerHighlight) {
      const emptyFields = requiredFields.filter(field => !userData[field]);
      if (!isFileUploaded) {
        emptyFields.push('government-id');
      }
      setHighlightedFields(emptyFields);
    }

  }, [userData, isFileUploaded, triggerHighlight, handlePersonalDetailsFieldsComplete, [IdFiles['government-id']]]);

  const handleCancelUpload = (fieldName, fileName) => {
    const updatedIdFiles = {
      ...IdFiles,
      [fieldName]: IdFiles[fieldName].filter(file => file.name !== fileName)
    };
  
    // Check if any files are remaining after canceling upload
    const isFileUploaded = !!updatedIdFiles[fieldName].length;
  
    setIdFiles(updatedIdFiles);
    setIsFileUploaded(isFileUploaded);
    console.log("isFileUploaded state: ", isFileUploaded)
  };
  
  return (
    <div className="flex flex-col">
      {/* Input fields for personal details */}
      {/* Surname */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Surname  
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("surname") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["surname"] || ""}
            name="surname"
            placeholder="Surname"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            required
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Given Name
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("given-name") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["given-name"] || ""}
            name="given-name"
            placeholder="Your given name"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Middle Name:
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("middle-name") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["middle-name"] || ""}
            name="middle-name"
            placeholder="Your Middle Name"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>
      
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Suffix
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("suffix") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["suffix"] || ""}
            name="suffix"
            placeholder="Your Suffix"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Sex
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("sex") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["sex"] || ""}
            name="sex"
            placeholder="Male / Female / Others"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>
      <div className={`w-full mx-2 flex-1 border rounded-md py-1 px-2 ${highlightedFields.includes("government-id") ? "border-red-500" : "border-white"}`}>
       
        <ul>
          <li className='flex justify-between items-center mb-8'>
            <span className='text-sm sm:text-base mt-[10px] '>Government Issued ID: </span>
            <input
                type='file'
                id='government-id-input'
                name='government-id-input'
                className='hidden'
                onChange={(e) => handleFileChange(e, 'government-id')}
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
