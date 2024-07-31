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
        passPaymentToParentFunction();
        console.log("Selected Files:", paymentFiles);
        
        const requiredFiles = ['proof-of-payment'];
        const requiredFields = ["date-of-payment", "reference-number"];
        const isComplete = requiredFields.every(fieldName => userData[fieldName] !== '');
        const filesUploaded = requiredFiles.every(fieldName => paymentFiles[fieldName] && paymentFiles[fieldName].length > 0);
        handlePaymentFieldsComplete(isComplete, filesUploaded);
        console.log("Files Are Uploaded: ", filesUploaded);

        if (triggerHighlight) {
          const emptyFields = requiredFields.filter(field => !inputData[field] || inputData[field].trim() === '');
          if (!paymentFiles["proof-of-payment"] || paymentFiles["proof-of-payment"].length === 0) {
            emptyFields.push('proof-of-payment');
          }
          setHighlightedFields(emptyFields);
        }

    }, [paymentFiles, userData, handlePaymentFieldsComplete, triggerHighlight]);

    const handleChange = (e, fieldName) => {
        const file = e.target.files[0];
        const updatedFiles = {
            ...paymentFiles,
            [fieldName]: file ? [file] : null,
        };
        setPaymentFiles(updatedFiles);
        
        const { name, value } = e.target;
        setInputData(prevInputData => ({ ...prevInputData, [name]: value }));
        
        if (file) {
          setHighlightedFields(prev => prev.filter(field => field !== fieldName));
        }
    };

    const handleCancelUpload = (fieldName, fileName) => {
        const updatedPaymentFiles = {
            ...paymentFiles,
            [fieldName]: paymentFiles[fieldName].filter(file => file.name !== fileName)
        };
        setPaymentFiles(updatedPaymentFiles);

        const filesUploaded = Object.values(updatedPaymentFiles).some(files => files && files.length > 0);
        handlePaymentFieldsComplete(true, filesUploaded);
        console.log("Files Are Uploaded: ", filesUploaded);
    };

    useEffect(() => {
        setUserData(inputData);
    }, [inputData, setUserData]);

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
                            onChange={(e) => handleChange(e, 'proof-of-payment')}
                            required
                        />
                        <label
                            htmlFor='proof-of-payment-input'
                            className='bg-blue-500 text-white py-1 px-2 rounded-md border border-gray-300 hover:bg-blue-600 cursor-pointer mr-2 mt-[10px] ml-auto'
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
                            onChange={(e) => setInputData({...inputData, "reference-number": e.target.value})}
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
                            onChange={(e) => setInputData({...inputData, "date-of-payment": e.target.value})}
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
