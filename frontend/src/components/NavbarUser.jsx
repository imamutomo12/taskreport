import React from "react";
import vite from "../assets/react.svg";
export function NavbarUser()  {
    return (
        <header className="bg-gray-900 text-white p-4 flex items-center justify-between">
            <a title="Task report">
                <img
                    src={vite}
                    alt="POT Branding House Logo"
                    className="h-10"
                />
            </a>
            <nav>
                <ul className="flex space-x-4">
                    <li><a href="/dashboard" className="hover:text-gray-300">Dashboard</a></li>
                    <li><a href="/profile" className="hover:text-gray-300">profile</a></li>

                </ul>
            </nav>
        </header>
    );
};

