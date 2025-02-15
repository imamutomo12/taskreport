// src/components/Layout.jsx
import 'react';
import {Navbar} from "./Navbar.jsx";
import {SideBar} from "./sideBar.jsx";

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Navbar */}
            <Navbar />

            {/* Sidebar and Main Content */}
            <div className="flex flex-grow">
                <SideBar />
                <main className="flex-grow bg-gray-100 p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
