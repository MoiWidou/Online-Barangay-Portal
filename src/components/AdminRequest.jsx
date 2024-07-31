import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import path based on your file structure

const AdminRequest = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDocId, setExpandedDocId] = useState(null);
  const [sortBy, setSortBy] = useState('document-type');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [selectedDoc, setSelectedDoc] = useState({ mainDocId: null, nestedDocId: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const documentsRef = collection(db, 'userData');
        const querySnapshot = await getDocs(documentsRef);
        const docs = [];

        querySnapshot.forEach(doc => {
          const userData = doc.data();
          Object.keys(userData).forEach(key => {
            const userDoc = userData[key];
            docs.push({ mainDocId: doc.id, nestedDocId: key, ...userDoc });
          });
        });

        setDocuments(docs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching documents: ", error);
        setError(error.message);
      }
    };

    fetchData();

    const unsubscribe = onSnapshot(collection(db, 'userData'), () => {
      fetchData();
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (mainDocId, nestedDocId, newStatus) => {
    // Check if the status is already Declined
    const selectedDocRef = doc(db, 'userData', mainDocId);
    const selectedDocSnapshot = await getDoc(selectedDocRef);
  
    if (selectedDocSnapshot.exists()) {
      const selectedDocData = selectedDocSnapshot.data();
      if (selectedDocData && selectedDocData[nestedDocId]) {
        if (selectedDocData[nestedDocId].status === 'Declined' || selectedDocData[nestedDocId].status === 'Decline Viewed') {
          alert("This document has already been declined and cannot be changed.");
          return;
        }
      } else {
        console.error("Nested document not found:", nestedDocId);
      }
    } else {
      console.error("Main document not found:", mainDocId);
    }
  
    // If status is not Declined, proceed with status change
    if (newStatus === 'Declined') {
      setSelectedDoc({ mainDocId, nestedDocId });
      setShowModal(true);
    } else {
      await updateStatus(mainDocId, nestedDocId, newStatus);
    }
  };
  

  const updateStatus = async (mainDocId, nestedDocId, newStatus, reason = '') => {
    try {
      const mainDocRef = doc(db, 'userData', mainDocId);
      const mainDocSnapshot = await getDoc(mainDocRef);

      if (mainDocSnapshot.exists()) {
        const mainDocData = mainDocSnapshot.data();
        if (mainDocData && mainDocData[nestedDocId]) {
          const updatedData = { ...mainDocData };
          updatedData[nestedDocId].status = newStatus;
          if (newStatus === 'Declined') {
            updatedData[nestedDocId]['Decline Reason'] = reason;
          }
          await updateDoc(mainDocRef, updatedData);
        } else {
          console.error("Nested document not found:", nestedDocId);
        }
      } else {
        console.error("Main document not found:", mainDocId);
      }
    } catch (error) {
      console.error("Error updating document status: ", error);
    }
  };

  const handleDeclineSubmit = async () => {
    if (!declineReason.trim()) {
      alert("Please provide a reason for declining.");
      return;
    }
    
    await updateStatus(selectedDoc.mainDocId, selectedDoc.nestedDocId, 'Declined', declineReason);
    setShowModal(false);
    setDeclineReason('');
    setSelectedDoc({ mainDocId: null, nestedDocId: null });
  };

  const handleToggleDetails = (docId) => {
    setExpandedDocId(expandedDocId === docId ? null : docId);
  };

  const handleOpenLink = (url) => {
    window.open(url, '_blank');
  };

  const handleSort = (sortBy) => {
    if (sortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortBy);
      setSortOrder('asc');
    }
  };

  const sortedDocuments = documents.sort((a, b) => {
    const aValue = typeof a[sortBy] === 'string' ? a[sortBy].toLowerCase() : a[sortBy];
    const bValue = typeof b[sortBy] === 'string' ? b[sortBy].toLowerCase() : b[sortBy];

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filter documents based on selected filters
  const filteredDocuments = sortedDocuments.filter(doc => {
    // Add your filtering logic here
    let matchType = true;
    let matchStatus = true;
    let matchDate = true;

    if (filterType) {
      matchType = doc['document-type'] === filterType;
    }

    if (filterStatus) {
      matchStatus = doc.status === filterStatus;
    }

    if (filterDate) {
      const docDate = new Date(doc['requestDateTime']);
      const filterDateObj = new Date(filterDate);
      matchDate = docDate.getFullYear() === filterDateObj.getFullYear() &&
                  docDate.getMonth() === filterDateObj.getMonth() &&
                  docDate.getDate() === filterDateObj.getDate();
    }

    return matchType && matchStatus && matchDate;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="text-xl">Loading...</div></div>;
  }

  if (error) {
    return <div className="text-center text-red-600 mt-12">Error: {error}</div>;
  }

  return (
    <div className="mt-12 px-4 max-w-6xl mx-auto">
      <h1 className="text-center text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex justify-between mb-4">
        <div>
          <label htmlFor="docTypeFilter" className="mr-2 text-lg md:mb-0 mb-4">Filter by Document Type:</label>
          <select
            id="docTypeFilter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className='px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
          >
            <option value="">All</option>
            <option value="Business Permit">Business Permit</option>
            <option value="Indigency">Indigency</option>
            <option value="Residency">Residency</option>
            <option value="Business Clearance">Business Clearance</option>
            <option value="Community Events">Community Events</option>
            <option value="Good Moral">Good Moral</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <div>
          <label htmlFor="statusFilter" className="mr-2 text-lg md:mb-0 mb-4">Filter by Status:</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className='px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'

          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Ready for Pick-up">Ready for Pick-up</option>
            <option value="Declined">Declined</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <div>
          <label htmlFor="dateFilter" className="mr-2 text-lg md:mb-0 mb-4">Filter by Date:</label>
          <input
            type="date"
            id="dateFilter"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className='px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
          />
        </div>
      </div>
      <div className="rounded-md shadow-lg overflow-x-auto">
      <table className="w-full divide-y divide-gray-200 rounded-md">


          <thead className="bg-indigo-500 text-white ">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider" onClick={() => handleSort('document-type')}>Document Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider" onClick={() => handleSort('number-of-copies')}>Number of Copies</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider" onClick={() => handleSort('status')}>Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Change Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDocuments.map(doc => (
              doc.status !== 'Claimed' && doc.status !== 'Decline Viewed' &&(
                <React.Fragment key={`${doc.mainDocId}-${doc.nestedDocId}`}>
                  <tr className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">{doc['document-type']}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doc['number-of-copies']}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doc.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={doc.status}
                        onChange={(e) => handleStatusChange(doc.mainDocId, doc.nestedDocId, e.target.value)}
                        className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value='Pending'>Pending</option>
                        <option value='Processing'>Processing</option>
                        <option value='Ready for Pick-up'>Ready for Pick-up</option>
                        <option value='Declined'>Declined</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => handleToggleDetails(`${doc.mainDocId}-${doc.nestedDocId}`)}
                      >
                        {expandedDocId === `${doc.mainDocId}-${doc.nestedDocId}` ? 'Hide Details' : 'Show Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedDocId === `${doc.mainDocId}-${doc.nestedDocId}` && (
                    <tr className="bg-gray-100">
                      <td colSpan="5" className="px-3 py-2">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {['fullName', 'email', 'phoneNumber', 'address'].map((key) => (
                            <div key={key} className="mb-2">
                              <strong className="text-indigo-600">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</strong> {doc.userInfo?.[key]}
                            </div>
                          ))}
                          <div className="col-span-1 sm:col-span-2 border-t border-gray-300 my-2"></div>
                          {Object.entries(doc)
                            .filter(([key]) => !['mainDocId', 'nestedDocId', 'proof-of-payment-input', 'userInfo', 'userId'].includes(key))
                            .map(([key, value]) => (
                              <div key={key} className="mb-2">
                                <strong className="text-indigo-600">{key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ')}:</strong>{' '}
                                {typeof value === 'string' && value.startsWith('http') ? (
                                  <button
                                    onClick={() => handleOpenLink(value)}
                                    className="text-blue-600 hover:underline"
                                  >
                                    Open Link
                                  </button>
                                ) : (
                                  <span>{value}</span>
                                )}
                              </div>
                            ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Reason for Decline</h3>
              <div className="mt-2">
                <textarea
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                  rows="4"
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                />
              </div>
              <div className="mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeclineSubmit}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequest;
