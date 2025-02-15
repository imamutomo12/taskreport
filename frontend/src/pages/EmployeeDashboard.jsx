import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import Layout from '../components/Layout';
import axios from '../api/axios';

export default function EmployeeDashboard() {
    const { auth } = useAuth();
    // Assume auth.employeeId is set for logged-in employees.
    const employeeId = auth.employeeId;
    const [employee, setEmployee] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (employeeId) {
            fetchEmployeeData();
            fetchPayments();
        }
    }, [employeeId]);

    const fetchEmployeeData = async () => {
        try {
            // Fetch your employee data (including department) by ID.
            const response = await axios.get(`/api/admin/employees/${employeeId}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setEmployee(response.data);
        } catch (err) {
            setError('Failed to load employee data.');
        }
    };

    const fetchPayments = async () => {
        try {
            // Fetch all incentive payments.
            const response = await axios.get('/api/incentivepayments', {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            // Filter payments belonging only to this employee.
            const empPayments = response.data.filter(
                (pay) => Number(pay.EmployeeID) === Number(employeeId)
            );
            setPayments(empPayments);
        } catch (err) {
            setError('Failed to load incentive payments.');
        } finally {
            setLoading(false);
        }
    };

    // Aggregate total payment amount for the employee.
    const totalPayments = payments.reduce((total, payment) => {
        const amount = parseFloat(payment.Amount) || 0;
        return total + amount;
    }, 0);

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">My Dashboard</h1>
                {error && <p className="text-red-500">{error}</p>}
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        {employee && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold">Profile</h2>
                                <p><strong>Name:</strong> {employee.Name}</p>
                                <p><strong>Email:</strong> {employee.Email || "N/A"}</p>
                                <p>
                                    <strong>Department:</strong>{" "}
                                    {employee.department ? employee.department.Name : "N/A"}
                                </p>
                            </div>
                        )}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">Incentive Payments</h2>
                            <p>
                                <strong>Total Received:</strong> $
                                {totalPayments.toFixed(2)}
                            </p>
                            {payments.length > 0 ? (
                                <table className="min-w-full bg-white shadow rounded-lg mt-2">
                                    <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">Payment Month</th>
                                        <th className="py-2 px-4 border-b">Payment Date</th>
                                        <th className="py-2 px-4 border-b">Incentive Type</th>
                                        <th className="py-2 px-4 border-b">Amount</th>
                                        <th className="py-2 px-4 border-b">Approval Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {payments.map((pay) => (
                                        <tr key={pay.IncentivePaymentID} className="hover:bg-gray-100">
                                            <td className="py-2 px-4 border-b">{pay.PaymentMonth}</td>
                                            <td className="py-2 px-4 border-b">{pay.PaymentDate}</td>
                                            <td className="py-2 px-4 border-b">{pay.IncentiveType}</td>
                                            <td className="py-2 px-4 border-b">
                                                ${parseFloat(pay.Amount).toFixed(2)}
                                            </td>
                                            <td className="py-2 px-4 border-b">{pay.ApprovalStatus}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No incentive payments found.</p>
                            )}
                        </div>
                        {/* Optionally, add sections for TaskReports and TaskRecords if available */}
                    </>
                )}
            </div>
        </Layout>
    );
}
