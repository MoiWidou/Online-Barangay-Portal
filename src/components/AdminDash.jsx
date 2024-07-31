import React, { useState, useEffect } from 'react';
import AnnouncementForm from './AnnouncementForm';
import AnnouncementsList from './AnnouncementsList';
import PictureForm from './PictureForm';
import PicturesList from './PicturesList';
import ContactsList from './ContactsList';
import { firestore } from '../firebase.js';
import { getDocs, collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import HotlineForm from './HotlineForm';

const AdminDash = () => {
    const [activeTab, setActiveTab] = useState('announcements');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [announcementImageURL, setAnnouncementImageURL] = useState('');
    const [readMoreLink, setReadMoreLink] = useState('');
    const [pictures, setPictures] = useState([]);
    const [pictureImageURL, setPictureImageURL] = useState('');
    const [announcements, setAnnouncements] = useState([]);
    const [showAnnouncementAdded, setShowAnnouncementAdded] = useState(false);
    const [showPictureAdded, setShowPictureAdded] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showPictureDeleted, setShowPictureDeleted] = useState(false);
    const [deletePictureId, setDeletePictureId] = useState('');

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'announcements'));
                const announcementsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAnnouncements(announcementsData);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };

        const fetchPictures = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'pictures'));
                const picturesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPictures(picturesData);
            } catch (error) {
                console.error('Error fetching pictures:', error);
            }
        };

        fetchAnnouncements();
        fetchPictures();
    }, []);

    const handleSubmitAnnouncement = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(firestore, 'announcements'), {
                title,
                description,
                imageURL: announcementImageURL,
                readMoreLink,
            });

            setTitle('');
            setDescription('');
            setAnnouncementImageURL('');
            setReadMoreLink('');
            setShowAnnouncementAdded(true);
            setTimeout(() => {
                setShowAnnouncementAdded(false);
            }, 2000);

            console.log('Announcement added successfully!');
        } catch (error) {
            console.error('Error adding announcement:', error);
        }
    };

    const handleUpdateAnnouncement = async (updatedAnnouncement) => {
        try {
            const announcementRef = doc(firestore, 'announcements', updatedAnnouncement.id);
            await updateDoc(announcementRef, {
                title: updatedAnnouncement.title,
                description: updatedAnnouncement.description,
                imageURL: updatedAnnouncement.imageURL,
                readMoreLink: updatedAnnouncement.readMoreLink,
            });

            setAnnouncements(announcements.map(announcement =>
                announcement.id === updatedAnnouncement.id ? updatedAnnouncement : announcement
            ));
        } catch (error) {
            console.error('Error updating announcement:', error);
        }
    };

    const handleDeleteAnnouncement = async (announcementId) => {
        try {
            await deleteDoc(doc(firestore, 'announcements', announcementId));
            console.log('Announcement deleted successfully!');
        } catch (error) {
            console.error('Error deleting announcement:', error);
        }
    };

    const handleAddPicture = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(firestore, 'pictures'), {
                imageURL: pictureImageURL,
            });

            setShowPictureAdded(true);
            setTimeout(() => {
                setShowPictureAdded(false);
                window.location.reload();
            }, 2000);

            console.log('Picture added successfully!');
            setPictureImageURL('');
        } catch (error) {
            console.error('Error adding picture:', error);
        }
    };

    const handleDeletePicture = async (pictureId) => {
        setDeletePictureId(pictureId);
        setShowDeleteConfirmation(true);
    };

    const confirmDeletePicture = async () => {
        try {
            await deleteDoc(doc(firestore, 'pictures', deletePictureId));
            setShowPictureDeleted(true);
            setTimeout(() => {
                setShowPictureDeleted(false);
                window.location.reload();
            }, 2000);
            console.log('Picture deleted successfully!');
        } catch (error) {
            console.error('Error deleting picture:', error);
        }
        setShowDeleteConfirmation(false);
    };

    const cancelDeletePicture = () => {
        setShowDeleteConfirmation(false);
    };

    return (
        <div className="container mx-auto py-10 px-4 lg:px-0">
            <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>

            <div className="flex mb-8">
                <button
                    className={`px-6 py-2 mr-4 rounded-md focus:outline-none ${activeTab === 'announcements' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveTab('announcements')}
                >
                    Announcements
                </button>
                <button
                    className={`px-6 py-2 mr-4 rounded-md focus:outline-none ${activeTab === 'pictures' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveTab('pictures')}
                >
                    Pictures
                </button>
                <button
                                       className={`px-6 py-2 mr-4 rounded-md focus:outline-none ${activeTab === 'contacts' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                       onClick={() => setActiveTab('contacts')}
                                   >
                                       Messages
                                   </button>
                                   <button
                                       className={`px-6 py-2 rounded-md focus:outline-none ${activeTab === 'hotlines' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                       onClick={() => setActiveTab('hotlines')}
                                   >
                                       Hotlines
                                   </button>
                               </div>
                   
                               {activeTab === 'announcements' && (
                                   <>
                                       <AnnouncementForm
                                           title={title}
                                           setTitle={setTitle}
                                           description={description}
                                           setDescription={setDescription}
                                           announcementImageURL={announcementImageURL}
                                           setAnnouncementImageURL={setAnnouncementImageURL}
                                           readMoreLink={readMoreLink}
                                           setReadMoreLink={setReadMoreLink}
                                           handleSubmit={handleSubmitAnnouncement}
                                       />
                   
                                       <AnnouncementsList
                                           announcements={announcements}
                                           handleUpdateAnnouncement={handleUpdateAnnouncement}
                                           handleDelete={handleDeleteAnnouncement}
                                       />
                                   </>
                               )}
                   
                               {activeTab === 'pictures' && (
                                   <>
                                       <PictureForm
                                           pictureImageURL={pictureImageURL}
                                           setPictureImageURL={setPictureImageURL}
                                           handleAddPicture={handleAddPicture}
                                       />
                   
                                       <PicturesList
                                           pictures={pictures}
                                           handleDeletePicture={handleDeletePicture}
                                       />
                                   </>
                               )}
                   
                               {activeTab === 'contacts' && <ContactsList />}
                   
                               {activeTab === 'hotlines' && (
                                   <div>

                                   </div>
                               )}
                   
                               {/* Overlay message for announcement added */}
                               {showAnnouncementAdded && (
                                   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                       <div className="bg-white p-6 rounded-md shadow-lg">
                                           <p className="text-xl font-semibold text-green-500">Announcement Added Successfully</p>
                                       </div>
                                   </div>
                               )}
                   
                               {/* Overlay message for picture added */}
                               {showPictureAdded && (
                                   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                       <div className="bg-white p-6 rounded-md shadow-lg">
                                           <p className="text-xl font-semibold text-green-500">Picture Added Successfully</p>
                                       </div>
                                   </div>
                               )}
                   
                               {/* Confirmation modal for deleting picture */}
                               {showDeleteConfirmation && (
                                   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                       <div className="bg-white p-6 rounded-md shadow-lg">
                                           <p className="text-xl font-semibold">Are you sure you want to delete this picture?</p>
                                           <div className="flex justify-end mt-4">
                                               <button className="px-4 py-2 bg-red-500 text-white rounded-md mr-4" onClick={confirmDeletePicture}>Delete</button>
                                               <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md" onClick={cancelDeletePicture}>Cancel</button>
                                           </div>
                                       </div>
                                   </div>
                               )}
                   
                               {/* Overlay message for picture deleted */}
                               {showPictureDeleted && (
                                   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                       <div className="bg-white p-6 rounded-md shadow-lg">
                                           <p className="text-xl font-semibold text-green-500">Picture Deleted Successfully</p>
                                       </div>
                                   </div>
                               )}
                               {activeTab === 'hotlines' && (
    <div>
        <HotlineForm />
        {/* Content for Hotlines tab goes here */}
        {/* You can add your hotlines content here */}
    </div>
)}

                           </div>
                       );
                   };
                   
                   export default AdminDash;
                   
