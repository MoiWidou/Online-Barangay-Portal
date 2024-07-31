import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Announcements from './components/Announcements';
import FAQ from './components/FAQ';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import PictureGallery from './components/PictureGallery';
import { FaArrowUp } from 'react-icons/fa';

const Homepage = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 800; // Define the scroll position threshold

      setShowScrollToTop(scrollPosition > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const startingY = window.pageYOffset;
    const targetY = 0;
    const duration = 1000; // Duration in milliseconds
    const startTime = performance.now();
  
    const easeInOutQuad = (time, start, change, duration) => {
      time /= duration / 2;
      if (time < 1) return change / 2 * time * time + start;
      time--;
      return -change / 2 * (time * (time - 2) - 1) + start;
    };
  
    const scroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      window.scrollTo(0, easeInOutQuad(elapsedTime, startingY, targetY - startingY, duration));
      if (elapsedTime < duration) {
        requestAnimationFrame(scroll);
      }
    };
  
    requestAnimationFrame(scroll);
  };
  

  return (
    <div style={{ backgroundColor: "#f1f5f9" }}>
      {/* Scroll to top button */}
      {showScrollToTop && (
        <button
          className="fixed bottom-10 right-10 z-50 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          onClick={scrollToTop}
        >
          <FaArrowUp />
        </button>
      )}

      {/* Homepage Content */}
      <div className="pt-[calc(20px + 64px)]">
        {/* LandingPage */}
        <LandingPage id="landing" />

        {/* Announcements */}
        <Announcements id="announcements" />

        {/* Picture Gallery */}
        <PictureGallery id="gallery" />
        
        {/* FAQ */}
        <FAQ id="faq" />

        {/* Contact Us */}
        <ContactUs id="contact" />

        {/* Footer */}
        <Footer id="footer" />
      </div>
    </div>
  );
};

export default Homepage;
