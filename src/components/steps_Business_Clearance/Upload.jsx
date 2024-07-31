import { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../context/StepperContext';

export default function Upload({triggerHighlight, handleUploadFieldsComplete, passFilesToParent}) {
    const { userData, setUserData } = useContext(StepperContext);
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [allFilesUploaded, setAllFilesUploaded] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState({
        'fsi-certificate': [],
        'health-permit': [],
        'zoning-clearance': [], 
        'business-permit-or-license' : [],
        'income-statements' : [],
        'balance-sheets' : []
    });
    const [highlightedFields, setHighlightedFields] = useState([]);



    const passFilesToParentFunction = () => {
        // Pass the selected files to the parent component
        passFilesToParent(selectedFiles);
    };

    const handleChange = (e, fieldName) => {
        if (e && e.target && e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles((prevSelectedFiles) => ({
                ...prevSelectedFiles,
                [fieldName]: files
            }));
    
            // Clear the value of the file input
            e.target.value = null;
    
            // Check if the field is required and remove the highlighting accordingly
            if (triggerHighlight) {
                const requiredFields = [
                    'fsi-certificate',
                    'health-permit',
                    'zoning-clearance',
                    'business-permit-or-license',
                    'income-statements',
                    'balance-sheets'
                ];
                if (requiredFields.includes(fieldName)) {
                    setHighlightedFields(prev => prev.filter(field => field !== fieldName));
                }
            }
        }
    };
    
    
    
    useEffect(() => {   
        const requiredFiles = [
          'fsi-certificate',
          'health-permit',
          'zoning-clearance',
          'business-permit-or-license',
          'income-statements',
          'balance-sheets'
        ];
      
        const allFilesUploaded = requiredFiles.every(fieldName => {
          return selectedFiles[fieldName] && selectedFiles[fieldName].length > 0;
        });
      
        console.log("Selected Files:", selectedFiles);
        console.log("All Files Uploaded:", allFilesUploaded);
      
        setAllFilesUploaded(allFilesUploaded);
      
        if (triggerHighlight) {
          const emptyFields = requiredFiles.filter(field => !selectedFiles[field] || selectedFiles[field].length === 0);
          setHighlightedFields(emptyFields);
          console.log("Updated Highlighted Fields:", emptyFields); // Add this console log
        } else {
          setHighlightedFields([]); // Clear highlights if triggerHighlight is false
        }
      
      }, [selectedFiles, triggerHighlight]);
      
    
    
    

    useEffect(() => {
        if (allFilesUploaded) {
            handleUploadFieldsComplete(true);
        } else {
            handleUploadFieldsComplete(false);
        }
    }, [allFilesUploaded, handleUploadFieldsComplete]);

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
            <div className='w-full mx-2 flex-1'>
                <div className='font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase'>
                    Upload the Following:
                </div>
                <ul className='uploadList'>
                <div className={`w-full mx-2 flex-1 border rounded-md py-1 px-2 ${highlightedFields.includes("fsi-certificate") ? "border-red-500" : "border-white"}`}>     
                        
                        <li className='flex justify-between items-center mb-8'>
                            
                            <span className='text-sm sm:text-base mt-[10px] '>Fire Safety Inspection Certificate:</span>
                            
                            <input
                                type='file'
                                id='fsi-certificate-input'
                                name='fsi-certificate-input'
                                className='hidden'
                                onChange={(e) => handleChange(e, 'fsi-certificate')}
                                required // Mark as required
                            />
                           
                            <label
                                htmlFor='fsi-certificate-input'
                                className='bg-blue-500 text-white py-1 px-2 rounded-md border border-gray-300 hover:bg-blue-600 cursor-pointer mr-2 mt-[10px] ml-auto'
                            >
                                Choose Files
                            </label>
                            <div>
                            {selectedFiles['fsi-certificate'] && selectedFiles['fsi-certificate'].map((file, index) => (
                                <div key={index} className="flex items-center bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2 mt-4 ">
                                    <p className="mr-2">{file.name}</p>
                                    <button className='ml-auto text-black-600 bg-red-600 w-[30px] rounded' onClick={() => handleCancelUpload('fsi-certificate', file.name)}>x</button>
                                </div>
                            ))}
                            </div>
                        </li>
                       
                </div>
                <div className={`w-full mx-2 flex-1 border rounded-md py-1 px-2 ${highlightedFields.includes("health-permit") ? "border-red-500" : "border-white"}`}>     
                        <li className='flex justify-between items-center mb-8'>
                            <span className='text-sm sm:text-base mt-[10px] '>Health Permit:</span>
                            <input
                                type='file'
                                id='health-permit-input'
                                name='health-permit-input'
                                className='hidden'
                                onChange={(e) => handleChange(e, 'health-permit')}
                                required // Mark as required
                            />
                            <label
                                htmlFor='health-permit-input'
                                className='bg-blue-500 text-white py-1 px-2 rounded-md border border-gray-300 hover:bg-blue-600 cursor-pointer mr-2 mt-[10px] ml-auto'
                            >
                                Choose Files
                            </label>
                            <div>
                                {selectedFiles['health-permit'] && selectedFiles['health-permit'].map((file, index) => (
                                    <div key={index} className="flex items-center bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2 mt-4 ">
                                        <p className="mr-2">{file.name}</p>
                                        <button className='ml-auto text-black-600 bg-red-600 w-[30px] rounded' onClick={() => handleCancelUpload('health-permit', file.name)}>x</button>
                                    </div>
                                ))}
                            </div>
                        </li>
                    </div>
                    <div className={`w-full mx-2 flex-1 border rounded-md py-1 px-2 ${highlightedFields.includes("zoning-clearance") ? "border-red-500" : "border-white"}`}>                  
                        <li className='flex justify-between items-center mb-8'>
                            <span className='text-sm sm:text-base mt-[10px] '>Zoning Clearance:</span>
                            <input
                                type='file'
                                id='zoning-clearance-input'
                                name='zoning-clearance-input'
                                className='hidden'
                                onChange={(e) => handleChange(e, 'zoning-clearance')}
                                required // Mark as required
                            />
                            <label
                                htmlFor='zoning-clearance-input'
                                className='bg-blue-500 text-white py-1 px-2 rounded-md border border-gray-300 hover:bg-blue-600 cursor-pointer mr-2 mt-[10px] ml-auto'
                            >
                                Choose Files
                            </label>
                            <div>
                                {selectedFiles['zoning-clearance'] && selectedFiles['zoning-clearance'].map((file, index) => (
                                    <div key={index} className="flex items-center bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2 mt-4 ">
                                        <p className="mr-2">{file.name}</p>
                                        <button className='ml-auto text-black-600 bg-red-600 w-[30px] rounded' onClick={() => handleCancelUpload('zoning-clearance', file.name)}>x</button>
                                    </div>
                                ))}
                            </div>
                        </li>
                    </div>
                    <div className={`w-full mx-2 flex-1 border rounded-md py-1 px-2 ${highlightedFields.includes("business-permit-or-license") ? "border-red-500" : "border-white"}`}>     
                        <li className='flex justify-between items-center mb-8'>
                            <span className='text-sm sm:text-base mt-[10px] '>Business Permit/License</span>
                            <input
                                type='file'
                                id='business-permit-or-license-input'
                                name='business-permit-or-license-input'
                                className='hidden'
                                onChange={(e) => handleChange(e, 'business-permit-or-license')}
                                required // Mark as required
                            />
                            <label
                                htmlFor='business-permit-or-license-input'
                                className='bg-blue-500 text-white py-1 px-2 rounded-md border border-gray-300 hover:bg-blue-600 cursor-pointer mr-2 mt-[10px] ml-auto'
                            >
                                Choose Files
                            </label>
                            <div>
                                {selectedFiles['business-permit-or-license'] && selectedFiles['business-permit-or-license'].map((file, index) => (
                                    <div key={index} className="flex items-center bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2 mt-4 ">
                                        <p className="mr-2">{file.name}</p>
                                        <button className='ml-auto text-black-600 bg-red-600 w-[30px] rounded' onClick={() => handleCancelUpload('business-permit-or-license', file.name)}>x</button>
                                    </div>
                                ))}
                            </div>
                        </li>
                    </div>
                    <div className={`w-full mx-2 flex-1 border rounded-md py-1 px-2 ${highlightedFields.includes("income-statements") ? "border-red-500" : "border-white"}`}>     
                        <li className='flex justify-between items-center mb-8'>
                            <span className='text-sm sm:text-base mt-[10px] '>Income Statements</span>
                            <input
                                type='file'
                                id='income-statements-input'
                                name='income-statements-input'
                                className='hidden'
                                onChange={(e) => handleChange(e, 'income-statements')}
                                required // Mark as required
                            />
                            <label
                                htmlFor='income-statements-input'
                                className='bg-blue-500 text-white py-1 px-2 rounded-md border border-gray-300 hover:bg-blue-600 cursor-pointer mr-2 mt-[10px] ml-auto'
                            >
                                Choose Files
                            </label>
                            <div>
                                {selectedFiles['income-statements'] && selectedFiles['income-statements'].map((file, index) => (
                                    <div key={index} className="flex items-center bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2 mt-4 ">
                                        <p className="mr-2">{file.name}</p>
                                        <button className='ml-auto text-black-600 bg-red-600 w-[30px] rounded' onClick={() => handleCancelUpload('income-statements', file.name)}>x</button>
                                    </div>
                                ))}
                            </div>
                        </li>
                    </div>
                    <div className={`w-full mx-2 flex-1 border rounded-md py-1 px-2 ${highlightedFields.includes("balance-sheets") ? "border-red-500" : "border-white"}`}>     
                        <li className='flex justify-between items-center mb-8'>
                            <span className='text-sm sm:text-base mt-[10px] '>Balance Sheets </span>
                            <input
                                type='file'
                                id='balance-sheets-input'
                                name='balance-sheets-input'
                                className='hidden'
                                onChange={(e) => handleChange(e, 'balance-sheets')}
                                required // Mark as required
                            />
                            <label
                                htmlFor='balance-sheets-input'
                                className='bg-blue-500 text-white py-1 px-2 rounded-md border border-gray-300 hover:bg-blue-600 cursor-pointer mr-2 mt-[10px] ml-auto'
                            >
                                Choose Files
                            </label>
                            <div>
                                {selectedFiles['balance-sheets'] && selectedFiles['balance-sheets'].map((file, index) => (
                                    <div key={index} className="flex items-center bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2 mt-4 ">
                                        <p className="mr-2">{file.name}</p>
                                        <button className='ml-auto text-black-600 bg-red-600 w-[30px] rounded' onClick={() => handleCancelUpload('balance-sheets', file.name)}>x</button>
                                    </div>
                                ))}
                            </div>
                        </li>
                    </div>
                </ul>
            </div>


        </div>
    )
}
