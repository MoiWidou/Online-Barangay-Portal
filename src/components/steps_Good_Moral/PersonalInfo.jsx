import React, { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../context/StepperContext';

export default function PersonalDetails({ triggerHighlight, handlePersonalInfoFieldsComplete, passInputDataToParent, passIdToParent }) {
  const { userData, setUserData } = useContext(StepperContext);
  const [inputData, setInputData] = useState(userData);
  const [IdFiles, setIdFiles] = useState({});
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [highlightedFields, setHighlightedFields] = useState([]);

  useEffect(() => {
    passIdToParent(IdFiles);
  }, [IdFiles, passIdToParent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData(prevInputData => ({ ...prevInputData, [name]: value }));
    passInputDataToParent(inputData);

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
      [fieldName]: file ? [file] : [],
    }));
    setIsFileUploaded(file ? true : false);

    if (file) {
      setHighlightedFields(prev => prev.filter(field => field !== fieldName));
    }
  };

  useEffect(() => {
    const requiredFields = ["fullname", "date-of-birth", "address", "contact-details", "good-moral-purpose"];
    const isComplete = requiredFields.every(field => !!userData[field]);
    handlePersonalInfoFieldsComplete(isComplete, isFileUploaded);

    if (triggerHighlight) {
      const emptyFields = requiredFields.filter(field => !userData[field]);
      if (!isFileUploaded) {
        emptyFields.push('government-id');
      }
      setHighlightedFields(emptyFields);
    }
  }, [userData, isFileUploaded, handlePersonalInfoFieldsComplete, triggerHighlight]);

  const handleCancelUpload = (fieldName, fileName) => {
    const updatedIdFiles = {
      ...IdFiles,
      [fieldName]: IdFiles[fieldName].filter(file => file.name !== fileName)
    };
    setIdFiles(updatedIdFiles);
    setIsFileUploaded(!!updatedIdFiles[fieldName].length);
  };

  return (
    <div className="flex flex-col">
      {/* Full Name */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Full Name
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("fullname") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["fullname"] || ""}
            name="fullname"
            placeholder="Surname, First Name Middle Name"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            required
          />
        </div>
      </div>

      {/* Date of Birth */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Date of Birth
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("date-of-birth") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            type="date"
            onChange={handleChange}
            value={userData["date-of-birth"] || ""}
            name="date-of-birth"
            placeholder="MM-DD-YYYY"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/* Address */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Address
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("address") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["address"] || ""}
            name="address"
            placeholder="Your Address"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/* Contact Details */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Contact Details
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("contact-details") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["contact-details"] || ""}
            name="contact-details"
            placeholder="Your Contact Number/Email"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/* Purpose */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Purpose
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("good-moral-purpose") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["good-moral-purpose"] || ""}
            name="good-moral-purpose"
            placeholder="Purpose of Request"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      {/* Government Issued ID */}
      <div className={`w-full mx-2 flex-1 border rounded-md py-1 px-2 ${highlightedFields.includes("government-id") ? "border-red-500" : "border-white"}`}>
        <ul>
          <li className='flex justify-between items-center mb-8'>
            <span className='text-sm sm:text-base mt-[10px]'>Government Issued ID: </span>
            <input
              type='file'
              id='government-id-input'
              name='government-id-input'
              className='hidden'
              onChange={(e) => handleFileChange(e, 'government-id')}
              required
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
