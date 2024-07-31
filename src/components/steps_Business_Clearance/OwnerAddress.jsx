import React, { useContext, useEffect, useState } from 'react';
import { StepperContext } from '../../context/StepperContext';

export default function OwnerAddress({triggerHighlight, handleOwnerAddressFieldsComplete, passInputDataToParent}) {
  const { userData, setUserData } = useContext(StepperContext);
  const [inputData, setInputData] = useState(userData);
  const [highlightedFields, setHighlightedFields] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
    passInputDataToParent(inputData); // Pass updated data to parent component

    if (value.trim() !== '') {
      setHighlightedFields(prev => prev.filter(field => field !== name));
    }
  };

  useEffect(() => {
    setUserData(inputData);
  }, [inputData, setUserData]);

  useEffect(() => {
    passInputDataToParent(inputData);
  }, [inputData, passInputDataToParent]);

  useEffect(() => {
    const requiredFields = ["owner-house-bldg-number", "owner-building-name", "owner-lot-number", "owner-subdivision", "owner-street", "owner-region", "owner-province", "owner-city", "owner-barangay"];
    const isComplete = requiredFields.every(field => !!userData[field]);
    handleOwnerAddressFieldsComplete(isComplete);

    if (triggerHighlight) {
      const emptyFields = requiredFields.filter(field => !userData[field]);
      setHighlightedFields(emptyFields);
    }
  }, [userData, handleOwnerAddressFieldsComplete, triggerHighlight]);

  return (
    <div className="flex flex-col">
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            House / Bldg. No
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("owner-house-bldg-number") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["owner-house-bldg-number"] || ""}
            name="owner-house-bldg-number"
            placeholder="owner-house-bldg-number"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Name of Building
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("owner-building-name") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["owner-building-name"] || ""}
            name="owner-building-name"
            placeholder="owner-building-name"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Lot No.
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("owner-lot-number") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["owner-lot-number"] || ""}
            name="owner-lot-number"
            placeholder="owner-lot-number"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>
      
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Subdivision
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("owner-subdivision") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["owner-subdivision"] || ""}
            name="owner-subdivision"
            placeholder="owner-subdivision"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Street
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("owner-street") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["owner-street"] || ""}
            name="owner-street"
            placeholder="owner-street"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>
     
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Region
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("owner-region") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["owner-region"] || ""}
            name="owner-region"
            placeholder="owner-region"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Province
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("owner-province") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["owner-province"] || ""}
            name="owner-province"   
            placeholder="owner-province"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>
  
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            City
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("owner-city") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["owner-city"] || ""}
            name="owner-city"   
            placeholder="owner-city"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Barangay
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("owner-barangay") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["owner-barangay"] || ""}
            name="owner-barangay"   
            placeholder="owner-barangay"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      

    </div>
  );
}