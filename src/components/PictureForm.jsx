import React from 'react';

const PictureForm = ({ pictureImageURL, setPictureImageURL, handleAddPicture }) => {
    return (
        <form onSubmit={handleAddPicture} className="mb-8">
            <h3 className="text-xl font-bold mb-4">Add Picture</h3>
            <div className="flex flex-col sm:flex-row">
                <input
                    type="text"
                    value={pictureImageURL}
                    onChange={(e) => setPictureImageURL(e.target.value)}
                    placeholder="Picture Image URL"
                    className="block w-full sm:w-auto mb-4 sm:mb-0 mr-0 sm:mr-4 p-2 border border-gray-300 rounded"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto">
                    Add Picture
                </button>
            </div>
        </form>
    );
};

export default PictureForm;
