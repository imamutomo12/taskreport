import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Layout from "../components/Layout";
import axios from "../api/axios";

export default function EmployeeTaskReport() {
    const { auth } = useAuth();
    const employeeId = auth.employeeId;
    const [taskRecords, setTaskRecords] = useState([]);
    const [report, setReport] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (employeeId) fetchTaskRecords();
    }, [employeeId]);

    const fetchTaskRecords = async () => {
        try {
            const res = await axios.get("/api/employee/taskrecords", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            const myRecords = res.data.filter(
                (record) => Number(record.EmployeeID) === Number(employeeId)
            );
            setTaskRecords(myRecords);
            generateReport(myRecords);
        } catch (err) {
            setError("Failed to load task records.");
        } finally {
            setLoading(false);
        }
    };

    const generateReport = (records) => {
        const reportData = records.reduce((acc, record) => {
            const month = record.TaskDate.slice(0, 7); // Assuming TaskDate in format "YYYY-MM-DD"
            if (!acc[month]) {
                acc[month] = { totalDuration: 0, count: 0 };
            }
            acc[month].totalDuration += parseFloat(record.Duration) || 0;
            acc[month].count += 1;
            return acc;
        }, {});
        setReport(reportData);
    };

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">My Task Report</h1>
                {error && <p className="text-red-500">{error}</p>}
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-2">Monthly Summary</h2>
                        {Object.keys(report).length > 0 ? (
                            <table className="min-w-full bg-white shadow rounded-lg">
                                <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">Month</th>
                                    <th className="py-2 px-4 border-b">Total Tasks</th>
                                    <th className="py-2 px-4 border-b">Total Duration (hrs)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Object.entries(report).map(([month, data]) => (
                                    <tr key={month} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">{month}</td>
                                        <td className="py-2 px-4 border-b">{data.count}</td>
                                        <td className="py-2 px-4 border-b">
                                            {data.totalDuration.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No task records found for reporting.</p>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
}
