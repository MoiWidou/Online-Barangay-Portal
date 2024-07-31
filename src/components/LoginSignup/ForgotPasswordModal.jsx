import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase.js';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resetEmailSent, setResetEmailSent] = useState(false);

    const errorMessages = {
        'auth/invalid-email': 'Invalid email address. Please enter a valid email.',
        'auth/user-not-found': 'User not found. Please check your email and try again.',
    };

    const handleError = (errorCode) => {
        const errorMessage = errorMessages[errorCode] || 'Invalid email address. Please try again.';
        setError(errorMessage);
        setResetEmailSent(false);
        setLoading(false);
    };

    const handleForgotPassword = () => {
        setLoading(true);
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log('Password reset email sent successfully');
                setResetEmailSent(true);
                setEmail(''); // Clear the email input field
                setError(null); // Reset error message when reset email is sent
            })
            .catch((error) => {
                const errorCode = error.code;
                console.error('Forgot password error:', errorCode);
                handleError(errorCode);
            })
            .finally(() => setLoading(false));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
                <div className="mb-4">
                    <input
                        type="email"
                        className="text-input w-full bg-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brown"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => {
                            setError(null); // Reset error on focus
                            setResetEmailSent(false); // Reset reset email message on focus
                        }}
                    />
                </div>
                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                {resetEmailSent && <div className="text-green-500 text-sm mb-4">Reset email sent successfully</div>}
                <div className="flex justify-end">
                    <button
                        className={`mr-2 py-2 px-4 rounded-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brown-700 text-white hover:bg-brown-600 contrast-150 '}`}
                        disabled={loading}
                        onClick={handleForgotPassword}
                    >
                        {loading ? 'Sending...' : 'Send Email'}
                    </button>
                    <button className="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
