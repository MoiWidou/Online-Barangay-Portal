import React from 'react';

const PicturesList = ({ pictures, handleDeletePicture }) => {
    return (
        <div className="overflow-x-auto">
            <h3 className="text-xl font-bold mb-4">Pictures</h3>
            <div className="sm:overflow-hidden">
                <div className="sm:min-w-full">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Image URL
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pictures.map((picture) => (
                                <tr key={picture.id}>
                                    <td className="px-6 py-4 whitespace-wrap">
                                        <div className="break-all">{picture.imageURL}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => handleDeletePicture(picture.id)} className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PicturesList;
