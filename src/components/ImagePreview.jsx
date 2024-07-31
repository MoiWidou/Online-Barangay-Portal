import React, { useState } from 'react';
import BusinessPermit1 from '../img/businesspermit1.jpg';
import BusinessPermit2 from '../img/businesspermit2.jpg';
import BusinessPermit3 from '../img/businesspermit3.jpg';
import BusinessPermit4 from '../img/businesspermit4.jpg';
import BrgyResidency from '../img/brgyresidency.png';
import BrgyIndigency from '../img/brgyindigency.png';
import SelectImage from '../img/select.jpg';
import BusinessClearance from '../img/businessclearance.png';
import GoodMoral from '../img/goodmoral.png';
import CommunityEvents from '../img/communityevents.png';

function ImagePreview({ documentType }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const getImages = () => {
    switch (documentType) {
      case 'Type 1':
        return [BusinessPermit1, BusinessPermit2, BusinessPermit3, BusinessPermit4];
      case 'Type 2':
        return [BrgyResidency];
      case 'Type 3':
        return [BrgyIndigency];
      case 'Type 4':
        return [BusinessClearance];
      case 'Type 5':
          return [CommunityEvents];
      case 'Type 6':
          return [GoodMoral];
      default:
        return [SelectImage];
    }
  };

  const images = getImages();

  const goToPreviousImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="imagePreviewSection flex items-center justify-center mt-4 mr-4">

      {images && images.length > 0 && (
        <>
          <button onClick={goToPreviousImage} className="mr-2 text-3xl">&#8592;</button>
          <div className="relative"> {/* Added a div for relative positioning */}
            <img
              src={images[currentImageIndex]}
              alt={documentType ? `Preview for ${documentType}` : 'Default Preview'}
              className="previewImage mx-auto" // Center the image horizontally
              style={{ width: '500px', height: '500px',  cursor: 'pointer' }}
              onClick={handleImageClick}
            />
            <div className="absolute bottom-0 left-0 right-0 text-black text-center p-2">
              Click photo to view larger image
            </div>
          </div>
          <button onClick={goToNextImage} className="ml-2 text-3xl">&#8594;</button>
          {showModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center mt-[40px]">
              <div className="bg-white p-4 max-w-3/4 max-h-3/4 overflow-auto">
                <div style={{ maxHeight: '80vh' }}>
                  <img
                    src={images[currentImageIndex]}
                    alt={documentType ? `Full image for ${documentType}` : 'Full Image'}
                    className="max-w-full mx-auto"
                    onClick={closeModal}
                    style={{ width: '80%', height: 'auto' }} // Adjust width as needed
                  />
                </div>
                <button onClick={closeModal} className="absolute top-0 right-0 mt-20 mr-2 bg-red-500 text-white p-4 rounded-full text-base hover:bg-red-800">Close</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ImagePreview;