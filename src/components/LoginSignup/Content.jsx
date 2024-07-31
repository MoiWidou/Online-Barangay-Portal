import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import Logo from '../../assets/logo.png';
import { FaEnvelope, FaLock, FaUser, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import TermsAndConditions from './TermsAndConditions';
import ForgotPasswordModal from './ForgotPasswordModal'; // Import the new modal component

const Content = ({ 
    action, 
    loading, 
    error, 
    resetEmailSent, 
    handleActionChange, 
    handleLogin, 
    handleSignUp, 
    email, 
    setEmail, 
    password, 
    setPassword, 
    fullName, 
    setFullName, 
    address, 
    setAddress, 
    phoneNumber, 
    setPhoneNumber, 
    handleKeyPress // Add handleKeyPress to props
}) => {
    const leftAnimation = useSpring({ opacity: 1, transform: 'translateX(0)', from: { opacity: 0, transform: 'translateX(-50px)' } });
    const rightAnimation = useSpring({ opacity: 1, transform: 'translateX(0)', from: { opacity: 0, transform: 'translateX(50px)' } });

    const [showTerms, setShowTerms] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false); // State to control the visibility of the forgot password modal
    const [agreeTerms, setAgreeTerms] = useState(false);

    const toggleTerms = () => {
        setShowTerms(!showTerms);
    };

    const handleCheckboxChange = () => {
        setAgreeTerms(!agreeTerms);
    };

    return (
        <div className="relative z-10 flex flex-col justify-center items-center pt-20 lg:pt-32">
            <div className="w-full lg:w-2/3 flex flex-col lg:flex-row">
                {/* Left side: Logo and text */}
                <animated.div style={leftAnimation} className="lg:w-1/2 mb-8 flex justify-center items-center mt-10">
                    <div className="text-center">
                        <img src={Logo} alt="Logo" className="w-64 lg:w-80 h-auto mx-auto mb-4 lg:mb-8 rounded-full shadow-xl" />
                        <h1 className='text-5xl lg:text-6xl font-bold text-white mb-4 text-shadow-lg'>
                            Welcome to the Online Booking Portal
                        </h1>
                        <div className={`floating-text animate-bounce ${loading ? 'hidden' : ''}`}>
                            <p className="mt-4 lg:mt-5 text-2xl text-white font-bold text-shadow-lg">
                            Sign In | Log In!
                            </p>
                        </div>
                    </div>
                </animated.div>
                {/* Right side: Login menu */}
                <animated.div style={{ ...rightAnimation, marginTop: '40px' }} className="lg:w-1/2 flex justify-center items-center">
                    <div className="max-w-md bg-white rounded-lg shadow-lg p-8 w-full">
                        <div className="flex items-center mb-8">
                            <h1 className="text-2xl lg:text-3xl font-bold flex-grow">{action === 'Login' ? 'Login' : 'Sign Up'}</h1>
                        </div>
                        <div className="space-y-4">
                            {action === 'Sign Up' && (
                                <>
                                    <div className='flex space-x-4 items-center'>
                                        <FaUser className='w-6 h-6 text-gray-500' />
                                        <input
                                            className='text-input flex-1 bg-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brown'
                                            type='text'
                                            placeholder='Full Name'
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            onFocus={() => setError(null)} // Reset error on focus
                                        />
                                    </div>
                                    <div className='flex space-x-4 items-center'>
                                        <FaMapMarkerAlt className='w-6 h-6 text-gray-500' />
                                        <input
                                            className='text-input flex-1 bg-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brown'
                                            type='text'
                                            placeholder='Address'
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            onFocus={() => setError(null)} // Reset error on focus
                                        />
                                    </div>
                                    <div className='flex space-x-4 items-center'>
                                        <FaPhone className='w-6 h-6 text-gray-500' />
                                        <input
                                            className='text-input flex-1 bg-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brown'
                                            type='text'
                                            placeholder='Phone Number'
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            onFocus={() => setError(null)} // Reset error on focus
                                        />
                                    </div>
                                </>
                            )}
                            {/* Existing email and password fields */}
                            <div className='flex space-x-4 items-center'>
                                <FaEnvelope className='w-6 h-6 text-gray-500' />
                                <input
                                    className='text-input flex-1 bg-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brown'
                                    type='email'
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => {
                                        setError(null); // Reset error on focus
                                        setResetEmailSent(false); // Reset reset email message on focus
                                    }}
                                />
                            </div>
                            <div className='flex space-x-4 items-center'>
                                <FaLock className='w-6 h-6 text-gray-500' />
                                <input
                                    className='text-input flex-1 bg-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brown'
                                    type='password'
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={handleKeyPress} // Add onKeyPress event
                                    onFocus={() => setError(null)} // Reset error on focus
                                />
                            </div>
                            {action === 'Login' && (
                                <div className='forgot-password mt-2 text-right'>
                                    <span className='text-gray-600 text-sm cursor-pointer hover:text-yellow-900' onClick={() => setShowForgotPassword(true)}>Forgot Password?</span>
                                </div>
                            )}
                        </div>
                        {/* Error and success messages */}
                        {error && (
                            <div className="text-red-500 text-sm mb-4">{error}</div>
                        )}
                        {resetEmailSent && (
                            <div className="text-green-500 text-sm mb-4">Reset email sent successfully</div>
                        )}
                        {/* Login or sign up button */}
                        {action === "Login" && (
                            <>
                                <div className='submit-container flex justify-center mt-8'>
                                    <button
                                        style={{ backgroundColor: '#8B5C33', color: '#ffffff' }}
                                        className={`py-3 px-6 rounded-lg font-semibold cursor-pointer transition duration-300 ease-in-out hover:bg-brown hover:text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={loading}
                                        onClick={handleLogin}
                                    >
                                        {loading ? 'Loading...' : 'Login'}
                                    </button>
                                </div>
                                <div className='mt-4 text-center'>
                                    <p>
                                        Don't have an account?{' '}
                                        <span className='text-brown cursor-pointer' onClick={handleActionChange} style={{ fontWeight: 'bold' }}>
                                            Sign Up
                                        </span>
                                    </p>
                                </div>
                            </>
                        )}
                        {action !== "Login" && (
                            <>
                                {/* Terms and conditions */}
                                <div className='forgot-password mt-2 text-center'>
                                    <input type='checkbox' checked={agreeTerms} onChange={handleCheckboxChange} />
                                    <label className='ml-2 text-gray-600'>I agree to the <span className='underline text-brown-300 cursor-pointer hover:text-yellow-900' onClick={toggleTerms}>Terms & Conditions</span></label>
                                </div>
                                {/* Sign up button */}
                                <div className='submit-container flex justify-center mt-8'>
                                    <button
                                        style={{ backgroundColor: '#8B5C33', color: '#ffffff', opacity: agreeTerms ? 1 : 0.5 }}
                                        className={`py-3 px-6 rounded-lg font-semibold cursor-pointer transition duration-300 ease-in-out hover:bg-brown hover:text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={loading || !agreeTerms}
                                        onClick={handleSignUp}
                                    >
                                        {loading ? 'Loading...' : 'Sign Up'}
                                    </button>
                                </div>
                                {/* Already have an account */}
                                <div className='mt-4 text-center'>
                                    <p>
                                        Already have an account?{' '}
                                        <span className='text-brown cursor-pointer' onClick={handleActionChange} style={{ fontWeight: 'bold' }}>
                                            Login
                                        </span>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </animated.div>
            </div>
            {/* Terms and conditions modal */}
            {showTerms && <TermsAndConditions onClose={toggleTerms} />}
            {/* Forgot password modal */}
            <ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
        </div>
    );
}

export default Content;
