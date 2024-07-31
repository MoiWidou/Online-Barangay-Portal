import React from 'react';

const ViewContactModal = ({ contact, onClose }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-md max-w-md overflow-y-auto mt-[20px]">
                <h3 className="text-lg font-semibold mb-2">{contact.fullName}</h3>
                <p className="text-gray-600 mb-2">{contact.email}</p>
                <p className="text-gray-600 mb-4 w-[400px] h-[500px] overflow-wrap break-all">{contact.message}</p>
            </div>
            <button
                className="absolute bottom-3 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-600 focus:outline-none mt-[100px]"
                onClick={onClose}
            >
                Close
            </button>
        </div>
    );
};

export default ViewContactModal;
