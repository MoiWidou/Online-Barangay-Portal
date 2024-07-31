import React, { useState } from 'react';
import './LandingPage.css'; // Import the CSS file for animations and styles

const LandingPage = () => {
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="relative h-screen overflow-hidden flex flex-col justify-center items-center">
      {/* Background Image Container */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-animation"
        style={{ backgroundImage: 'url(src/assets/landingbackground.jpg)' }}
      ></div>

      {/* Semi-Transparent Overlay */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Logo */}
      <div className="p-4 z-10">
        <img
          src="src/assets/logo.png"
          alt="Logo"
          className="h-50 lg:h-64 w-auto mx-auto logo-shadow"
        />
      </div>

      {/* Content */}
      <div className="text-center p-4 z-10">
        <h1 className="text-5xl lg:text-7xl font-bold text-white text-shadow landing-title">
          Welcome to the Online Booking Portal for all your Government Needs
        </h1>
        <p className="text-lg lg:text-xl text-white mt-4 text-shadow landing-subtitle">
          Streamlining City Services: Your Convenient Gateway to Hassle-Free Transactions and Community Engagement.
        </p>

        {/* Learn More Button */}
        <button
          className="mt-8 px-6 py-3 rounded hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-orange-300 to-red-300 text-white"
          onClick={toggleModal}
        >
          Learn More
        </button>
      </div>

      {/* Scroll Down Text */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4">
        <p className="scroll-text text-lg font-semibold text-white animate-bounce text-shadow">
          Scroll down for more City information
        </p>
      </div>

      {/* Modal (conditional rendering) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Project Explanation</h2>
            <p className="text-lg text-gray-700 mb-6">
              This is a project explanation that describes the purpose and goals of the Online Booking Portal.
              It serves as a guide for users to understand the services offered and how to use them efficiently.
            </p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={toggleModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
