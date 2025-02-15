// Register.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";

export function Register()  {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        try {
            const response = await axios.post('/api/auth/register', {
                username,
                password,
                role: "employee"
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
            setMessage("Registration successful! Please log in.");
            // Optionally, delay before redirecting
            navigate("/login", { replace: true });
        } catch (error) {
            console.error('Register error:', error.response ? error.response.data : error);
            setMessage(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-gray-600 bg-center flex flex-col">
            {/* Header with logo */}
            <header className="p-4">
                <a href="/" title="POT Branding House">
                    <img
                        src="https://i0.wp.com/potbrandinghouse.com/wp-content/uploads/2020/06/POT_Logomark-White.png?fit=604%2C715&ssl=1"
                        alt="POT Branding House Logo"
                        className="h-12 bg-black"
                    />
                </a>
            </header>

            {/* Centered Register Card */}
            <div className="flex-grow flex items-center justify-center">
                <div className="bg-black bg-opacity-75 p-8 rounded-lg shadow-lg w-full max-w-sm">
                    <h2 className="text-white text-2xl mb-6 text-center">Sign Up</h2>
                    {message && <p className="mb-4 text-red-500">{message}</p>}
                    <form onSubmit={onSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-300 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <a href="/login" className="w-full text-white py-3 rounded font-semibold hover:bg-gray-200 transition block text-center">
                                Already have an account? Sign In
                            </a>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-white text-black py-3 rounded font-semibold hover:bg-gray-200 transition"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
