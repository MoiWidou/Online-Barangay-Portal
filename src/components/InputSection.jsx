import React, { useState } from 'react';

function InputSection({ numberOfCopies, handleInputChange, handleSubmit }) {
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInput = (event) => {
    const value = event.target.value.replace(/\D/, '');
    handleInputChange(event);
    setIsValid(value !== '');
    setErrorMessage('');
  };

  const handleFormSubmit = () => {
    if (!isValid || numberOfCopies === '0') {
      setErrorMessage('Please input No. of Copies');
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="inputSection flex items-center flex-col md:flex md:flex-col"> {/* Added Tailwind CSS classes */}
      <label htmlFor="numberOfCopies" className="text-lg mb-0 mx-auto p-4 text-center font-bold">
        Input No. of Copies:
      </label>
      <input
        id="numberOfCopies"
        type="text"
        value={numberOfCopies}
        onChange={handleInput}
        className="text-lg px-4 py-2 border rounded-md mb-2 text-center md:mt-0" 
        placeholder="Enter number of copies..."/>
      
      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      <button onClick={handleFormSubmit} className="hover:bg-blue-800 transform hover:scale-105 transition-transform duration-200 ease-in-out text-lg px-4 py-2 bg-blue-500 text-white rounded-md ">
        REQUEST
      </button>
    </div>
  );
}

export default InputSection;
