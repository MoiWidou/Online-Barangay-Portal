import React from 'react';



function DocumentTypeSection({ handleDocumentTypeChange }) {



  return (
    <div className="documentTypeSection mx-auto p-8 text-center md:flex md:flex-col"> {/* Added Tailwind CSS classes */}
      <label htmlFor="documentType" className="documentTypeLabel text-lg mb-4 font-bold">
        Select document type:
      </label>
      <select
        id="documentType"
        onChange={handleDocumentTypeChange}
        className="documentTypeSelect text-lg px-4 py-2 border rounded-md mb-2 md:mb-0 text-center" >{/* Added margin bottom for small screens */}
      
        <option value="">Select</option>
        <option value="Type 1" className="business-permit-1">Business Permit</option>
        <option value="Type 2" className="residency">Residency</option>
        <option value="Type 3" className="label-5">Indigency</option>
        <option value="Type 4" className="business-clearance-1">Business Clearance</option>
        <option value="Type 5" className="community-events-and-activities-1">Community events and activities</option>
        <option value="Type 6" className="good-moral-1">Good Moral</option>
      </select>
    </div>
  );
}

export default DocumentTypeSection;
