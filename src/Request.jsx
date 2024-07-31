import React, { useState } from 'react';
import DocumentTypeSection from './components/DocumentTypeSection';
import InputSection from './components/InputSection';
import ImagePreview from './components/ImagePreview';
import BusinessPermitPage from './pages/BusinessPermitPage'; 
import ResidencyPage from './pages/ResidencyPage';
import IndigencyPage from './pages/IndigencyPage';
import BusinessClearancePage from './pages/BusinessClearancePage'; 
import CommunityEventsPage from './pages/CommunityEvents';
import GoodMoralPage from './pages/GoodMoral';
import Navbar from './components/Navbar';
import TrackDocuments from './components/TrackDocuments';
import CheckDocuments from './components/CheckDocuments';

function Request() {
  // Define state variables
  const [documentType, setDocumentType] = useState('');
  const [numberOfCopies, setNumberOfCopies] = useState('');

  const [redirectToBusinessPermit, setRedirectToBusinessPermit] = useState(false);
  const [redirectToResidency, setRedirectToResidency] = useState(false);
  const [redirectToIndigency, setRedirectToIndigency] = useState(false);
  const [redirectToBusinessClearancePage, setRedirectToBusinessClearancePage] = useState(false);
  const [redirectToCommunityEventsPage, setRedirectToCommunityEventsPage] = useState(false);
  const [redirectToGoodMoralPage, setRedirectToGoodMoralPage] = useState(false);
  const [showTrackDocuments, setShowTrackDocuments] = useState(false);
  const [showCheckDocuments, setShowCheckDocuments] = useState(false);

  const handleButtonClick = (buttonName) => {
    if (buttonName === 'Track Document') {
      setShowTrackDocuments(true);
      setShowCheckDocuments(false); // Hide CheckDocuments when TrackDocuments is shown
    } else {
      setShowTrackDocuments(false);
      setShowCheckDocuments(false);
    }
  };
  
  const handleCheckButton = (buttonName) => {
    if (buttonName === 'Check') {
      setShowTrackDocuments(false); // Hide TrackDocuments when CheckDocuments is shown
      setShowCheckDocuments(true);
    } else {
      setShowTrackDocuments(false);
      setShowCheckDocuments(false);
    }
  };

  // Handle document type change
  const handleDocumentTypeChange = (event) => {
    setDocumentType(event.target.value);
  };

  // Handle input change
  const handleInputChange = (event) => {
    const value = event.target.value.replace(/\D/, '');
    setNumberOfCopies(value);
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log(`Requested ${numberOfCopies} copies.`);
    // Check the selected document type and redirect accordingly
    switch (documentType) {
      case 'Type 1':
        // Redirect to BusinessPermitPage
        setRedirectToBusinessPermit(true);
        break;
      case 'Type 2':
        // Redirect to ResidencyPage
        setRedirectToResidency(true);
        break;
      case 'Type 3':
        // Redirect to IndigencyPage
        setRedirectToIndigency(true);
        break;
      case 'Type 4':
        // Redirect to BusinessClearancePage
        setRedirectToBusinessClearancePage(true);
        break;
      case 'Type 5':
        // Redirect to CommunityEventsPage
        setRedirectToCommunityEventsPage(true);
        break;
      case 'Type 6':
        // Redirect to GoodMoralPage
        setRedirectToGoodMoralPage(true);
        break;
      default:
        // Handle default case (if any)
        break;
    }
  };

  // Redirect based on state
  if (redirectToBusinessPermit) {
    return <BusinessPermitPage numberOfCopies={numberOfCopies} />;
  }

  if (redirectToResidency) {
    return <ResidencyPage numberOfCopies={numberOfCopies} />;
  }

  if (redirectToIndigency) {
    return <IndigencyPage numberOfCopies={numberOfCopies} />;
  }

  if (redirectToBusinessClearancePage) {
    return <BusinessClearancePage numberOfCopies={numberOfCopies}/>;
  }

  if (redirectToCommunityEventsPage) {
    return <CommunityEventsPage numberOfCopies={numberOfCopies}/>;
  }

  if (redirectToGoodMoralPage) {
    return <GoodMoralPage numberOfCopies={numberOfCopies}/>;
  }

  return (
    <div>
      <Navbar handleButtonClick={handleButtonClick} handleDocumentTypeChange={handleDocumentTypeChange} />
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-24 mt-20">
        {showTrackDocuments ? (
          <TrackDocuments handleCheckButton={handleCheckButton} handleDocumentTypeChange={handleDocumentTypeChange} />
        ) : showCheckDocuments ? (
          <CheckDocuments />
        ) : (
          <div>
            <div className="md:flex justify-center">
              <div className="md:w-1/3 mb-4">
                <DocumentTypeSection handleDocumentTypeChange={handleDocumentTypeChange} />
              </div>
              <div className="md:w-1/3 mb-4">
                <InputSection
                  numberOfCopies={numberOfCopies}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                />
              </div>
            </div>
            <div className="md:flex justify-center">
              <div className="md:w-1/2 mb-4">
                <ImagePreview documentType={documentType} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Request;
