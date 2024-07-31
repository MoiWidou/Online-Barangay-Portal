import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const TrackDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDocId, setExpandedDocId] = useState(null);
  const [showClaimedPopup, setShowClaimedPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [editedDocument, setEditedDocument] = useState(null);
  const [editedContent, setEditedContent] = useState({});
  const [isEditingOverlayOpen, setIsEditingOverlayOpen] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [showDeclineReason, setShowDeclineReason] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const navigate = useNavigate();

  const handleOpenEditOverlay = (doc) => {
    setEditedDocument(doc);
    setIsEditingOverlayOpen(true);
  };

  const handleCloseEditOverlay = () => {
    setEditedDocument(null);
    setIsEditingOverlayOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const documentsRef = collection(db, 'userData');
          const querySnapshot = await getDocs(documentsRef);
          const docs = [];

          querySnapshot.forEach(doc => {
            const userData = doc.data();
            Object.keys(userData).forEach(key => {
              const userDoc = userData[key];
              if (userDoc.userId === currentUser.uid) {
                docs.push({ mainDocId: doc.id, nestedDocId: key, ...userDoc });
              }
            });
          });

          setDocuments(docs);
          setLoading(false);
        } else {
          console.log("No current user.");
        }
      } catch (error) {
        console.error("Error fetching documents: ", error);
        setError(error.message);
      }
    };

    const unsubscribe = onSnapshot(collection(db, 'userData'), () => {
      fetchData();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStatusChange = async (mainDocId, nestedDocId, newStatus) => {
    try {
      const mainDocRef = doc(db, 'userData', mainDocId);
      const mainDocSnapshot = await getDoc(mainDocRef);

      if (mainDocSnapshot.exists()) {
        const mainDocData = mainDocSnapshot.data();
        if (mainDocData && mainDocData[nestedDocId]) {
          const updatedData = { ...mainDocData };
          updatedData[nestedDocId].status = newStatus;
          if (newStatus === 'Claimed') {
            updatedData[nestedDocId].claimedDateTime = new Date();
            setShowClaimedPopup(true);
          }
          else if (newStatus === 'Decline Viewed') {
            updatedData[nestedDocId].claimedDateTime = new Date();
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

  const handleFollowUp = async (mainDocId, nestedDocId) => {
    try {
      const mainDocRef = doc(db, 'userData', mainDocId);
      const mainDocSnapshot = await getDoc(mainDocRef);

      if (mainDocSnapshot.exists()) {
        const mainDocData = mainDocSnapshot.data();
        if (mainDocData && mainDocData[nestedDocId]) {
          const updatedData = { ...mainDocData };
          updatedData[nestedDocId].Fupstatus = "This document has been followed up";
          await updateDoc(mainDocRef, updatedData);
        } else {
          console.error("Nested document not found:", nestedDocId);
        }
      } else {
        console.error("Main document not found:", mainDocId);
      }
    } catch (error) {
      console.error("Error updating document with follow-up status: ", error);
    }
  };

  const handleToggleDetails = (docId) => {
    setExpandedDocId(expandedDocId === docId ? null : docId);
  };

  const handleOpenLink = (url) => {
    window.open(url, '_blank');
  };

  const handleHistoryClick = () => {
    navigate('/history-documents');
  };

  const handleEditContent = (key, value) => {
    setEditedContent({ ...editedContent, [key]: value });
  };

  const handleSaveChanges = async () => {
    try {
      setIsSavingChanges(true);
      const mainDocRef = doc(db, 'userData', editedDocument.mainDocId);
      const mainDocSnapshot = await getDoc(mainDocRef);

      if (mainDocSnapshot.exists()) {
        const mainDocData = mainDocSnapshot.data();
        if (mainDocData && mainDocData[editedDocument.nestedDocId]) {
          const updatedData = { ...mainDocData };
          updatedData[editedDocument.nestedDocId] = { ...updatedData[editedDocument.nestedDocId], ...editedContent };
          await updateDoc(mainDocRef, updatedData);
          setEditedDocument(null);
          setEditedContent({});
        } else {
          console.error("Nested document not found:", editedDocument.nestedDocId);
        }
      } else {
        console.error("Main document not found:", editedDocument.mainDocId);
      }
      setIsSavingChanges(false);
    } catch (error) {
      console.error("Error saving changes: ", error);
      setIsSavingChanges(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (!filterType && !filterStatus && !filterDate) return true;
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

  const handleToggleDeclineReason = (reason) => {
    setDeclineReason(reason);
    setShowDeclineReason(true);
  };


  const truncateMessage = (message, maxLength) => {
    if (message.length > maxLength) {
      return message.slice(0, maxLength) + '...';
    }
    return message;
  };

  return (
    <div className="mt-12 px-4 mx-auto">
      <h1 className="text-center text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-center">
        <label htmlFor="docTypeFilter" className="mr-2 text-lg md:mb-0 mb-4">Filter by Document Type:</label>
        <select
          id="docTypeFilter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        >
          <option className="text-lg" value="">All</option>
          <option className="text-lg" value="Business Permit">Business Permit</option>
          <option className="text-lg" value="Indigency">Indigency</option>
          <option className="text-lg" value="Residency">Residency</option>
          <option className="text-lg" value="Business Clearance">Business Clearance</option>
          <option className="text-lg" value="Community Events">Community Events</option>
          <option className="text-lg" value="Good Moral">Good Moral</option>
        </select>
        <label htmlFor="statusFilter" className="mr-2 md:ml-4">Filter by Status:</label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">All</option>
          <option value="Ready for Pick-up">Ready for Pick-up</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Declined">Declined</option>
        </select>
        <label htmlFor="dateFilter" className="mr-2 md:ml-4">Filter by Date:</label>
        <input
          type="date"
          id="dateFilter"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {isMobile ? (
        <div className="block md:hidden">
          {filteredDocuments.map(doc => (
            doc.status !== 'Claimed' && doc.status !== 'Decline Viewed' && (
              <div key={`${doc.mainDocId}-${doc.nestedDocId}`} className="bg-white shadow-lg rounded-lg mb-4 p-4">
                <p><strong>Document Type:</strong> {doc['document-type']}</p>
                <p><strong>Number of Copies:</strong> {doc['number-of-copies']}</p>
                <p><strong>Status:</strong> {doc.status}</p>
                <p><strong>Request Date:</strong> {new Date(doc['requestDateTime']).toLocaleDateString()}</p>
                <p><strong>Request Time:</strong> {new Date(doc['requestDateTime']).toLocaleTimeString()}</p>
                <div className="flex justify-between items-center mt-2">
                  {doc.status === 'Declined' && (
                    <button
                      onClick={() => {handleStatusChange(doc.mainDocId, doc.nestedDocId, 'Decline Viewed');
                                      handleToggleDeclineReason(doc['Decline Reason']);
                                      }}
                      className="bg-blue-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 w-[120px]"
                    >
                      View More
                    </button>
                  )}
                  {doc.status !== 'Ready for Pick-up' && !doc.Fupstatus && doc.status !== 'Declined' && doc.status !== 'Claimed' && (
                    <button
                      className="bg-blue-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 w-[120px]"
                      onClick={() => handleFollowUp(doc.mainDocId, doc.nestedDocId)}
                    >
                      Follow Up
                    </button>
                  )}

                  {doc.status === 'Ready for Pick-up' && doc.status !== 'Declined' && (
                    <button
                      className="bg-blue-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 w-[120px]"
                      onClick={() => handleStatusChange(doc.mainDocId, doc.nestedDocId, 'Claimed')}
                    >
                      Claimed
                    </button>
                  )}

                  {doc.status !== 'Ready for Pick-up' && (
                    <p className="text-red-500">{doc.Fupstatus}</p>
                  )}

{doc.status !== 'Declined' && doc.status !== 'Ready for Pick-up' && doc.status !== 'Processing' && doc.status !== 'Claimed' && (
                      <td className="px-4 py-3 ">
                        <button
                          className="bg-blue-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 w-[90px]"
                          onClick={() => handleOpenEditOverlay(doc)}
                        >
                          {expandedDocId === `${doc.mainDocId}-${doc.nestedDocId}` ? 'Updating' : 'Update'}
                        </button>
                      </td>
                    )}
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto overflow-auto rounded-lg shadow-lg hidden md:block">
          <table className="w-full">
            <thead className="bg-blue-300 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Document Type</th>
                <th className="px-4 py-3 text-sm font-semibold uppercase tracking-wider text-center">Number of Copies</th>
                <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Request Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Request Time</th>
                <th className="px-8 py-3 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                <th className="px-8 py-3 text-left text-sm font-semibold uppercase tracking-wider">Update</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map(doc => (
                doc.status !== 'Claimed' && doc.status !== 'Decline Viewed' && (
                  <React.Fragment key={`${doc.mainDocId}-${doc.nestedDocId}`}>
                    <tr className="hover:bg-gray-100">
                      <td className="px-4 py-3">{doc['document-type']}</td>
                      <td className="px-4 py-3 text-center">{doc['number-of-copies']}</td>
                      <div className="mt-2 flex justify-center">
                      <div className={`mt-2 rounded-md px-3 py-1 text-white inline-block ${doc.status === 'Declined' ? 
    'bg-red-400' : doc.status === 'Pending' ? 'bg-yellow-700' : doc.status === 'Processing' ? 
    'bg-orange-900' : doc.status === 'Ready for Pick-up' ? 'bg-green-500' : 'bg-gray-500'}`}
    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '150px' }}>
    {doc.status}
</div>


                    </div>


                      <td className="px-4 py-3">{new Date(doc['requestDateTime']).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{new Date(doc['requestDateTime']).toLocaleTimeString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-between items-center">
                          {doc.status === 'Declined' && (
                            <button
                            onClick={() => {handleStatusChange(doc.mainDocId, doc.nestedDocId, 'Decline Viewed');
                                            handleToggleDeclineReason(doc['Decline Reason']);
                            }}
                              className="bg-blue-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 w-[120px]"
                            >
                              View More
                            </button>
                          )}
                          {doc.status !== 'Ready for Pick-up' && !doc.Fupstatus && doc.status !== 'Declined' && doc.status !== 'Claimed' && (
                            <button
                              className="bg-blue-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 w-[120px]"
                              onClick={() => handleFollowUp(doc.mainDocId, doc.nestedDocId)}
                            >
                              Follow Up
                            </button>
                          )}

                          {doc.status === 'Ready for Pick-up' && doc.status !== 'Declined' && (
                            <button
                              className="bg-blue-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 w-[120px]"
                              onClick={() => handleStatusChange(doc.mainDocId, doc.nestedDocId, 'Claimed')}
                            >
                              Claimed
                            </button>
                          )}

                          {doc.status !== 'Ready for Pick-up' && (
                            <p className="text-red-500">{doc.Fupstatus}</p>
                          )}
                                             </div>
                    </td>

                    {doc.status !== 'Declined' && doc.status !== 'Ready for Pick-up' && doc.status !== 'Processing' && doc.status !== 'Claimed' && (
                      <td className="px-4 py-3 ">
                        <button
                          className="bg-blue-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 w-[90px]"
                          onClick={() => handleOpenEditOverlay(doc)}
                        >
                          {expandedDocId === `${doc.mainDocId}-${doc.nestedDocId}` ? 'Updating' : 'Update'}
                        </button>
                      </td>
                    )}
                  </tr>
                  {isEditingOverlayOpen && editedDocument && (
                    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
                      <div className="bg-white p-8 rounded-lg shadow-lg max-w-screen-md w-full mx-auto my-8" style={{ maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {Object.entries(editedDocument)
                            .filter(([key]) => !['mainDocId', 'nestedDocId', 'proof-of-payment-input', 'userInfo', 'userId', 'Number of Copies', 'Document Type', 'Request Time', 'Status'].includes(key))
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
                                  <input
                                    type="text"
                                    value={editedContent[key] || value}
                                    onChange={(e) => handleEditContent(key, e.target.value)}
                                    className="border rounded-md px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
                                    readOnly={["document-type", "number-of-copies", "status", "requestDateTime"].includes(key)}
                                  />
                                )}
                              </div>
                            ))}
                        </div>
                        <div className="flex justify-center mt-3">
                          {isSavingChanges ? (
                            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2">
                            <div className="flex items-center">
                              <FaSpinner className="animate-spin mr-2" />
                              <span>Saving Changes</span>
                            </div>
                          </button>
                          
                          ) : (
                            <>
                              <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                                onClick={handleSaveChanges}
                              >
                                Save
                              </button>
                              <button
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleCloseEditOverlay}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    )}

    <button
      className='fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-md text-white'
      onClick={handleHistoryClick}
    >
      History
    </button>
    {showClaimedPopup && (
      <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-center text-xl font-semibold mb-4">Document Claimed!</p>
          <p className="text-center text-gray-700">Document has been recorded in history.</p>
          <button
            className="bg-green-500 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={() => setShowClaimedPopup(false)}
          >
            Close
          </button>
        </div>
      </div>
    )}
   {showDeclineReason && (
  <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <p className="text-center text-xl font-semibold mb-4">Reason for Decline</p>
      {declineReason && (
        <p className="text-center text-gray-700">{truncateMessage(declineReason, 30)}</p>
      )}
      <p className="text-center text-gray-500">Upon clicking 'Close', the document will move to History.</p>
      <button
        onClick={() => setShowDeclineReason(false)}
        className="bg-green-500 text-white font-bold py-2 px-4 rounded mt-4 break-all"
      >
        Close
      </button>
    </div>
  </div>
)}



      
  </div>
  
);
};

export default TrackDocuments;


