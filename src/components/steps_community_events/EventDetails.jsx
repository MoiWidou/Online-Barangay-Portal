import React, { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../context/StepperContext';

export default function EventDetails({triggerHighlight, handleEventDetailsFieldsComplete, passInputDataToParent}) {
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

  //For the empty field highlights
  useEffect(() => {
    const requiredFields = ["event-name", "event-purpose", "date-and-time-of-event", "event-venue", "event-description"];
    const isComplete = requiredFields.every(field => !!userData[field]);
    handleEventDetailsFieldsComplete(isComplete);

    if (triggerHighlight) {
      const emptyFields = requiredFields.filter(field => !userData[field]);
      setHighlightedFields(emptyFields);
    }
  }, [userData, handleEventDetailsFieldsComplete, triggerHighlight]);

  // Check if all required fields are filled whenever userData changes
  useEffect(() => {
    const requiredFields = ['event-name', 'event-purpose', 'date-and-time-of-event', 'event-venue', 'event-description'];
    const isComplete = requiredFields.every(fieldName => userData[fieldName] !== '');
    handleEventDetailsFieldsComplete(isComplete);
  }, [userData, handleEventDetailsFieldsComplete]);

  useEffect(() => {
    passInputDataToParent(inputData);
  }, [inputData, passInputDataToParent]);

  return (
    <div className="flex flex-col">
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Name of the Event
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("event-name") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["event-name"] || ""}
            name="event-name"
            placeholder="Specify the name of Event"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>


      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
        Purpose or objective of the event
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("event-purpose") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["event-purpose"] || ""}
            name="event-purpose"
            placeholder="Specify the purpose of event"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Date and time of the event
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("date-and-time-of-event") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["date-and-time-of-event"] || ""}
            name="date-and-time-of-event"
            placeholder="Specify Date and Time of Event"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Venue or location of the event
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("event-venue") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["event-venue"] || ""}
            name="event-venue"
            placeholder="Specify The Venue or Location of the Event"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>
      

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
        Description or agenda of the event
        </div>
        <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("event-description") ? "border-red-500" : "border-gray-200"} rounded`}>
          <input
            onChange={handleChange}
            value={userData["event-description"] || ""}
            name="event-description"
            placeholder="Specify The Venue or Location of the Event"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>
      
    </div>
  );
}