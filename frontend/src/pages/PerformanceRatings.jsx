import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Layout from "../components/Layout";
import axios from "../api/axios";

export default function PerformanceRatings() {
    const { auth } = useAuth();
    const [ratings, setRatings] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        Month: "",
        Rating: "",
        Comments: "",
        EmployeeID: "",
        ManagerID: "",
    });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRatings();
        fetchEmployees();
    }, []);

    const fetchRatings = async () => {
        try {
            const response = await axios.get("/api/admin/performanceratings", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setRatings(response.data);
        } catch (err) {
            setError("Failed to load performance ratings.");
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
                await axios.put(`/api/admin/performanceratings/${editId}`, formData, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
            } else {
                await axios.post("/api/admin/performanceratings", formData, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
            }
            setFormData({
                Month: "",
                Rating: "",
                Comments: "",
                EmployeeID: "",
                ManagerID: "",
            });
            setEditId(null);
            fetchRatings();
        } catch (err) {
            setError("Operation failed.");
        }
    };

    const handleEdit = (rating) => {
        setEditId(rating.PerformanceRatingID);
        setFormData({
            Month: rating.Month,
            Rating: rating.Rating,
            Comments: rating.Comments,
            EmployeeID: rating.EmployeeID,
            ManagerID: rating.ManagerID,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/admin/performanceratings/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            fetchRatings();
        } catch (err) {
            setError("Delete failed.");
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Performance Ratings</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="mb-4 space-y-3">
                    <input
                        type="text"
                        placeholder="Month (YYYY-MM)"
                        className="p-2 border rounded w-full"
                        value={formData.Month}
                        onChange={(e) => setFormData({ ...formData, Month: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Rating"
                        className="p-2 border rounded w-full"
                        value={formData.Rating}
                        onChange={(e) => setFormData({ ...formData, Rating: e.target.value })}
                        required
                        step="0.01"
                    />
                    <textarea
                        placeholder="Comments"
                        className="p-2 border rounded w-full"
                        value={formData.Comments}
                        onChange={(e) => setFormData({ ...formData, Comments: e.target.value })}
                    ></textarea>
                    <select
                        className="p-2 border rounded w-full"
                        value={formData.EmployeeID}
                        onChange={(e) => setFormData({ ...formData, EmployeeID: e.target.value })}
                        required
                    >
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                            <option key={emp.EmployeeID} value={emp.EmployeeID}>
                                {emp.Name}
                            </option>
                        ))}
                    </select>
                    <select
                        className="p-2 border rounded w-full"
                        value={formData.ManagerID}
                        onChange={(e) => setFormData({ ...formData, ManagerID: e.target.value })}
                        required
                    >
                        <option value="">Select Manager</option>
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
                            <th className="py-2 px-4 border-b">Month</th>
                            <th className="py-2 px-4 border-b">Rating</th>
                            <th className="py-2 px-4 border-b">Employee</th>
                            <th className="py-2 px-4 border-b">Manager</th>
                            <th className="py-2 px-4 border-b">Comments</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ratings.map((rating) => (
                            <tr key={rating.PerformanceRatingID} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b">{rating.Month}</td>
                                <td className="py-2 px-4 border-b">{rating.Rating}</td>
                                <td className="py-2 px-4 border-b">
                                    {rating.employee ? rating.employee.Name : "N/A"}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {rating.manager ? rating.manager.Name : "N/A"}
                                </td>
                                <td className="py-2 px-4 border-b">{rating.Comments}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleEdit(rating)}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(rating.PerformanceRatingID)}
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
