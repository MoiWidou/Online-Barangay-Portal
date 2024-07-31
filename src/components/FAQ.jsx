import React, { useState } from 'react';

const FAQ = () => {
  // Sample FAQ data
  const faqData = [
    {
      id: 1,
      question: 'What is the purpose of this portal?',
      answer: 'This portal allows you to book and request various government services and track the progress of your requests. Our goal is to streamline the process and make it more efficient for citizens to access government services without the need for multiple visits to government offices. You can also find detailed information about the services offered, requirements, and expected processing times.',
    },
    {
      id: 2,
      question: 'How can I request a document?',
      answer: 'To request a document, navigate to the "Request Document" section and follow the instructions provided. You will need to fill out an online form with your personal information and the specifics of the document you are requesting. Once submitted, you will receive a confirmation email with your request details and a tracking number. You can use this tracking number to monitor the status of your request in real-time.',
    },
    {
      id: 3,
      question: 'What services are available?',
      answer: 'We offer a wide range of services such as document processing, permit applications, and other community services. This includes birth and marriage certificates, business permits, and various licenses. Each service has its own set of requirements and processing times, which are detailed on the respective service pages. Our portal is designed to make it easier for you to find and apply for the services you need.',
    },
    {
      id: 4,
      question: 'How can I update my personal information?',
      answer: 'You can update your personal information by navigating to the "Profile" section and selecting the "Edit Profile" option. Here, you can update your contact information, address, and other personal details. It is important to keep your information up-to-date to ensure you receive notifications and updates about your requests. After making changes, you will need to verify your email address or phone number to confirm the updates.',
    },
    {
      id: 5,
      question: 'How do I track the progress of my requests?',
      answer: 'Once you have submitted a request, you will receive a tracking number via email. You can use this number to track the status of your request by entering it in the "Track Request" section of the portal. The status will be updated in real-time, showing you each step of the process from submission to completion. You will also receive notifications via email or SMS as your request progresses.',
    },
    {
      id: 6,
      question: 'What should I do if I encounter an issue with my request?',
      answer: 'If you encounter any issues with your request, you can contact our support team through the "Support" section of the portal. Provide your tracking number and a detailed description of the issue. Our team will investigate and provide assistance as soon as possible. We strive to resolve all issues promptly to ensure a smooth experience for our users.',
    },
    {
      id: 7,
      question: 'Can I cancel a request once it has been submitted?',
      answer: 'Yes, you can cancel a request by navigating to the "Track Request" section and selecting the "Cancel Request" option. You will need to provide a reason for the cancellation. Please note that some requests may not be eligible for cancellation if they have already been processed. In such cases, you will receive a notification explaining why the request cannot be cancelled.',
    },
    {
      id: 8,
      question: 'How secure is my personal information?',
      answer: 'We take the security of your personal information very seriously. Our portal uses advanced encryption and security protocols to protect your data. Access to your information is restricted to authorized personnel only. We also conduct regular security audits to ensure that our systems are up-to-date and secure against potential threats. Your privacy is our top priority.',
    },
  ];

  // State to track which question is open
  const [openQuestionId, setOpenQuestionId] = useState(null);

  // Function to toggle question visibility
  const toggleQuestion = (id) => {
    setOpenQuestionId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="container mx-auto py-10 px-4 lg:px-0">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Frequently Asked Questions</h2>
      
      {/* FAQ List */}
      <div className="space-y-4">
        {faqData.map((faq) => (
          <div key={faq.id} className="border border-gray-200 rounded-md shadow-sm overflow-hidden">
            <button
              className="w-full text-left p-3 bg-gradient-to-r from-green-400 to-blue-500 text-white flex justify-between items-center focus:outline-none"
              onClick={() => toggleQuestion(faq.id)}
            >
              <span className="font-medium text-base">{faq.question}</span>
              <span
                className={`transform transition-transform duration-300 ${openQuestionId === faq.id ? 'rotate-180' : ''}`}
              >
                ▼
              </span>
            </button>
            
            {/* Answer */}
            {openQuestionId === faq.id && (
              <div className="p-3 bg-white text-gray-800">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
