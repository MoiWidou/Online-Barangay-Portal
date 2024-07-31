import React from 'react';

const TermsAndConditions = ({ onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg max-w-3xl overflow-auto relative">
                <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>Close</button>
                <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
                <div className="max-h-96 overflow-y-auto">
                <p>
                        Welcome to the Tanauan City Online Permit and Clearance System (the "Service"), provided to you by FourPointZero ("we," "us," or "our"). These Terms and Conditions ("Terms") govern your use of the Service. By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Service.
                        <br/><br/>
                        1. Use of the Service
                        <br/><br/>
                        1.1. Eligibility: You must be at least 18 years old and capable of forming a binding contract to use the Service. By accessing or using the Service, you represent and warrant that you meet these eligibility requirements.
                        <br/><br/>
                        1.2. Account Registration: In order to use certain features of the Service, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                        <br/><br/>
                        1.3. Permits and Clearances: The Service allows users to apply for various permits and clearances issued by the City Government of Tanauan, Philippines. All applications are subject to approval by the relevant government authorities.
                        <br/><br/>
                        2. User Conduct
                        <br/><br/>
                        2.1. Compliance with Laws: You agree to use the Service in compliance with all applicable laws, rules, and regulations.
                        <br/><br/>
                        2.2. Prohibited Activities: You may not engage in any of the following activities in connection with your use of the Service:
                        <br/><br/>
                        Violating any third party's rights, including intellectual property rights.
                        Uploading or transmitting viruses or other malicious code.
                        Attempting to gain unauthorized access to the Service or its related systems or networks.
                        Engaging in any activity that interferes with or disrupts the Service or its servers or networks.
                        <br/><br/>
                        3. Fees and Payment
                        <br/><br/>
                        3.1. Fees: Certain features of the Service may be subject to payment of fees. You agree to pay all fees associated with your use of such features.
                        <br/><br/>
                        3.2. Payment Processing: Payments made through the Service are processed by third-party payment processors. We are not responsible for any errors or issues that may arise in connection with such payments.
                        <br/><br/>
                        4. Disclaimer of Warranties
                        <br/><br/>
                        4.1. The Service is provided on an "as is" and "as available" basis, without any warranties of any kind, express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components.
                        <br/><br/>
                        5. Limitation of Liability
                        <br/><br/>
                        5.1. In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, arising out of or in connection with your use of the Service.
                        <br/><br/>
                        6. Governing Law
                        <br/><br/>
                        6.1. These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of the Republic of the Philippines.
                        <br/><br/>
                        7. Changes to the Terms
                        <br/><br/>
                        7.1. We reserve the right to modify or update these Terms at any time. Any changes to these Terms will be effective immediately upon posting the revised Terms on the Service. Your continued use of the Service after any such changes constitutes your acceptance of the revised Terms.
                        <br/><br/>
                        8. Contact Us
                        <br/><br/>
                        8.1. If you have any questions or concerns about these Terms, please contact us at [Contact Email].
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TermsAndConditions;
