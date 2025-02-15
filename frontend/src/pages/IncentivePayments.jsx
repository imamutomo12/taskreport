import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Layout from "../components/Layout";
import axios from "../api/axios";

export default function IncentivePayments() {
    const { auth } = useAuth();
    const [payments, setPayments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        PaymentMonth: "",
        PaymentDate: "",
        IncentiveType: "",
        Amount: "",
        ApprovalStatus: "",
        EmployeeID: "",
    });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPayments();
        fetchEmployees();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await axios.get("/api/admin/incentivepayments", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setPayments(response.data);
        } catch (err) {
            setError("Failed to load incentive payments.");
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
                await axios.put(`/api/admin/incentivepayments/${editId}`, formData, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
            } else {
                await axios.post("/api/admin/incentivepayments", formData, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
            }
            setFormData({
                PaymentMonth: "",
                PaymentDate: "",
                IncentiveType: "",
                Amount: "",
                ApprovalStatus: "",
                EmployeeID: "",
            });
            setEditId(null);
            fetchPayments();
        } catch (err) {
            setError("Operation failed.");
        }
    };

    const handleEdit = (payment) => {
        setEditId(payment.IncentivePaymentID);
        setFormData({
            PaymentMonth: payment.PaymentMonth,
            PaymentDate: payment.PaymentDate,
            IncentiveType: payment.IncentiveType,
            Amount: payment.Amount,
            ApprovalStatus: payment.ApprovalStatus,
            EmployeeID: payment.EmployeeID,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/admin/incentivepayments/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            fetchPayments();
        } catch (err) {
            setError("Delete failed.");
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Incentive Payments</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="mb-4 space-y-3">
                    <input
                        type="text"
                        placeholder="Payment Month (YYYY-MM)"
                        className="p-2 border rounded w-full"
                        value={formData.PaymentMonth}
                        onChange={(e) =>
                            setFormData({ ...formData, PaymentMonth: e.target.value })
                        }
                        required
                    />
                    <input
                        type="date"
                        placeholder="Payment Date"
                        className="p-2 border rounded w-full"
                        value={formData.PaymentDate}
                        onChange={(e) =>
                            setFormData({ ...formData, PaymentDate: e.target.value })
                        }
                        required
                    />
                    <input
                        type="text"
                        placeholder="Incentive Type"
                        className="p-2 border rounded w-full"
                        value={formData.IncentiveType}
                        onChange={(e) =>
                            setFormData({ ...formData, IncentiveType: e.target.value })
                        }
                        required
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        className="p-2 border rounded w-full"
                        value={formData.Amount}
                        onChange={(e) =>
                            setFormData({ ...formData, Amount: e.target.value })
                        }
                        required
                        step="0.01"
                    />
                    <input
                        type="text"
                        placeholder="Approval Status"
                        className="p-2 border rounded w-full"
                        value={formData.ApprovalStatus}
                        onChange={(e) =>
                            setFormData({ ...formData, ApprovalStatus: e.target.value })
                        }
                        required
                    />
                    <select
                        className="p-2 border rounded w-full"
                        value={formData.EmployeeID}
                        onChange={(e) =>
                            setFormData({ ...formData, EmployeeID: e.target.value })
                        }
                        required
                    >
                        <option value="">Select Employee</option>
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
                            <th className="py-2 px-4 border-b">Payment Month</th>
                            <th className="py-2 px-4 border-b">Payment Date</th>
                            <th className="py-2 px-4 border-b">Incentive Type</th>
                            <th className="py-2 px-4 border-b">Amount</th>
                            <th className="py-2 px-4 border-b">Approval Status</th>
                            <th className="py-2 px-4 border-b">Employee</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {payments.map((pay) => (
                            <tr key={pay.IncentivePaymentID} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b">{pay.PaymentMonth}</td>
                                <td className="py-2 px-4 border-b">{pay.PaymentDate}</td>
                                <td className="py-2 px-4 border-b">{pay.IncentiveType}</td>
                                <td className="py-2 px-4 border-b">{pay.Amount}</td>
                                <td className="py-2 px-4 border-b">{pay.ApprovalStatus}</td>
                                <td className="py-2 px-4 border-b">
                                    {pay.employee ? pay.employee.Name : "N/A"}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleEdit(pay)}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(pay.IncentivePaymentID)}
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
