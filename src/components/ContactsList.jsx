import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import ViewContactModal from './ViewContactModal.jsx';

const ContactsList = () => {
    const [contacts, setContacts] = useState([]);
    const [deletingContactId, setDeletingContactId] = useState(null);
    const [viewedContact, setViewedContact] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'contacts'));
                const contactsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setContacts(contactsData);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };

        fetchContacts();
    }, []);

    const handleDeleteContact = async (contactId) => {
        setDeletingContactId(contactId); // Set the contact id being deleted
    };

    const handleViewContact = (contact) => {
        setViewedContact(contact);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteDoc(doc(firestore, 'contacts', deletingContactId));
            setContacts(contacts.filter(contact => contact.id !== deletingContactId));
            console.log('Contact deleted successfully!');
        } catch (error) {
            console.error('Error deleting contact:', error);
        } finally {
            setDeletingContactId(null); // Reset the deletingContactId state
        }
    };

    const handleCancelDelete = () => {
        setDeletingContactId(null); // Reset the deletingContactId state
    };

    // Function to truncate message with ellipsis
    const truncateMessage = (message, maxLength) => {
        if (message.length > maxLength) {
            return message.slice(0, maxLength) + '...';
        }
        return message;
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Messages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contacts.map(contact => (
                    <div key={contact.id} className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">{contact.fullName}</h3>
                        <p className="text-gray-600 mb-2">{contact.email}</p>
                        <p className="text-gray-600 mb-4">{truncateMessage(contact.message, 40)}</p>
                        <div className="flex justify-between items-center">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                                onClick={() => handleViewContact(contact)}
                            >
                                View
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                                onClick={() => handleDeleteContact(contact.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {/* Overlay for delete confirmation */}
            {deletingContactId && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="text-lg font-semibold mb-2">Are you sure you want to delete this message?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                                onClick={handleConfirmDelete}
                            >
                                Yes
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                                onClick={handleCancelDelete}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* View contact modal */}
            {showModal && viewedContact && (
                <ViewContactModal contact={viewedContact} onClose={() => setShowModal(false)} />
            )}
        </div>
    );
};

export default ContactsList;
