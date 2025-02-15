// AuthProvider.jsx
import React, { createContext, useContext, useState } from 'react';
import axios from '../api/axios';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

// Custom hook for accessing auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Initialize auth state from localStorage if available
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token') || null,
        role: localStorage.getItem('role') || null,
        username: localStorage.getItem('username') || null,
        userId: localStorage.getItem('userId') || null,
    });

    // Helper to decode token
    const decodeToken = (token) => {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error("Token decoding failed:", error);
            return null;
        }
    };

    // handleLogin function based on the provided backend route
    const handleLogin = async (username, password) => {
        try {
            // Send login request to the backend
            const response = await axios.post(
                '/api/auth/login',
                { username, password },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            // Destructure token from response
            const { token } = response.data;

            // Decode the token to extract additional info
            const decoded = decodeToken(token);
            // For example, if your token payload has userId, role, and username:
            const updatedAuth = {
                token,
                role: decoded.role,
                username: decoded.username,
                userId: decoded.userId,
            };

            // Update auth state
            setAuth(updatedAuth);
            // Persist auth details in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', decoded.role);
            localStorage.setItem('username', decoded.username);
            localStorage.setItem('userId', decoded.userId);

            return { success: true };
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    // Simple logout function to clear auth state
    const handleLogout = () => {
        setAuth({ token: null, role: null, username: null, userId: null });
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
    };

    return (
        <AuthContext.Provider value={{ auth, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
