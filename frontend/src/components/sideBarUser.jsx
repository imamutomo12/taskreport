import React from "react";
import { useAuth } from "../context/AuthProvider";

export function SideBarUser()  {
    const {handleLogout} = useAuth();
    return (
        <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
            <h2 className="text-xl font-bold mb-8">Dashboard</h2>
            <nav>
                <ul>
                    <li className="mb-4">
                        <a href="#" className="hover:text-gray-300">Home</a>
                    </li>
                    <li className="mb-4">
                        <a href="#" className="hover:text-gray-300">Profile</a>
                    </li>
                    <li className="mb-4">
                        <a href="#" className="hover:text-gray-300">Settings</a>
                    </li>
                    <li className="mb-4">
                        <a onClick={handleLogout} className="hover:text-gray-300">Logout</a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

