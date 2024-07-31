import React, { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../context/StepperContext';

export default function Upload({ triggerHighlight, handleUploadIDFieldsComplete, passIdToParent }) {
  const { userData, setUserData } = useContext(StepperContext);
  const [SupportingFiles, setSupportingFiles] = useState({});
  const [allFilesUploaded, setAllFilesUploaded] = useState(false);
  const [highlightedFields, setHighlightedFields] = useState([]); // Add state for highlighted fields

  const passIdToParentFunction = () => {
    // Pass the proof of payment to the parent component
    passIdToParent(SupportingFiles);
  };

  useEffect(() => {
    // Check if all required files are uploaded
    const requiredFiles = ['supporting-documents'];
    const filesUploaded = requiredFiles.every(fieldName => SupportingFiles[fieldName] && SupportingFiles[fieldName].length > 0);
    setAllFilesUploaded(filesUploaded);

    if (triggerHighlight) {
      const emptyFields = requiredFiles.filter(field => !SupportingFiles[field] || SupportingFiles[field].length === 0);
      setHighlightedFields(emptyFields);
    }
  }, [SupportingFiles, triggerHighlight]);

  useEffect(() => {
    // Logic that depends on the updated SupportingFiles state
    passIdToParentFunction();
    console.log("Selected Files:", SupportingFiles);
  }, [SupportingFiles]);

  useEffect(() => {
    if (allFilesUploaded) {
      handleUploadIDFieldsComplete(true);
    } else {
      handleUploadIDFieldsComplete(false);
    }
  }, [allFilesUploaded, handleUploadIDFieldsComplete]);

  const handleChange = (e, fieldName) => {
    const file = e.target.files[0];
    const updatedFiles = {
      ...SupportingFiles,
      [fieldName]: file ? [file] : [], // Always set as an array, even if empty
    };
    setSupportingFiles(updatedFiles); // Update the SupportingFiles state

    if (!file) {
      setHighlightedFields(prev => [...prev, fieldName]); // Highlight the field if empty
    } else {
      setHighlightedFields(prev => prev.filter(field => field !== fieldName)); // Remove highlight if a file is selected
    }
  };

  const handleCancelUpload = (fieldName, fileName) => {
    setSupportingFiles({
      ...SupportingFiles,
      [fieldName]: SupportingFiles[fieldName].filter(file => file.name !== fileName)
    });
  };

  return (
    <div className='flex flex-col'>
      <div className='font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase'>
        Upload the Following:
      </div>
      <div className={`w-full mx-2 flex-1 border rounded-md py-1 px-2 ${highlightedFields.includes("supporting-documents") ? "border-red-500" : "border-white"}`}>

        <ul className='uploadList'>
          <li className='flex justify-between items-center mb-8'>
            <span className='text-sm sm:text-base mt-[10px] '>Supporting Documents: </span>
            <input
              type='file'
              id='supporting-documents-input'
              name='supporting-documents-input'
              className='hidden'
              onChange={(e) => handleChange(e, 'supporting-documents')}
              required // Mark as required
            />
            <label
              htmlFor='supporting-documents-input'
              className='bg-blue-500 text-white py-1 px-2 rounded-md border border-gray-300 hover:bg-blue-600 cursor-pointer mr-2 mt-[10px] ml-auto'
            >
              Choose Files
            </label>
            <div>
              {SupportingFiles['supporting-documents'] && SupportingFiles['supporting-documents'].map((file, index) => (
                <div key={index} className="flex items-center bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2 mt-4">
                  <p className="mr-2">{file.name}</p>
                  <button className='ml-auto text-black-600 bg-red-600 w-[30px] rounded' onClick={() => handleCancelUpload('supporting-documents', file.name)}>x</button>
                </div>
              ))}
            </div>
          </li>
        </ul>
      </div>

    </div>
  );
}
