
import {useState} from "react";
import {useAuth} from "../context/AuthProvider";
import {Navigate,useNavigate,useLocation} from "react-router-dom";
import vite from "../assets/react.svg";

export function Login()  {
     const { handleLogin } = useAuth();
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

     const onSubmit = async (e) => {
         e.preventDefault();
         const result = await handleLogin(username, password);
         if (!result.success) {
             setMessage(result.message);
         } else {
             setMessage('Login successful!');

             navigate(location.state?.from || "/dashboard", { replace: true });
             // Redirect to dashboard or another protected page
         }
     };
    return (
        <div
            className="min-h-screen bg-cover bg-gray-600 bg-center flex flex-col"
            
        >
            {/* Header with logo */}
            <header className="p-4">
                <a href="" title="taskreport">
                    <img
                        src={vite}
                        alt="POT Branding House Logo"
                        className="h-12 bg-black"
                    />
                </a>
            </header>

            {/* Centered Login Card */}
            <div className="flex-grow flex items-center justify-center">
                <div className="bg-black bg-opacity-75 p-8 rounded-lg shadow-lg w-full max-w-sm">
                    <h2 className="text-white text-2xl mb-6 text-center">Sign In</h2>
                    {message && <p className="mb-4 text-red-500">{message}</p>}
                    <form onSubmit={onSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-300 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
                            />
                        </div>
<div className="mb-6 "><a href="/register" className="w-full   text-white py-3 rounded font-semibold hover:bg-gray-200 transition"> Register</a></div>

                        <button
                            type="submit"
                            className="w-full bg-white text-black py-3 rounded font-semibold hover:bg-gray-200 transition"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

