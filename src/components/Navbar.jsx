import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaAngleDown } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { firestore, auth } from '../firebase.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './navbar.css'; // Import custom CSS file

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // New state to track admin user
    const [activeButton, setActiveButton] = useState('Home');
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [profilePictureURL, setProfilePictureURL] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const profileDropdownRef = useRef(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setIsLoggedIn(true);
                const isAdminUser = user.email === "lumbangremuel@gmail.com";
                setIsAdmin(isAdminUser);
                const fetchProfilePicture = async () => {
                    try {
                        const userInfoQuery = query(collection(firestore, 'userInfo'), where('uid', '==', user.uid));
                        const userInfoSnapshot = await getDocs(userInfoQuery);
                        if (!userInfoSnapshot.empty) {
                            const userInfoData = userInfoSnapshot.docs[0].data();
                            setProfilePictureURL(userInfoData.photoURL);
                        } else {
                            console.error('User info not found');
                        }
                    } catch (error) {
                        console.error('Error fetching user info:', error);
                    }
                };
                fetchProfilePicture();
            } else {
                setIsLoggedIn(false);
                setIsAdmin(false); // Reset isAdmin when logged out
            }
        });
        return () => unsubscribe();
    }, []);

    const toggleProfileDropdown = () => {
        setShowProfileDropdown(!showProfileDropdown);
    };

    const toggleMobileMenu = () => {
        setShowMobileMenu(prevState => !prevState);
        if (!showMobileMenu) {
            document.addEventListener('click', handleClickOutsideMobileMenu);
        } else {
            document.removeEventListener('click', handleClickOutsideMobileMenu);
        }
    };

    const handleClickOutsideMobileMenu = (event) => {
        if (!profileDropdownRef.current.contains(event.target)) {
            setShowMobileMenu(false);
            document.removeEventListener('click', handleClickOutsideMobileMenu);
        }
    };

    const handleLogout = () => {
        auth.signOut().then(() => {
            setIsLoggedIn(false);
            navigate('/');
        }).catch(error => {
            console.error('Logout error:', error);
        });
    };

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
        setShowProfileDropdown(false);
    };

    useEffect(() => {
        const pathname = location.pathname.toLowerCase();
        const buttons = {
            '/homepage': 'Home',
            '/request': 'Request Document',
            '/track': 'Track Document',
            '/history-documents': 'Track Document' // Ensure history documents still highlights Track Document
        };
        const activeButton = location.state?.activeButton || buttons[pathname] || 'Home';
        setActiveButton(activeButton);
    }, [location.pathname, location.state]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="fixed top-0 w-full bg-gray-100 shadow z-50 h-20" style={{ backgroundColor: "#f1f5f9" }}>
            <div className="container mx-auto flex justify-between items-center py-4 px-10 relative">
                <div className="flex items-center">
                    <img src="src/assets/logo.png" alt="Logo" className="h-14 w-auto mr-3" />
                    <span className="text-lg font-semibold text-gray-800">Tanauan City Portal</span>
                </div>

                {isLoggedIn && (
                    <div className="flex items-center">
                        <div className="lg:hidden">
                            <FaBars className="text-3xl cursor-pointer" onClick={toggleMobileMenu} />
                        </div>
                        <div className="hidden lg:flex items-center space-x-4">
                            <Link 
                                to="/homepage" 
                                className={`relative px-4 py-2 nav-link ${activeButton === 'Home' ? 'active' : ''}`} 
                                onClick={() => handleButtonClick('Home')}
                            >
                                Home
                            </Link>
                            {!isAdmin && (
                                <>
                                    <Link 
                                        to="/request" 
                                        className={`relative px-4 py-2 nav-link ${activeButton === 'Request Document' ? 'active' : ''}`} 
                                        onClick={() => handleButtonClick('Request Document')}
                                    >
                                        Request Document
                                    </Link>
                                    <Link 
                                        to="/track" 
                                        className={`relative px-4 py-2 nav-link ${activeButton === 'Track Document' ? 'active' : ''}`} 
                                        onClick={() => handleButtonClick('Track Document')}
                                    >
                                        Track Document
                                    </Link>
                                </>
                            )}
                        </div>
                        <div className="relative">
                            <div className="flex items-center cursor-pointer" onClick={toggleProfileDropdown}>
                                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                                    <img src={profilePictureURL} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                <FaAngleDown className="text-black ml-1" />
                            </div>
                            {showProfileDropdown && (
                                <div className="absolute top-full right-0 bg-white shadow-md py-2 rounded-md mt-2" ref={profileDropdownRef}>
                                    {isAdmin && (
                                        <>
                                            <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100 text-center" onClick={() => handleButtonClick('Admin Dashboard')}>
                                                Admin Dashboard
                                            </Link>
                                            <Link to="/adminrequest" className="block px-4 py-2 hover:bg-gray-100 text-center" onClick={() => handleButtonClick('Admin Requests')}>
                                                Admin Requests
                                            </Link>
                                        </>
                                    )}
                                    <Link to="/profile-settings" className="block px-4 py-2 hover:bg-gray-100 text-center" onClick={() => handleButtonClick('Profile Settings')}>
                                        Profile Settings
                                    </Link>
                                    <button className="block px-4 py-2 hover:bg-gray-100 w-full" onClick={handleLogout}>Log Out</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {showMobileMenu && (
                    <div className="lg:hidden absolute top-full right-0 bg-white shadow-md py-2 rounded-md mt-2">
                        <Link 
                            to="/homepage" 
                            className="block px-4 py-2 hover:bg-gray-100 transition duration-300 ease-in-out" 
                            onClick={() => { handleButtonClick('Home'); toggleMobileMenu(); }}
                        >
                            Home
                        </Link>
                        {!isAdmin && (
                            <>
                                <Link 
                                    to="/request" 
                                    className="block px-4 py-2 hover:bg-gray-100 transition duration-300 ease-in-out" 
                                    onClick={() => { handleButtonClick('Request Document'); toggleMobileMenu(); }}
                                >
                                    Request Document
                                </Link>
                                <Link 
                                    to="/track" 
                                    className="block px-4 py-2 hover:bg-gray-100 transition duration-300 ease-in-out" 
                                    onClick={() => { handleButtonClick('Track Document'); toggleMobileMenu(); }}
                                >
                                    Track Document
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
