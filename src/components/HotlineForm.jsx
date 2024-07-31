import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase'; // Adjust the path as per your project structure

const HotlineForm = () => {
  const [description, setDescription] = useState('');
  const [number, setNumber] = useState('');
  const [showHotlineAdded, setShowHotlineAdded] = useState(false);
  const [hotlines, setHotlines] = useState([]);
  const [selectedHotline, setSelectedHotline] = useState(null);
  const [newHotlineAdded, setNewHotlineAdded] = useState(false); // Track new hotline addition
  const [editing, setEditing] = useState(false); // Track if editing mode is active
  const [isAddOperation, setIsAddOperation] = useState(false); // Track if the operation is add or update
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Track if delete confirmation is active
  const [hotlineToDelete, setHotlineToDelete] = useState(null); // Track which hotline to delete

  useEffect(() => {
    const fetchHotlines = async () => {
      try {
        const hotlinesCollection = collection(firestore, 'hotlines');
        const snapshot = await getDocs(hotlinesCollection);
        const hotlinesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHotlines(hotlinesData);
      } catch (error) {
        console.error('Error fetching hotlines:', error);
      }
    };
  
    fetchHotlines();
  }, [newHotlineAdded, editing]); // Include editing state as a dependency

  const fetchHotlines = async () => {
    try {
      const hotlinesCollection = collection(firestore, 'hotlines');
      const snapshot = await getDocs(hotlinesCollection);
      const hotlinesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHotlines(hotlinesData);
    } catch (error) {
      console.error('Error fetching hotlines:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (selectedHotline) {
        // Update the selected hotline
        await updateDoc(doc(firestore, 'hotlines', selectedHotline.id), {
          description,
          number,
        });
        setSelectedHotline(null); // Reset selectedHotline after editing
        setEditing(false); // Exit editing mode
        setIsAddOperation(false); // Indicate that the operation was an update
      } else {
        // Store the hotline data in Firestore
        await addDoc(collection(firestore, 'hotlines'), {
          description,
          number,
        });
  
        setIsAddOperation(true); // Indicate that the operation was an add
      }

      // Clear form fields
      setDescription('');
      setNumber('');
  
      setShowHotlineAdded(true); // Show success message

      // Fetch hotlines again to update the hotlines list
      await fetchHotlines();
  
      // Hide the message after 2 seconds
      setTimeout(() => {
        setShowHotlineAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting hotline data:', error);
    }
  };

  const handleDelete = async () => {
    if (!hotlineToDelete) return;

    try {
      await deleteDoc(doc(firestore, 'hotlines', hotlineToDelete.id));
      // Remove the deleted hotline from the hotlines state
      setHotlines(prevHotlines => prevHotlines.filter(hotline => hotline.id !== hotlineToDelete.id));
      setShowDeleteConfirm(false); // Hide the delete confirmation dialog
      setHotlineToDelete(null); // Clear the hotline to delete
    } catch (error) {
      console.error('Error deleting hotline:', error);
    }
  };

  const handleEdit = (hotline) => {
    // Set the selectedHotline state to the clicked hotline
    setSelectedHotline(hotline);
    // Populate the form fields with the selected hotline's data
    setDescription(hotline.description);
    setNumber(hotline.number);
    setEditing(true); // Enter editing mode
  };

  const handleCancelEdit = () => {
    // Clear form fields and exit editing mode
    setDescription('');
    setNumber('');
    setSelectedHotline(null);
    setEditing(false);
  };

  const confirmDelete = (hotline) => {
    setHotlineToDelete(hotline);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setHotlineToDelete(null);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Hotlines</h2>
      
      {/* Overlay for editing mode */}
      {editing && (
        <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-50"></div>
      )}

      {/* Popup for editing */}
      {editing && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md z-50">
          <h3 className="text-xl font-semibold mb-4">Edit Hotline</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-lg font-semibold mb-2">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="number" className="block text-lg font-semibold mb-2">Number</label>
              <input
                type="text"
                id="number"
                name="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={handleCancelEdit} className="text-red-500 font-semibold">Cancel</button>
              <button type="submit" className="ml-4 bg-blue-600 text-white font-semibold p-3 rounded-md hover:bg-blue-700 transition duration-300">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md">
            <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete the hotline "{hotlineToDelete.description} - {hotlineToDelete.number}"?
            </h3>
            <div className="flex justify-end">
              <button onClick={cancelDelete} className="text-gray-500 font-semibold mr-4">No</button>
              <button onClick={handleDelete} className="bg-red-500 text-white font-semibold p-3 rounded-md hover:bg-red-600 transition duration-300">Yes</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Form */}
      <form onSubmit={handleSubmit} className={`space-y-4 ${editing ? 'opacity-50' : ''}`}>
        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-lg font-semibold mb-2">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        {/* Number Input */}
        <div>
          <label htmlFor="number" className="block text-lg font-semibold mb-2">Number</label>
          <input
            type="text"
            id="number"
            name="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold p-3 rounded-md hover:bg-blue-700 transition duration-300"
        >
          {selectedHotline ? 'Update Hotline' : 'Add Hotline'}
        </button>
      </form>
      {showHotlineAdded && (
        <div className="bg-green-200 text-green-800 rounded-md p-3 mt-4">
          {isAddOperation ? 'Hotline Added Successfully' : 'Hotline Updated Successfully'}
        </div>
      )}

      {/* Hotlines List */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Current Hotlines</h3>
        <ul>
          {hotlines.map((hotline) => (
            <li key={hotline.id} className="flex justify-between items-center mb-2">
              <div>
                <span className="mr-2">{hotline.description}</span>
                <span>{hotline.number}</span>
              </div>
              <div>
                <button className="bg-blue-500 text-white px-4 py-1 rounded-md mr-2 hover:bg-blue-600 focus:outline-none focus:ring" onClick={() => handleEdit(hotline)}>Edit</button>
                <button className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring" onClick={() => confirmDelete(hotline)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HotlineForm;

