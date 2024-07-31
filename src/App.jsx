    import React, { useEffect, useState } from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import Navbar from './components/Navbar.jsx';
    import AdminDash from './components/AdminDash.jsx';
    import ProfileSettings from './components/ProfileSettings/ProfileSettings.jsx';
    import LoginSignup from './components/LoginSignup/LoginSignup.jsx';
    import Homepage from './Homepage.jsx'; // Import Homepage component
    import Request from './Request.jsx';
    import { auth } from './firebase'; // Import your Firebase auth instance
    import TrackDocuments from './components/TrackDocuments.jsx';
    import AdminRequest from './components/AdminRequest.jsx';
    import HistoryDocuments from '../src/components/HistoryDocuments.jsx'
    const App = () => {
        const [isLoggedIn, setIsLoggedIn] = useState(false);

        useEffect(() => {
            // Check if the user is logged in
            const unsubscribe = auth.onAuthStateChanged(user => {
                setIsLoggedIn(!!user);
            });

            return () => unsubscribe(); // Cleanup function
        }, []);

        return (
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={isLoggedIn ? <Navigate to="/homepage" /> : <LoginSignup />} />
                    <Route path="/homepage" element={isLoggedIn ? <Homepage /> : <Navigate to="/" />} />
                    <Route path="/request" element={isLoggedIn ? <Request /> : <Navigate to="/" />} />
                    <Route path="/admin" element={isLoggedIn ? <AdminDash /> : <Navigate to="/" />} />
                    <Route path="/profile-settings" element={isLoggedIn ? <ProfileSettings /> : <Navigate to="/" />} />
                    <Route path="/track" element={isLoggedIn ? <TrackDocuments /> : <Navigate to="/" />} />
                    <Route path="/admin" element={isLoggedIn ? <AdminDash /> : <Navigate to="/" />} />
                    <Route path="/adminrequest" element={isLoggedIn ? <AdminRequest /> : <Navigate to="/" />} />
                    <Route path="/history-documents" element={isLoggedIn ? <HistoryDocuments /> : <Navigate to="/" />} />
                </Routes>
            </Router>
        );
    };

    export default App;
