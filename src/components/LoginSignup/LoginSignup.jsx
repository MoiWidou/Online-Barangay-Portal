import React, { useState } from 'react';
import { useNavigate } from 'react-router'; // Import useNavigate instead of useHistory
import { auth, firestore } from '../../firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore'; // Add these imports
import Content from './Content';
import backgroundImg from '../../assets/landingbackground.jpg'; // Import background image

const LoginSignup = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    const [action, setAction] = useState('Sign Up');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const errorMessages = {
        'auth/invalid-credential': 'User not found. Please check your email or password and try again.',
        'auth/invalid-email': 'Invalid email address. Please enter a valid email.',
        'auth/missing-password': 'Missing password. Please try again.',
        'auth/missing-email': 'Email Missing. Please try again. Enter Email only to receive password reset',
        'auth/weak-password': 'Password should be at least 6 characters. Please try again.',
        'auth/email-already-in-use': 'Email already in use. Please try again.',
    };

    const handleError = (errorCode) => {
        const errorMessage = errorMessages[errorCode] || 'An error occurred. Please try again later.';
        setError(errorMessage);
        setResetEmailSent(false); // Reset reset email sent message when an error occurs
        setLoading(false);
    };

    const handleActionChange = () => {
        setError(null); // Reset error message
        setResetEmailSent(false); // Reset reset email sent message
        setAction(prevAction => prevAction === 'Login' ? 'Sign Up' : 'Login');
    };

    const handleSignUp = () => {
        setLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                // Additional user information
                const userInfo = {
                    fullName: fullName,
                    address: address,
                    phoneNumber: phoneNumber,
                    email: email,
                };
                // Create a new document for the user in the 'userInfo' collection
                await addDoc(collection(firestore, 'userInfo'), {
                    uid: user.uid,
                    ...userInfo,
                });
                console.log('Signed up:', user);
            })
            .catch((error) => {
                const errorCode = error.code;
                console.error('Sign up error:', errorCode);
                handleError(errorCode);
            })
            .finally(() => setLoading(false));
    };
    

    const handleLogin = () => {
        setLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('Logged in:', user);
                // Redirect to Homepage.jsx after successful login
                navigate('/homepage'); // Use navigate instead of history.push
            })
            .catch((error) => {
                const errorCode = error.code;
                console.error('Login error:', errorCode);
                handleError(errorCode);
            })
            .finally(() => setLoading(false));
    };

    const handleForgotPassword = () => {
        setLoading(true);
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log('Password reset email sent successfully');
                setResetEmailSent(true);
                setError(null); // Reset error message when reset email is sent
            })
            .catch((error) => {
                const errorCode = error.code;
                console.error('Forgot password error:', errorCode);
                handleError(errorCode);
            })
            .finally(() => setLoading(false));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            action === 'Login' ? handleLogin() : handleSignUp();
        }
    };

    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0" style={{ backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(5px)' }}></div>
            <div className="absolute inset-0 bg-black opacity-50"></div> {/* Semi-transparent overlay */}
            <div className="relative z-10"> {/* Ensure content is above the overlay */}
                <Content
                    action={action}
                    loading={loading}
                    error={error}
                    resetEmailSent={resetEmailSent}
                    handleActionChange={handleActionChange}
                    handleLogin={handleLogin}
                    handleSignUp={handleSignUp}
                    handleForgotPassword={handleForgotPassword}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    fullName={fullName} // Pass fullName state
                    setFullName={setFullName} // Pass setFullName function
                    address={address} // Pass address state
                    setAddress={setAddress} // Pass setAddress function
                    phoneNumber={phoneNumber} // Pass phoneNumber state
                    setPhoneNumber={setPhoneNumber} // Pass setPhoneNumber function
                    handleKeyPress={handleKeyPress} // Pass the handleKeyPress prop
                />
            </div>
        </div>
    );
}

export default LoginSignup;
