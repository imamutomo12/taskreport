import React from "react";
import vite from "../assets/react.svg";

export function Navbar()  {
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
                    <li><a href="/dashboard" className="hover:text-gray-300">home</a></li>
                    <li><a href="/department" className="hover:text-gray-300">Department</a></li>
                    <li><a href="/tasktypes" className="hover:text-gray-300">Tasktypes</a></li>
                    <li><a href="/performanceratings" className="hover:text-gray-300">Performance Rating</a></li>
                    <li><a href="/incentivepayments" className="hover:text-gray-300">Incentive Payment</a></li>
                    <li><a href="/paymentsummary" className="hover:text-gray-300">Payment Summary</a></li>
                </ul>
            </nav>
        </header>
    );
};

