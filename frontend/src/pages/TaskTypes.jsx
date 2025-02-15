import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Layout from "../components/Layout";
import axios from "../api/axios";

export default function TaskTypes() {
    const { auth } = useAuth();
    const [taskTypes, setTaskTypes] = useState([]);
    const [formData, setFormData] = useState({ Name: "", IncentiveStaff: "", IncentiveTrial: "" });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTaskTypes();
    }, []);

    const fetchTaskTypes = async () => {
        try {
            const response = await axios.get("/api/admin/tasktypes", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setTaskTypes(response.data);
        } catch (err) {
            setError("Failed to load task types.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`/api/admin/tasktypes/${editId}`, formData, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
            } else {
                await axios.post("/api/admin/tasktypes", formData, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
            }
            setFormData({ Name: "", IncentiveStaff: "", IncentiveTrial: "" });
            setEditId(null);
            fetchTaskTypes();
        } catch (err) {
            setError("Operation failed.");
        }
    };

    const handleEdit = (taskType) => {
        setEditId(taskType.TaskTypeID);
        setFormData({
            Name: taskType.Name,
            IncentiveStaff: taskType.IncentiveStaff,
            IncentiveTrial: taskType.IncentiveTrial
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/admin/tasktypes/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            fetchTaskTypes();
        } catch (err) {
            setError("Delete failed.");
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Task Types</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="mb-4 space-y-3">
                    <input
                        type="text"
                        placeholder="Task Type Name"
                        className="p-2 border rounded w-full"
                        value={formData.Name}
                        onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Incentive for Staff (in Rupiah)"
                        className="p-2 border rounded w-full"
                        value={formData.IncentiveStaff}
                        onChange={(e) => setFormData({ ...formData, IncentiveStaff: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Incentive for Trial Staff (in Rupiah)"
                        className="p-2 border rounded w-full"
                        value={formData.IncentiveTrial}
                        onChange={(e) => setFormData({ ...formData, IncentiveTrial: e.target.value })}
                        required
                    />
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
                            <th className="py-2 px-4 border-b">Incentive for Staff</th>
                            <th className="py-2 px-4 border-b">Incentive for Trial Staff</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {taskTypes.map((task) => (
                            <tr key={task.TaskTypeID} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b">{task.Name}</td>
                                <td className="py-2 px-4 border-b">{task.IncentiveStaff}</td>
                                <td className="py-2 px-4 border-b">{task.IncentiveTrial}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleEdit(task)}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(task.TaskTypeID)}
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
