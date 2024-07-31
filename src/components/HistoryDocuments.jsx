import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Adjust the import path based on your file structure
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const HistoryDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDocId, setSelectedDocId] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [filterType, setFilterType] = useState(""); // State for filtering by document type
    const [filterStatus, setFilterStatus] = useState(""); // State for filtering by status
    const [filterDate, setFilterDate] = useState(""); // State for filtering by date
    const [showMoreInfo, setShowMoreInfo] = useState(false);

    const [showMoreInfoMobile, setShowMoreInfoMobile] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const navigate = useNavigate();
    const maxLength = 30; // Specify the maximum length for truncation
    const truncateMessage = (message, maxLength) => {
        if (message.length > maxLength) {
          return message.slice(0, maxLength) + '...';
        }
        return message;
      };

      const insertLineBreaks = (text, length) => {
        if (!text) return '';
        const regex = new RegExp(`.{1,${length}}`, 'g');
        return text.match(regex).join('\n');
    };

    // Function to fetch user documents
    const fetchUserDocuments = async () => {
        try {
            console.log("Fetching user documents...");
            const currentUser = auth.currentUser;
            if (currentUser) {
                console.log("Current user ID:", currentUser.uid);

                const documentsRef = collection(db, 'userData');
                const querySnapshot = await getDocs(documentsRef);

                console.log("Query snapshot size:", querySnapshot.size);

                if (!querySnapshot.empty) {
                    const docs = [];
                    querySnapshot.forEach(doc => {
                        console.log("Document data:", doc.data());
                        const userData = doc.data();
                        Object.keys(userData).forEach(key => {
                            const userDoc = userData[key];
                            if (userDoc.userId === currentUser.uid && (userDoc.status === "Claimed" || userDoc.status === "Decline Viewed")) {
                                // Include only the document ID in the object
                                docs.push({ id: doc.id, ...userDoc });
                            }
                        });
                    });
                    console.log("Fetched documents:", docs);
                    setDocuments(docs);
                } else {
                    console.log("No documents found for this user.");
                }
            } else {
                console.log("No current user.");
            }
        } catch (err) {
            console.error("Error fetching documents: ", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                fetchUserDocuments();
            } else {
                setLoading(false); // Set loading to false if no user is logged in
            }
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

    const handleDeleteDocument = async (docId) => {
        try {
            const documentPath = `userData/${docId}`;
            console.log("Attempting to delete document at path:", documentPath);

            const docRef = doc(db, documentPath);

            // Delete the document
            await deleteDoc(docRef);
            console.log("Document deleted successfully:", documentPath);

            // Update local state after successful deletion
            setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== docId));
            setShowDeleteSuccess(true);
            setSelectedDocId(null);

            // Hide success message after 2 seconds
            setTimeout(() => setShowDeleteSuccess(false), 2000);

            // Hide confirmation prompt
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error("Error deleting document: ", error);
            console.error("Error details: ", error.message);
            setError(error.message);
        }
    };

    const cancelDelete = () => {
        setSelectedDocId(null);
        setShowDeleteConfirmation(false);
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
      

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleHistoryClick = () => {
        navigate('/track'); // Navigate to TrackDocuments.jsx
    };

    return (
        <div className='mt-24 px-4'>
            {showDeleteConfirmation && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6">
                        <p className="mb-4">Are you sure you want to delete this document from your history? The data will not be recovered.</p>
                        <div className="flex justify-center">
                            <button className="mr-2 bg-red-500 text-white py-2 px-4 rounded-md" onClick={() => handleDeleteDocument(selectedDocId)}>
                                Yes
                            </button>
                            <button className="bg-blue-500 text-white py-2 px-4 rounded-md" onClick={cancelDelete}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteSuccess && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-green-400 rounded-lg shadow-md p-6">
                        <p className="text-lg text-white font-bold">Document Deleted Successfully</p>
                    </div>
                </div>
            )}
            <label className="text-center flex justify-center text-4xl font-bold">HISTORY</label>
            <button
                className='ml-2 mb-10 bg-green-500 hover:bg-green-700 py-2 px-4 rounded-md text-white'
                onClick={handleHistoryClick}
            >
                Go Back
            </button>
            

            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-center">
                <label htmlFor="docTypeFilter" className="mr-2 text-lg md:mb-0 mb-4">Filter by Document Type:</label>
                <select
                    id="docTypeFilter"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 mr-4"
                >
                    <option value="">All</option>
                    <option value="Business Permit">Business Permit</option>
                    <option value="Indigency">Indigency</option>
                    <option value="Residency">Residency</option>
                    <option value="Business Clearance">Business Clearance</option>
                    <option value="Community Events">Community Events</option>
                    <option value="Good Moral">Good Moral</option>
                </select>

                <label htmlFor="dateFilter" className="mr-2 text-lg md:mb-0 mb-4">Filter by Date:</label>
                <input
                    type="date"
                    id="dateFilter"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                </div>

            {isMobile ? (
                <div className="block md:hidden lg:hidden">
                    {filteredDocuments.map(doc => (
                        <div key={doc.id} className="bg-white shadow-lg rounded-lg mb-4 p-4">
                            <p><strong>Document Type:</strong> {doc && doc['document-type']}</p>
                            <p><strong>Request Date:</strong> {doc && new Date(doc['requestDateTime']).toLocaleDateString()}</p>
                            <p><strong>Request Time:</strong> {doc && new Date(doc['requestDateTime']).toLocaleTimeString()}</p>
                            <p><strong>Number of Copies:</strong> {doc && doc['number-of-copies']}</p>
                            {doc && doc['status'] === 'Claimed' && (
                                <p>
                                    <strong>Claimed on:</strong> {doc && doc['status'] === 'Claimed' && doc['claimedDateTime'] ?
                                    `${new Date(doc['claimedDateTime'].toDate()).toLocaleDateString()} at ${new Date(doc['claimedDateTime'].toDate()).toLocaleTimeString()}` : '-'}
                                </p>)
                            }
                            {doc && doc['status'] === 'Decline Viewed' && (
                                <p>
                                <strong>Declined due to:</strong> {doc && doc['status'] === 'Decline Viewed' && doc['Decline Reason'] ?
                                  truncateMessage(doc['Decline Reason'], maxLength, 30) : '-'}
                              </p>
                            )
                            }
 <td className='py-4 px-4 sm:px-6 text-xs sm:text-sm'>
                                        {doc && doc['status'] === 'Decline Viewed' && (
                                            <button
                                                className='text-blue-600 hover:text-blue-900 mr-2 ml-2'
                                                onClick={() => {
                                                    setSelectedDocument(doc);
                                                    setShowMoreInfoMobile(true);
                                                }}
                                            >
                                                View More
                                                <FontAwesomeIcon icon={faInfoCircle} className='ml-2'/>
                                            </button>
                                        )}
                                        </td>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='flex justify-center'>
                    <div className='rounded-lg shadow-lg w-full overflow-auto'>
                        <table className='min-w-full divide-y divide-gray-200'>
                            <thead className='bg-blue-300 border-b'>
                                <tr>
                                    <th className='py-3 px-4 sm:px-6 text-left text-xs sm:text-sm'>Document Type</th>
                                    <th className='py-3 px-4 sm:px-6 text-left text-xs sm:text-sm'>Request Date</th>
                                    <th className='py-3 px-4 sm:px-6 text-left text-xs sm:text-sm'>Request Time</th>
                                    <th className='py-3 px-4 sm:px-6 text-left text-xs sm:text-sm'>Number of Copies</th>
                                    <th className='py-3 px-4 sm:px-6 text-left text-xs sm:text-sm'>Information</th>
                                    <th className='py-3 px-4 sm:px-6 text-left text-xs sm:text-sm'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                                {filteredDocuments.map(doc => (
                                    <tr key={doc.id} className='hover:bg-gray-200'>
                                        <td className='py-4 px-4 sm:px-6 text-xs sm:text-sm'>{doc && doc['document-type']}</td>
                                        <td className='py-4 px-4 sm:px-6 text-xs sm:text-sm'>{doc && new Date(doc['requestDateTime']).toLocaleDateString()}</td>
                                        <td className='py-4 px-4 sm:px-6 text-xs sm:text-sm'>{doc && new Date(doc['requestDateTime']).toLocaleTimeString()}</td>
                                        <td className='py-4 px-4 sm:px-6 text-xs sm:text-sm'>{doc && doc['number-of-copies']}</td>
                                        <td className='py-4 px-4 sm:px-6 text-xs sm:text-sm'>
                                        {doc && doc['status'] === 'Claimed' && (
                                            <p>
                                                <strong>Claimed on:</strong> {doc && doc['status'] === 'Claimed' && doc['claimedDateTime'] ?
                                                `${new Date(doc['claimedDateTime'].toDate()).toLocaleDateString()} at ${new Date(doc['claimedDateTime'].toDate()).toLocaleTimeString()}` : '-'}
                                            </p>)
                                        }
                                        {doc && doc['status'] === 'Decline Viewed' && (
                                            <p>
                                            <strong>Declined due to:</strong> {doc && doc['status'] === 'Decline Viewed' && doc['Decline Reason'] ?
                                              truncateMessage(doc['Decline Reason'], maxLength, 30) : '-'}
                                          </p>)
                                        }
                                        </td>
                                        <td className='py-4 px-4 sm:px-6 text-xs sm:text-sm'>
                                        {doc && doc['status'] === 'Decline Viewed' && (
                                            <button
                                                className='text-blue-600 hover:text-blue-900 mr-2'
                                                onClick={() => {
                                                    setSelectedDocument(doc);
                                                    setShowMoreInfo(true);
                                                }}
                                            >
                                                View More
                                                <FontAwesomeIcon icon={faInfoCircle} className='ml-2'/>
                                            </button>
                                        )}
                                            
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

{showMoreInfo && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="w-[600px] bg-white rounded-lg shadow-md p-6 ">
                        {/* Render only if the status is 'Decline Viewed' */}
                        {selectedDocument && selectedDocument['status'] === 'Decline Viewed' && (
                            <p>
                                <div className="text-center">
                                    <strong>Declined on:</strong> {selectedDocument && selectedDocument['claimedDateTime'] ? `${new Date(selectedDocument['claimedDateTime'].toDate()).toLocaleDateString()} at ${new Date(selectedDocument['claimedDateTime'].toDate()).toLocaleTimeString()}` : '-'} <strong>due to:</strong>
                                </div> 
                                {selectedDocument['Decline Reason'] ?
                                    insertLineBreaks(selectedDocument['Decline Reason'], 50) : '-'}
                            </p>
                        )}
                        <button
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                            onClick={() => setShowMoreInfo(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

{showMoreInfoMobile && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="w-[400px] bg-white rounded-lg shadow-md p-6 ">
                        {/* Render only if the status is 'Decline Viewed' */}
                        {selectedDocument && selectedDocument['status'] === 'Decline Viewed' && (
                            <p>
                                <div className="text-center">
                                    <strong>Declined on:</strong> {selectedDocument && selectedDocument['claimedDateTime'] ? `${new Date(selectedDocument['claimedDateTime'].toDate()).toLocaleDateString()} at ${new Date(selectedDocument['claimedDateTime'].toDate()).toLocaleTimeString()}` : '-'} <strong>due to:</strong>
                                </div> 
                                {selectedDocument['Decline Reason'] ?
                                    insertLineBreaks(selectedDocument['Decline Reason'], 32) : '-'}
                            </p>
                        )}
                        <button
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                            onClick={() => setShowMoreInfoMobile(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default HistoryDocuments;
