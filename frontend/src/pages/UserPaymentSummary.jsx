
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";

import axios from "../api/axios";
import LayoutUser from "../components/LayoutUser.jsx";

export default function UserPaymentSummary() {
    const { auth } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch employees and incentive payments on mount
    useEffect(() => {
        fetchEmployees();
        fetchPayments();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get("/api/user/employees/", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setEmployees(res.data);
        } catch (err) {
            setError("Failed to load employees.");
        }
    };

    const fetchPayments = async () => {
        try {
            const res = await axios.get("/api/user/incentivepayments", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setPayments(res.data);
        } catch (err) {
            setError("Failed to load incentive payments.");
        } finally {
            setLoading(false);
        }
    };

    // Aggregate total payment amount per employee.
    // This creates a mapping: { [EmployeeID]: totalAmount }
    const totalPaymentsByEmployee = payments.reduce((acc, payment) => {
        const empId = payment.EmployeeID;
        // Convert amount to a number (if necessary)
        const amount = parseFloat(payment.Amount) || 0;
        if (acc[empId]) {
            acc[empId] += amount;
        } else {
            acc[empId] = amount;
        }
        return acc;
    }, {});

    return (
        <LayoutUser>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">User Payment Summary</h1>
                {error && <p className="text-red-500">{error}</p>}
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="min-w-full bg-white shadow rounded-lg">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Employee Name</th>
                            <th className="py-2 px-4 border-b">Department</th>
                            <th className="py-2 px-4 border-b">Total Incentive Payment</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.EmployeeID} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b">{emp.Name}</td>
                                <td className="py-2 px-4 border-b">
                                    {emp.department ? emp.department.Name : "N/A"}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    ${totalPaymentsByEmployee[emp.EmployeeID]?.toFixed(2) || "0.00"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </LayoutUser>
    );
}
