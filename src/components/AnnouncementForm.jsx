import React from 'react';

const AnnouncementForm = ({
    title,
    setTitle,
    description,
    setDescription,
    announcementImageURL,
    setAnnouncementImageURL,
    readMoreLink,
    setReadMoreLink,
    handleSubmit,
}) => {
    return (
        <form onSubmit={handleSubmit} className="mb-8">
            <h3 className="text-xl font-bold mb-4">Add Announcement</h3>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="block w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="block w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none"
                rows={5}
            ></textarea>
            <input
                type="text"
                value={announcementImageURL}
                onChange={(e) => setAnnouncementImageURL(e.target.value)}
                placeholder="Announcement Image URL"
                className="block w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none"
            />
            <input
                type="text"
                value={readMoreLink}
                onChange={(e) => setReadMoreLink(e.target.value)}
                placeholder="Read More Link"
                className="block w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 focus:outline-none">
                Add Announcement
            </button>
        </form>
    );
};

export default AnnouncementForm;
