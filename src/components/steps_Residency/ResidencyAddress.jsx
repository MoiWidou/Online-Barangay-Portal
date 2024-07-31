import React, { useState, useEffect, useContext } from 'react';
import { StepperContext } from '../../context/StepperContext';

export default function ResidencyAddress({ triggerHighlight, handleResidencyAddressFieldsComplete, passInputDataToParent}) {
  const { userData, setUserData } = useContext(StepperContext);
  const [inputData, setInputData] = useState(userData);
  const [highlightedFields, setHighlightedFields] = useState([]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
    passInputDataToParent(inputData); // Step 2: Pass data to parent
  
    if (value.trim() !== '') {
      setHighlightedFields(prev => prev.filter(field => field !== name));
    }
  };

  useEffect(() => {
    setUserData(inputData);
  }, [inputData, setUserData]);


// Check if all required fields are filled whenever userData changes
useEffect(() => {
  const requiredFields = ['house-bldg-number', 'building-name',
   'lot-number', 'subdivision', 'street', 'region', 'province'
  , 'city', 'barangay'];
  
  const isComplete = requiredFields.every(fieldName => userData[fieldName] !== '');
  handleResidencyAddressFieldsComplete(isComplete);

  if (triggerHighlight) {
    const emptyFields = requiredFields.filter(field => !userData[field]);
    setHighlightedFields(emptyFields);
  }
}, [userData, handleResidencyAddressFieldsComplete, triggerHighlight]);

useEffect(() => {
  passInputDataToParent(inputData);
}, [inputData, passInputDataToParent]);

  return (
    <div className="flex flex-col">
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            House / Bldg. No
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("house-bldg-number") ? "border-red-500" : "border-gray-200"} rounded`}>

          <input
            onChange={handleChange}
            value={userData["house-bldg-number"] || ""}
            name="house-bldg-number"
            placeholder="house-bldg-number"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            required
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Name of Building
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("building-name") ? "border-red-500" : "border-gray-200"} rounded`}>

          <input
            onChange={handleChange}
            value={userData["building-name"] || ""}
            name="building-name"
            placeholder="building-name"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            required
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Lot No.
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("lot-number") ? "border-red-500" : "border-gray-200"} rounded`}>

          <input
            onChange={handleChange}
            value={userData["lot-number"] || ""}
            name="lot-number"
            placeholder="lot-number"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            required
          />
        </div>
      </div>
      
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Subdivision
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("subdivision") ? "border-red-500" : "border-gray-200"} rounded`}>

          <input
            onChange={handleChange}
            value={userData["subdivision"] || ""}
            name="subdivision"
            placeholder="subdivision"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            required
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Street
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("street") ? "border-red-500" : "border-gray-200"} rounded`}>

          <input
            onChange={handleChange}
            value={userData["street"] || ""}
            name="street"
            placeholder="street"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            required
          />
        </div>
      </div>
     
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Region
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("region") ? "border-red-500" : "border-gray-200"} rounded`}>

          <input
            onChange={handleChange}
            value={userData["region"] || ""}
            name="region"
            placeholder="region"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            required
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Province
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("province") ? "border-red-500" : "border-gray-200"} rounded`}>

          <input
            onChange={handleChange}
            value={userData["province"] || ""}
            name="province"   
            placeholder="province"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            required
          />
        </div>
      </div>
  
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            City
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("city") ? "border-red-500" : "border-gray-200"} rounded`}>

          <input
            onChange={handleChange}
            value={userData["city"] || ""}
            name="city"   
            placeholder="city"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            required          
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Barangay
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("barangay") ? "border-red-500" : "border-gray-200"} rounded`}>
        
          <input
            onChange={handleChange}
            value={userData["barangay"] || ""}
            name="barangay"   
            placeholder="barangay"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            required
          />
        </div>
      </div>

      

    </div>
  );
}