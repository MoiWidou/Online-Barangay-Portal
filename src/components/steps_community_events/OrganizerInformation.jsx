import React, { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../context/StepperContext';

export default function OrganizerInformation({ triggerHighlight, handleOrganizerInformationFieldsComplete, passInputDataToParent }) {
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

  useEffect(() => {
    const requiredFields = ['event-organizer', 'organizer-contact-number', 'organizer-contact-email', 'organizer-address'];
    const isComplete = requiredFields.every(fieldName => userData[fieldName] !== '');
    handleOrganizerInformationFieldsComplete(isComplete);

    if (triggerHighlight) {
      const emptyFields = requiredFields.filter(field => !userData[field]);
      setHighlightedFields(emptyFields);
    } else {
      setHighlightedFields([]); // Clear highlights when triggerHighlight is false
    }
  }, [userData, handleOrganizerInformationFieldsComplete, triggerHighlight]);

  useEffect(() => {
    if (triggerHighlight) {
      const requiredFields = ['event-organizer', 'organizer-contact-number', 'organizer-contact-email', 'organizer-address'];
      const emptyFields = requiredFields.filter(field => !userData[field]);
      setHighlightedFields(emptyFields);
    }
  }, [triggerHighlight]);

  useEffect(() => {
    passInputDataToParent(inputData);
  }, [inputData, passInputDataToParent]);

  return (
    <div className="flex flex-col">
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Organization Name
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("event-organizer") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["event-organizer"] || ""}
            name="event-organizer"
            placeholder="Specify the name of the Organizer of The Event"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Contact Number of the Organizer
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("organizer-contact-number") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["organizer-contact-number"] || ""}
            name="organizer-contact-number"
            placeholder="Contact Details of the Organizer"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Email of the Organizer
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("organizer-contact-email") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["organizer-contact-email"] || ""}
            name="organizer-contact-email"
            placeholder="Email of the Organizer"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Address of the Organizer
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("organizer-address") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["organizer-address"] || ""}
            name="organizer-address"
            placeholder="Specify the Address of the Organizer"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>
    </div>
  );
}
