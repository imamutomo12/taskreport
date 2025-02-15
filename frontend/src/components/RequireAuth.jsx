import { useLocation,Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import {jwtDecode} from "jwt-decode";
import {useEffect, useRef} from "react";

// Helper function to check token validity
const isTokenValid = (token) => {
    if (!token) return false;
    try {
        const { exp } = jwtDecode(token);
        return Date.now() < exp * 1000; // exp is in seconds, convert to ms
    } catch (error) {
        return false;
    }
};

const RequireAuth = ({ allowedRoles }) => {
    const { auth, handleLogout } = useAuth();
    const location = useLocation();
    const tokenIsValid = auth?.token && isTokenValid(auth.token);
    const logoutCalledRef = useRef(false);
    console.log(auth.role)
    useEffect(() => {
        // Only call handleLogout once if token is invalid.
        if (!tokenIsValid && !logoutCalledRef.current) {
            logoutCalledRef.current = true;
            handleLogout();
        }
    }, [tokenIsValid]);

    // If no token or the token is expired, clear auth state and redirect to login
    if (!tokenIsValid) {
        // Optionally clear stored auth state
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If roles are provided and the user's role is not allowed, redirect elsewhere (e.g., to a home or unauthorized page)

    if (
        allowedRoles &&
        !(
            typeof auth.role === "string"
                ? allowedRoles.includes(auth.role)
                : Array.isArray(auth.role) && auth.role.some(r => allowedRoles.includes(r))
        )
    ) {
        return
        console.log(allowedRoles,auth.role);
        <Navigate to="/login" state={{ from: location }} replace />;
    }


    // Token exists, is valid, and user has the proper role; render protected routes.
    return <Outlet />;
};

export default RequireAuth;
