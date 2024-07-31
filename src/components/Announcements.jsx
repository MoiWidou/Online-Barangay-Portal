import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase.js';
import { getDocs, collection } from 'firebase/firestore';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);

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

        fetchAnnouncements();
    }, []);

    const handleShowAllAnnouncements = () => {
        setShowAllAnnouncements(true);
    };

    const handleCloseModal = () => {
        setShowAllAnnouncements(false);
    };

    return (
        <div className="container mx-auto py-10 px-4 lg:px-0">
            {announcements.slice(0, 6).map((announcement, index) => (
                <div key={announcement.id} className="mb-8">
                    <div className={`lg:flex lg:justify-between ${index === 0 || index === 5 ? 'lg:flex-row-reverse' : ''} bg-white rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105`}>
                        <img
                            src={announcement.imageURL}
                            alt={announcement.title}
                            className={`w-full lg:w-1/2 h-auto object-cover ${index === 0 || index === 5 ? 'lg:h-80' : ''} transition duration-300`}
                        />
                        <div className={`p-6 ${index === 0 || index === 5 ? 'bg-gradient-to-r from-orange-400 to-red-400' : 'bg-gradient-to-r from-orange-300 to-red-300'} text-white lg:w-1/2`}>
                            <h3 className="text-3xl font-bold mb-2">{announcement.title}</h3>
                            <p className="text-lg mb-4 leading-relaxed">{announcement.description}</p>
                            <a
                                href={announcement.readMoreLink}
                                className="inline-block px-6 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-orange-600 transition duration-300 text-base"
                            >
                                Read More
                            </a>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex justify-center mt-8">
                {announcements.length > 6 && (
                    <button onClick={handleShowAllAnnouncements} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                        More Announcements
                    </button>
                )}
            </div>

            {showAllAnnouncements && (
                <div className="fixed inset-0 flex justify-center items-center z-50 overflow-y-auto">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-screen-md w-full max-h-screen overflow-y-auto relative">
                        <button onClick={handleCloseModal} className="absolute top-4 right-10 text-red-600 hover:text-red-800 focus:outline-none">
                            Close
                        </button>
                        <div className="flex flex-wrap">
                            {announcements.map((announcement) => (
                                <div key={announcement.id} className="w-full lg:w-1/2 p-4">
                                    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105">
                                        <img
                                            src={announcement.imageURL}
                                            alt={announcement.title}
                                            className="w-full h-60 object-cover"
                                        />
                                        <div className="p-6 bg-gradient-to-r from-orange-300 to-red-300 text-white">
                                            <h3 className="text-2xl font-bold mb-2">{announcement.title}</h3>
                                            <p className="text-lg mb-4 leading-relaxed">{announcement.description}</p>
                                            <a
                                                href={announcement.readMoreLink}
                                                className="inline-block px-6 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-orange-600 transition duration-300 text-base"
                                            >
                                                Read More
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Announcements;
