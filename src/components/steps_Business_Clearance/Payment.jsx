import { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../../context/StepperContext';
import QRCode from '../../img/GCASHNUMBER.jpg';
import { db, auth } from '../../firebase'; // Import Firebase db and auth
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function Payment({ triggerHighlight, handlePaymentFieldsComplete, passPaymentToParent, passInputDataToParent }) {
  const { userData, setUserData } = useContext(StepperContext);
  const [inputData, setInputData] = useState({ 
    ...userData, 
    status: "Pending",
    requestDateTime: new Date().toISOString() // Capture the current date and time
  });
  const [paymentFiles, setPaymentFiles] = useState({});
  const [userInfo, setUserInfo] = useState(null);
  const [highlightedFields, setHighlightedFields] = useState([]); // Add state for highlighted fields

  const passPaymentToParentFunction = () => {
    passPaymentToParent(paymentFiles);
  };

  useEffect(() => {
    const requiredFields = ["reference-number", "date-of-payment"];
    const isComplete = requiredFields.every(field => !!inputData[field] && inputData[field].trim() !== '') && paymentFiles["proof-of-payment"] && paymentFiles["proof-of-payment"].length > 0;

    handlePaymentFieldsComplete(isComplete, paymentFiles["proof-of-payment"]);
    
    if (triggerHighlight) {
      const emptyFields = requiredFields.filter(field => !inputData[field] || inputData[field].trim() === '');
      if (!paymentFiles["proof-of-payment"] || paymentFiles["proof-of-payment"].length === 0) {
        emptyFields.push('proof-of-payment');
      }
      setHighlightedFields(emptyFields);
    }

  }, [inputData, paymentFiles, handlePaymentFieldsComplete, triggerHighlight]);
  
  

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setPaymentFiles(prevPaymentFiles => ({
      ...prevPaymentFiles,
      [fieldName]: file ? [file] : [],
    }));

    if (file) {
      setHighlightedFields(prev => prev.filter(field => field !== fieldName));
    }

    passPaymentToParentFunction(); // Update the parent component
  };

  useEffect(() => {
    setUserData(inputData);
  }, [inputData, setUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData(prevInputData => ({ ...prevInputData, [name]: value }));
  
    // Pass the updated inputData to the parent after it's been updated
    passInputDataToParent(prevInputData => ({ ...prevInputData, [name]: value }));
  
    if (value.trim() !== '') {
      setHighlightedFields(prev => prev.filter(field => field !== name));
    }
  };
  

  // Fetch current user info and set userInfo state
  useEffect(() => {
    const fetchUserInfo = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userInfoRef = collection(db, 'userInfo');
            const q = query(userInfoRef, where('uid', '==', currentUser.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUserInfo(doc.data());
            });
        }
    };

    fetchUserInfo();
}, []);

  useEffect(() => {
    if (userInfo) {
        passInputDataToParent({ ...inputData, userId: auth.currentUser.uid, userInfo });
    } else {
        passInputDataToParent({ ...inputData, userId: auth.currentUser.uid });
    }
  }, [inputData, userInfo, passInputDataToParent]);

  const handleCancelUpload = (fieldName, fileName) => {
    const updatedPaymentFiles = {
      ...paymentFiles,
      [fieldName]: paymentFiles[fieldName].filter(file => file.name !== fileName)
    };
    setPaymentFiles(updatedPaymentFiles);
  };
  

  
  
  return (
    <div className='flex flex-col'>
      <div className='w-full mx-2 flex-1'>
        <div className='font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase'>
          PAY VIA QR:
        </div>
        <div className='flex justify-center bg-gray-200 p-4 mb-4'>
          <img src={QRCode} alt='Proof of Payment' />
        </div>

        <div className={`w-full mx-2 flex-1 border rounded-md py-1 px-2 ${highlightedFields.includes("proof-of-payment") ? "border-red-500" : "border-white"}`}>
          <ul className='uploadList'>
            <li className='flex justify-between items-center mb-8'>
              <span className='text-sm sm:text-base mt-[10px] '>Proof of Payment</span>
              <input
                type='file'
                id='proof-of-payment-input'
                name='proof-of-payment-input'
                className='hidden'
                onChange={(e) => handleFileChange(e, 'proof-of-payment')}
                required
              />
              <label
                htmlFor='proof-of-payment-input'
                className={`bg-blue-500 text-white py-1 px-2 rounded-md border border-gray-300 hover:bg-blue-600 cursor-pointer mr-2 mt-[10px] ml-auto`}
              >
                Choose Files
              </label>
              <div>
                {paymentFiles['proof-of-payment'] && paymentFiles['proof-of-payment'].map((file, index) => (
                  <div key={index} className="flex items-center bg-white py-1 px-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2 mt-4 ">
                    <p className="mr-2">{file.name}</p>
                    <button className='ml-auto text-black-600 bg-red-600 w-[30px] rounded' onClick={() => handleCancelUpload('proof-of-payment', file.name)}>x</button>
                  </div>
                ))}
              </div>
            </li>
          </ul>
        </div>

        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Reference Number:
          </div>
          <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("reference-number") ? "border-red-500" : "border-gray-200"} rounded`}>
            <input
              onChange={(e) => handleChange(e, 'reference-number')}
              value={inputData["reference-number"] || ""}
              name="reference-number"   
              placeholder="XXXXXXXXXXXXXXX"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
              required
            />
          </div>
        </div>
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Date of Payment:
          </div>
          <div className={`bg-white my-2 p-1 flex border ${highlightedFields.includes("date-of-payment") ? "border-red-500" : "border-gray-200"} rounded`}>
            <input
              onChange={(e) => handleChange(e, 'date-of-payment')}
              value={inputData["date-of-payment"] || ""}   
              type='date'
              name="date-of-payment"   
              placeholder="MM/DD/YY"
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
              required
            />  
          </div>
        </div>
      </div>
    </div>  
  );
}

