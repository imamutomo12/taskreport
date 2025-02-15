import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Layout from "../components/Layout";
import axios from "../api/axios";

export  function Dashboard() {
    const { auth } = useAuth();
    const [records, setRecords] = useState([]);
    const [reports, setReports] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [taskTypes, setTaskTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRecords();
        fetchReports();
        fetchEmployees();
        fetchTaskTypes();
    }, []);

    const fetchRecords = async () => {
        try {
            const res = await axios.get("/api/user/taskrecords", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setRecords(res.data);
        } catch (err) {
            setError("Failed to load task records.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchReports = async () => {
        try {
            const res = await axios.get("/api/user/taskreports", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setReports(res.data);
        } catch (err) {
            setError("Failed to load task reports.");
            console.error(err);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await axios.get("/api/user/employees", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setEmployees(res.data);
        } catch (err) {
            console.error("Failed to load employees.", err);
        }
    };

    const fetchTaskTypes = async () => {
        try {
            const res = await axios.get("/api/admin/tasktypes", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setTaskTypes(res.data);
        } catch (err) {
            console.error("Failed to load task types.", err);
        }
    };

    // For admin, we assume task records and reports are managed by separate forms or simply viewed.
    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Admin: Task Records & Reports Management</h1>
                {error && <p className="text-red-500">{error}</p>}
                {loading ? (
                    <p>Loading data...</p>
                ) : (
                    <>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">All Task Records</h2>
                            {records.length ? (
                                <table className="min-w-full bg-white shadow rounded-lg">
                                    <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">Employee</th>
                                        <th className="py-2 px-4 border-b">Task Date</th>
                                        <th className="py-2 px-4 border-b">Duration</th>
                                        <th className="py-2 px-4 border-b">Quantity</th>
                                        <th className="py-2 px-4 border-b">Task Type</th>
                                        <th className="py-2 px-4 border-b">Details</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {records.map((rec) => {
                                        const emp = employees.find(
                                            (e) => e.EmployeeID === rec.EmployeeID
                                        );
                                        const taskTypeName =
                                            taskTypes.find((tt) => tt.TaskTypeID === rec.TaskTypeID)
                                                ?.Name || "N/A";
                                        return (
                                            <tr key={rec.TaskRecordID} className="hover:bg-gray-100">
                                                <td className="py-2 px-4 border-b">{rec.employee.Name}</td>
                                                <td className="py-2 px-4 border-b">{rec.TaskDate}</td>
                                                <td className="py-2 px-4 border-b">{rec.Duration}</td>
                                                <td className="py-2 px-4 border-b">{rec.Quantity}</td>
                                                <td className="py-2 px-4 border-b">{taskTypeName}</td>
                                                <td className="py-2 px-4 border-b">{rec.Details}</td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No task records found.</p>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Aggregated Task Reports</h2>
                            {reports.length ? (
                                <table className="min-w-full bg-white shadow rounded-lg">
                                    <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">Employee</th>
                                        <th className="py-2 px-4 border-b">Report Month</th>
                                        <th className="py-2 px-4 border-b">Submission Date</th>
                                        <th className="py-2 px-4 border-b">Total Hours</th>
                                        <th className="py-2 px-4 border-b">Total Task</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {reports.map((rep) => {
                                        const emp = employees.find(
                                            (e) => e.EmployeeID === rep.EmployeeID
                                        );
                                        return (
                                            <tr key={rep.TaskReportID} className="hover:bg-gray-100">
                                                <td className="py-2 px-4 border-b">{emp ? emp.Name : "N/A"}</td>
                                                <td className="py-2 px-4 border-b">{rep.ReportMonth}</td>
                                                <td className="py-2 px-4 border-b">{rep.SubmissionDate}</td>
                                                <td className="py-2 px-4 border-b">{rep.TotalHours || "N/A"}</td>
                                                <td className="py-2 px-4 border-b">{rep.TotalTask || "N/A"}</td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No task reports available.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}
