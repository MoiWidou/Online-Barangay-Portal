import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase'; // Adjust the path as per your project structure
import HotlineForm from './HotlineForm'; // Import the HotlineForm component

const ContactUs = () => {
  const [messageSent, setMessageSent] = useState(false);
  const [hotlines, setHotlines] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fullName = e.target.fullName.value;
      const email = e.target.email.value;
      const message = e.target.message.value;

      // Store the form data in Firestore
      await addDoc(collection(firestore, 'contacts'), {
        fullName,
        email,
        message,
      });

      // Optionally, you can reset the form fields after submission
      e.target.reset();

      // Set messageSent to true to display the message
      setMessageSent(true);

      // Hide the message after 2 seconds
      setTimeout(() => {
        setMessageSent(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

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
  }, [hotlines]); // Update hotlines when there's a change in the hotlines data
  
  return (
    <div className="container mx-auto py-10 grid lg:grid-cols-2 gap-10">
      {/* Contact Form */}
      <div className="bg-white p-8 rounded-lg shadow-lg relative">
        <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input */}
          <div>
            <label htmlFor="fullName" className="block text-lg font-semibold mb-2">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          {/* Email Address Input */}
          <div>
            <label htmlFor="email" className="block text-lg font-semibold mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          {/* Concerns/Message Input */}
          <div>
            <label htmlFor="message" className="block text-lg font-semibold mb-2">Concerns/Message</label>
            <textarea
              id="message"
              name="message"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              rows={5}
              required
            />
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold p-3 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </form>
        {messageSent && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="bg-black bg-opacity-50 rounded-lg p-6">
              <p className="text-white text-center">Message has been sent.</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Hotline Form */}

      {/* Emergency Hotlines */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Emergency Hotlines</h2>
        
        {/* Hotline List */}
        <ul className="space-y-2">
          {hotlines.map((hotline) => (
            <li key={hotline.id} className="flex justify-between items-center">
              <span className="font-semibold">{hotline.description}</span>
              <span className="text-blue-600">{hotline.number}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContactUs;
