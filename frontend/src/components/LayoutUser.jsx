// src/components/Layout.jsx
import 'react';
import {NavbarUser} from "./NavbarUser.jsx";
import {SideBarUser} from "./sideBarUser.jsx";

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Navbar */}
            <NavbarUser />

            {/* Sidebar and Main Content */}
            <div className="flex flex-grow">
                <SideBarUser />
                <main className="flex-grow bg-gray-100 p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
