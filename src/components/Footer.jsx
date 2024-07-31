import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        {/* Buttons from the Navbar */}
        <div className="flex justify-center space-x-6 mb-6">
          <Link to="/homepage" className="text-lg font-semibold hover:text-gray-400">
            Home
          </Link>
          <Link to="/request" className="text-lg font-semibold hover:text-gray-400">
            Request Document
          </Link>
          <Link to="/track" className="text-lg font-semibold hover:text-gray-400">
            Track Document
          </Link>
        </div>
        
        {/* Address and Copyright */}
        <div className="text-center">
          {/* Address */}
          <p className="mb-2">1962 J.P. Laurel National Highway, Mataas na Lupa, 4217, Batangas</p>
          
          {/* Copyright */}
          <p>© 2024 Team Alistaire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
