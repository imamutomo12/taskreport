import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Layout from "../components/Layout";
import axios from "../api/axios";

export default function Departments() {
    const { auth } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]); // For populating manager options
    const [formData, setFormData] = useState({ Name: "", ManagerID: "" });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch departments and employees on component mount.
    useEffect(() => {
        fetchDepartments();
        fetchEmployees();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get("/api/admin/departments", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setDepartments(response.data);
        } catch (err) {
            setError("Failed to load departments.");
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get("/api/user/employees", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setEmployees(response.data);
        } catch (err) {
            console.error("Failed to load employees.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`/api/admin/departments/${editId}`, formData, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
            } else {
                await axios.post("/api/admin/departments", formData, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
            }
            setFormData({ Name: "", ManagerID: "" });
            setEditId(null);
            fetchDepartments();
        } catch (err) {
            setError("Operation failed.");
        }
    };

    const handleEdit = (dept) => {
        setEditId(dept.DepartmentID);
        setFormData({
            Name: dept.Name,
            ManagerID: dept.ManagerID || ""  // Fallback if null
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/admin/departments/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            fetchDepartments();
        } catch (err) {
            setError("Delete failed.");
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Departments</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="mb-4 space-y-3">
                    <input
                        type="text"
                        placeholder="Department Name"
                        className="p-2 border rounded w-full"
                        value={formData.Name}
                        onChange={(e) =>
                            setFormData({ ...formData, Name: e.target.value })
                        }
                        required
                    />
                    <select
                        className="p-2 border rounded w-full"
                        value={formData.ManagerID}
                        onChange={(e) =>
                            setFormData({ ...formData, ManagerID: e.target.value })
                        }

                    >
                        <option value={null}>Select Manager</option>
                        {employees.map((emp) => (
                            <option key={emp.EmployeeID} value={emp.EmployeeID}>
                                {emp.Name}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                        {editId ? "Update" : "Add"}
                    </button>
                </form>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="min-w-full bg-white shadow rounded-lg">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Manager</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {departments.map((dept) => (
                            <tr key={dept.DepartmentID} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b">{dept.Name}</td>
                                <td className="py-2 px-4 border-b">
                                    {dept.manager ? dept.manager.Name : "N/A"}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleEdit(dept)}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dept.DepartmentID)}
                                        className="px-3 py-1 bg-red-500 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
}
