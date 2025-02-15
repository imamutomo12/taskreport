// EmployeeProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";

import axios from "../api/axios";
import LayoutUser from "../components/LayoutUser.jsx";

export default function EmployeeProfilePage() {
    const { auth } = useAuth();
    // We assume that auth now includes a userId (from the UserAccount model)
    const userId = auth.userId;
    const [employee, setEmployee] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        EmployeeID : "",
        Name: "",
        Email: "",
        contractType: "",
        BankAccountInfo: "",
        DepartmentID: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // On mount, fetch available departments and try to fetch employee data
    useEffect(() => {
        fetchDepartments();
        if (userId) {
            fetchEmployee();
        } else {
            setError("User ID not available. Please log in again.");
            setLoading(false);
        }
    }, [userId]);

    // Fetch all departments (for dropdown selection)
    const fetchDepartments = async () => {
        try {
            const res = await axios.get("/api/admin/departments", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setDepartments(res.data);
        } catch (err) {
            console.error("Failed to load departments.", err);
        }
    };

    // Fetch the employee record by UserID.
    // Adjust the endpoint as needed. For example, this route should return
    // the Employee record where Employee.UserID equals the given userId.
    const fetchEmployee = async () => {
        try {
            const res = await axios.get(`/api/user/employees/byUserId/${userId}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            if (res.data) {
                setEmployee(res.data);
                setFormData({
                    Name: res.data.Name,
                    Email: res.data.Email,
                    contractType: res.data.contractType,
                    BankAccountInfo: res.data.BankAccountInfo,
                    DepartmentID: res.data.DepartmentID || "",
                });
            }
        } catch (err) {
            console.log("No existing employee record found. Create one.");
            // It's okay if no employee record exists yet.
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (employee) {
                // Update the employee record
                response = await axios.put(`/api/user/employees/${employee.EmployeeID}`, formData, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
            } else {
                // Create a new employee record – include the foreign key UserID
                response = await axios.post(`/api/user/employees`, { ...formData, UserID: userId }, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
            }
            alert("Employee data saved successfully.");
            // Update the local state to reflect changes
            setEmployee(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to save employee data.");
        }
    };

    if (loading) {
        return (
            <LayoutUser>
                <div className="container mx-auto p-4">
                    <p>Loading...</p>
                </div>
            </LayoutUser>
        );
    }

    return (
        <LayoutUser>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">My Employee Profile</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="number"
                        placeholder="Nomor Induk Karyawan"
                        className="p-2 border rounded w-full"
                        value={formData.EmployeeID}
                        onChange={(e) => setFormData({ ...formData, EmployeeID: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Name"
                        className="p-2 border rounded w-full"
                        value={formData.Name}
                        onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="p-2 border rounded w-full"
                        value={formData.Email}
                        onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Contract Type"
                        className="p-2 border rounded w-full"
                        value={formData.contractType}
                        onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Bank Account Info"
                        className="p-2 border rounded w-full"
                        value={formData.BankAccountInfo}
                        onChange={(e) =>
                            setFormData({ ...formData, BankAccountInfo: e.target.value })
                        }
                    />
                    <select
                        className="p-2 border rounded w-full"
                        value={formData.DepartmentID}
                        onChange={(e) =>
                            setFormData({ ...formData, DepartmentID: e.target.value })
                        }
                        required
                    >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept.DepartmentID} value={dept.DepartmentID}>
                                {dept.Name}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                        {employee ? "Update Profile" : "Create Profile"}
                    </button>
                </form>
            </div>
        </LayoutUser>
    );
}
