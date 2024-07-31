import React, { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../context/StepperContext';

export default function BusinessInfo({ triggerHighlight, handleBusinessFieldsComplete, passInputDataToParent }) {
    const { userData, setUserData } = useContext(StepperContext);
    const [inputData, setInputData] = useState(userData);
    const [highlightedFields, setHighlightedFields] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputData({ ...inputData, [name]: value });
        passInputDataToParent(inputData); // Step 2: Pass data to parent
    };

    // Update userData when inputData changes
    useEffect(() => {
        setUserData(inputData);
    }, [inputData, setUserData]);

    // Check if all required fields are filled whenever userData changes
    useEffect(() => {
        const requiredFields = ['registration-type', 'registration-number', 'registration-date', 'tin', 'sss-number', 'business-name', 'trade-name'];
        const isComplete = requiredFields.every(fieldName => userData[fieldName] !== '');
        handleBusinessFieldsComplete(isComplete);

        if (triggerHighlight) {
            const emptyFields = requiredFields.filter(field => !userData[field]);
            setHighlightedFields(emptyFields);
          }
    }, [userData, handleBusinessFieldsComplete, triggerHighlight]);


    console.log("inputData:", inputData);

    useEffect(() => {
        passInputDataToParent(inputData);
    }, [inputData, passInputDataToParent]);

    return (
        <div className="flex flex-col">
            <div className="w-full mx-2 flex-1">
                <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
                    Please Choose One:
                </div>
                <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("registration-type") ? "border-red-500" : "border-gray-200"} rounded`}>

                    <input
                        onChange={handleChange}
                        value={userData["registration-type"] || ""}
                        name="registration-type"
                        placeholder="registration-type"
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                        required // Mark input as required
                    />
                </div>
            </div>
            
            
            <div className="w-full mx-2 flex-1">
                <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
                    DTI / SEC / CDA Registration Number:
                </div>
                <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("registration-number") ? "border-red-500" : "border-gray-200"} rounded`}>

                    <input
                        onChange={handleChange}
                        value={userData["registration-number"] || ""}
                        name="registration-number"
                        placeholder="registration-number"
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                        required
                    />
                </div>
            </div>

            <div className="w-full mx-2 flex-1">
                <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
                    Registration Date:
                </div>
                <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("registration-date") ? "border-red-500" : "border-gray-200"} rounded`}>

                    <input
                        onChange={handleChange}
                        value={userData["registration-date"] || ""}
                        name="registration-date"
                        placeholder="registration-date"
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                        required
                    />
                </div>
            </div>

            <div className="w-full mx-2 flex-1">
                <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
                    TAX Identification Number (TIN):
                </div>
                <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("tin") ? "border-red-500" : "border-gray-200"} rounded`}>

                    <input
                        onChange={handleChange}
                        value={userData["tin"] || ""}
                        name="tin"
                        placeholder="tin"
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                        required
                    />
                </div>
            </div>

            <div className="w-full mx-2 flex-1">
                <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
                    SSS No.
                </div>
                <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("sss-number") ? "border-red-500" : "border-gray-200"} rounded`}>

                    <input
                        onChange={handleChange}
                        value={userData["sss-number"] || ""}
                        name="sss-number"
                        placeholder="sss-number"
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                        required
                    />
                </div>
            </div>

            <div className="w-full mx-2 flex-1">
                <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
                    Business Name
                </div>
                <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("business-name") ? "border-red-500" : "border-gray-200"} rounded`}>

                    <input
                        onChange={handleChange}
                        value={userData["business-name"] || ""}
                        name="business-name"
                        placeholder="business-name"
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                        required
                    />
                </div>
            </div>

            <div className="w-full mx-2 flex-1">
                <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
                    Trade Name / Franchise (if applicable)
                </div>
                <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("trade-name") ? "border-red-500" : "border-gray-200"} rounded`}>

                    <input
                        onChange={handleChange}
                        value={userData["trade-name"] || ""}
                        name="trade-name"   
                        placeholder="trade-name"
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                        required
                    />
                </div>
            </div>
        </div>
    );
}
