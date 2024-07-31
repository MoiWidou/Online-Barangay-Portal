import React, { useState } from 'react'; // Added missing import statement
import PropTypes from 'prop-types';

const AnnouncementsList = ({ announcements, handleUpdateAnnouncement, handleDelete }) => {
    const [expandedAnnouncementId, setExpandedAnnouncementId] = useState(null);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    const [isUpdatedOverlayVisible, setIsUpdatedOverlayVisible] = useState(false);
    const [isAnnouncementDeletedVisible, setIsAnnouncementDeletedVisible] = useState(false);
    const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);

    const toggleExpand = (announcementId) => {
        setExpandedAnnouncementId(announcementId === expandedAnnouncementId ? null : announcementId);
    };

    const showOverlay = (announcement) => {
        setCurrentAnnouncement(announcement);
        setIsOverlayVisible(true);
    };

    const hideOverlay = () => {
        setIsOverlayVisible(false);
        setCurrentAnnouncement(null);
    };

    const showConfirmationOverlay = (e) => {
        e.preventDefault();
        setIsConfirmationVisible(true);
    };

    const hideConfirmationOverlay = () => {
        setIsConfirmationVisible(false);
    };

    const showUpdatedOverlay = () => {
        setIsUpdatedOverlayVisible(true);
        setTimeout(() => {
            setIsUpdatedOverlayVisible(false);
        }, 2000); // Adjust the time as needed
    };

    const submitUpdate = () => {
        if (handleUpdateAnnouncement) {
            handleUpdateAnnouncement(currentAnnouncement);
            showUpdatedOverlay();
        } else {
            console.error('handleUpdateAnnouncement is not defined');
        }
        hideOverlay();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        showConfirmationOverlay(e);
    };

    const handleConfirmUpdate = () => {
        submitUpdate();
        hideConfirmationOverlay();
    };

    const showDeleteConfirmationOverlay = () => {
        setIsDeleteConfirmationVisible(true);
    };
    
    const hideDeleteConfirmationOverlay = () => {
        setIsDeleteConfirmationVisible(false);
    };
    
    const handleDeleteAnnouncement = (announcementId) => {
        // Show delete confirmation overlay
        setCurrentAnnouncement(announcements.find(announcement => announcement.id === announcementId));
        setIsDeleteConfirmationVisible(true);
    };

    const confirmDelete = () => {
        if (handleDelete) {
            handleDelete(currentAnnouncement.id);
            setIsDeleteConfirmationVisible(false);
            setTimeout(() => {
                setIsAnnouncementDeletedVisible(true);
                setTimeout(() => {
                    setIsAnnouncementDeletedVisible(false);
                    window.location.reload();
                }, 2000);
            }, 500); // Adding a small delay before showing the overlay
        } else {
            console.error('handleDelete is not defined');
        }
    };
    
    

    return (
        <div className="overflow-x-auto w-full">
            <h3 className="text-xl font-bold mb-4">Announcements</h3>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {announcements.map((announcement) => (
                            <React.Fragment key={announcement.id}>
                                <tr>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <button className="focus:outline-none" onClick={() => toggleExpand(announcement.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${announcement.id === expandedAnnouncementId ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 0a1 1 0 0 1 .707 1.707l-8.5 8.5a1 1 0 0 1-1.414-1.414L9 1.793 1.707 9.086a1 1 0 0 1-1.414 1.414l-8.5-8.5A1 1 0 0 1 0 0h10z" />
                                                </svg>
                                            </button>
                                            <span className="ml-2">{announcement.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => showOverlay(announcement)} className="bg-indigo-600 text-white px-4 py-1 rounded-md hover:bg-indigo-900 focus:outline-none focus:ring mr-2">
                                            Update
                                        </button>
                                        <button onClick={() => handleDeleteAnnouncement(announcement.id)} className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                                {announcement.id === expandedAnnouncementId && (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">Description:</span>
                                                    <p>{announcement.description}</p>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">Image URL:</span>
                                                    <p>{announcement.imageURL}</p>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">Read More Link:</span>
                                                    <p>{announcement.readMoreLink}</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Update Overlay */}
            {isOverlayVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full">
                    <h3 className="text-xl font-bold mb-4">Update Announcement</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={currentAnnouncement?.title || ''}
                            onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })}
                            placeholder="Title"
                            className="block w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none"
                        />
                        <textarea
                            value={currentAnnouncement?.description || ''}
                            onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, description: e.target.value })}
                            placeholder="Description"
                            className="block w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none"
                            rows={5}
                        ></textarea>
                        <input
                            type="text"
                            value={currentAnnouncement?.imageURL || ''}
                            onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, imageURL: e.target.value })}
                            placeholder="Announcement Image URL"
                            className="block w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none"
                        />
                        <input
                            type="text"
                            value={currentAnnouncement?.readMoreLink || ''}
                            onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, readMoreLink: e.target.value })}
                            placeholder="Read More Link"
                            className="block w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none"
                        />
                        <div className="flex justify-end">
                            <button type="button" onClick={hideOverlay} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none mr-2">
                                Cancel
                            </button>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 focus:outline-none">
                                Update Announcement
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

{isDeleteConfirmationVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                    <p className="mb-4">Are you sure you want to delete this announcement? This action cannot be reversed.</p>
                    <p className="mb-4"><strong>Title:</strong> {currentAnnouncement.title}</p>
                    <div className="flex justify-end">
                        <button onClick={() => setIsDeleteConfirmationVisible(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none mr-2">
                            No
                        </button>
                        <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none">
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        )}




            {isConfirmationVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Confirm Update</h3>
                        <p className="mb-4">Are you sure you want to update this announcement?</p>
                            <div className="flex justify-end">
                                <button onClick={hideConfirmationOverlay} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none mr-2">
                                    No
                                </button>
                                <button onClick={handleConfirmUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">
                                    Yes
                                </button>
                            </div>
                    </div>
                </div>
                    )}

                    {isUpdatedOverlayVisible && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                                <h3 className="text-xl font-semibold text-green-500 text-center">Announcement Updated</h3>
                            </div>
                        </div>
                    )}

                    {isAnnouncementDeletedVisible && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                                <h3 className="text-xl font-semibold text-red-500 text-center">Announcement Deleted</h3>
                            </div>
                        </div>
                    )}
</div>
    );
};

AnnouncementsList.propTypes = {
announcements: PropTypes.array.isRequired,
handleUpdateAnnouncement: PropTypes.func.isRequired,
handleDelete: PropTypes.func.isRequired,
};

export default AnnouncementsList;