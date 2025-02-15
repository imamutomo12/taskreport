import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthProvider";
import LayoutUser from "../components/LayoutUser.jsx";
import axios from "../api/axios";
import ConfirmModal from "../components/ConfirmModal.jsx";

export default function EmployeeTaskRecord() {
    const { auth } = useAuth();
    const [employee, setEmployee] = useState(null);
    const [taskRecords, setTaskRecords] = useState([]);
    const [taskReports, setTaskReports] = useState([]);
    const [taskTypes, setTaskTypes] = useState([]);
    const [recordFormData, setRecordFormData] = useState({
        EmployeeID: "",
        TaskTypeID: "",
        TaskDate: "",
        Duration: "",
        Quantity: "",
        Details: "",
    });
    const [recordEditId, setRecordEditId] = useState(null);
    const [loadingEmployee, setLoadingEmployee] = useState(true);
    const [loadingRecords, setLoadingRecords] = useState(true);
    const [loadingReports, setLoadingReports] = useState(true);
    const [error, setError] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [recordIdToDelete, setRecordIdToDelete] = useState(null);

    // Fetch employee data using the new endpoint
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const res = await axios.get(
                    `/api/user/employees/byUserId/${auth.userId}`,
                    { headers: { Authorization: `Bearer ${auth.token}` } }
                );
                // Only update state if data changed
                if (JSON.stringify(res.data) !== JSON.stringify(employee)) {
                    setEmployee(res.data);
                    setRecordFormData({ ...recordFormData, EmployeeID: res.data.EmployeeID });
                }
            } catch (err) {
                setError("Failed to fetch employee data.");
                console.error(err);
            } finally {
                setLoadingEmployee(false);
            }
        };

        if (auth.userId) {
            fetchEmployee();
        } else {
            setError("User not logged in properly.");
            setLoadingEmployee(false);
        }
    }, [auth.userId, auth.token, employee]);

    // Fetch task types once employee is loaded
    useEffect(() => {
        const fetchTaskTypes = async () => {
            try {
                const res = await axios.get("/api/admin/tasktypes", {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                setTaskTypes(res.data);
            } catch (err) {
                setError("Failed to fetch task types.");
                console.error(err);
            }
        };

        if (employee) {
            fetchTaskTypes();
        }
    }, [employee, auth.token]);

    // Memoized fetch functions for task records and reports
    const fetchTaskRecords = useCallback(async () => {
        setLoadingRecords(true);
        try {
            const res = await axios.get(
                `/api/user/taskrecords/employee/${employee?.EmployeeID}`,
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            setTaskRecords(res.data);
        } catch (err) {
            // If 404, assume no records and set empty array
            if (err.response && err.response.status === 404) {
                setTaskRecords([]);
            } else {
                setError("Failed to fetch task records.");
                console.error(err);
            }
        } finally {
            setLoadingRecords(false);
        }
    }, [employee?.EmployeeID, auth.token]);

    const fetchTaskReports = useCallback(async () => {
        setLoadingReports(true);
        try {
            const res = await axios.get(
                `/api/user/taskreports/employee/${employee?.EmployeeID}`,
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            setTaskReports(res.data);
        } catch (err) {
            // If 404, assume no reports and set empty array
            if (err.response && err.response.status === 404) {
                setTaskReports([]);
            } else {
                setError("Failed to fetch task reports.");
                console.error(err);
            }
        } finally {
            setLoadingReports(false);
        }
    }, [employee?.EmployeeID, auth.token]);

    // Fetch task records and reports when employee changes
    useEffect(() => {
        if (employee?.EmployeeID) {
            fetchTaskRecords();
            fetchTaskReports();
        }
    }, [employee?.EmployeeID, fetchTaskRecords, fetchTaskReports]);

    const handleRecordSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { ...recordFormData, EmployeeID: employee.EmployeeID };
            if (recordEditId) {
                await axios.put(`/api/user/taskrecords/${recordEditId}`, data, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
            } else {
                await axios.post("/api/user/taskrecords", data, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
            }
            setRecordFormData({
                EmployeeID: "",
                TaskTypeID: "",
                TaskDate: "",
                Duration: "",
                Quantity: "",
                Details: "",
            });
            setRecordEditId(null);
            fetchTaskRecords();
            fetchTaskReports();
        } catch (err) {
            setError("Operation on task record failed.");
            console.error(err);
        }
    };

    const handleRecordEdit = (record) => {
        setRecordEditId(record.TaskRecordID);
        setRecordFormData({
            EmployeeID: record.EmployeeID,
            TaskTypeID: record.TaskTypeID,
            TaskDate: record.TaskDate,
            Duration: record.Duration,
            Quantity: record.Quantity,
            Details: record.Details,
        });
    };

    // Instead of directly calling delete, open a modal
    const handleRecordDeleteClick = (id) => {
        setRecordIdToDelete(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        setShowConfirmModal(false);
        try {
            await axios.delete(`/api/user/taskrecords/${recordIdToDelete}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            fetchTaskRecords();
            fetchTaskReports();
        } catch (err) {
            setError("Delete failed.");
            console.error(err);
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setRecordIdToDelete(null);
    };

    if (loadingEmployee) {
        return (
            <LayoutUser>
                <div className="container mx-auto p-4">
                    <p>Loading employee data...</p>
                </div>
            </LayoutUser>
        );
    }

    if (error) {
        return (
            <LayoutUser>
                <div className="container mx-auto p-4">
                    <p className="text-red-500">{error}</p>
                </div>
            </LayoutUser>
        );
    }

    if (!employee) {
        return (
            <LayoutUser>
                <div className="container mx-auto p-4">
                    <p>Please complete your employee registration to add task records.</p>
                </div>
            </LayoutUser>
        );
    }

    return (
        <LayoutUser>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">My Task Dashboard</h1>
                <h2 className="text-xl font-semibold mb-2">Welcome, {employee.Name}!</h2>

                {/* Task Record Form */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">Add / Update Task Record</h3>
                    <form onSubmit={handleRecordSubmit} className="space-y-3">
                        <select
                            className="p-2 border rounded w-full"
                            value={recordFormData.TaskTypeID}
                            onChange={(e) =>
                                setRecordFormData({ ...recordFormData, TaskTypeID: e.target.value })
                            }
                            required
                        >
                            <option value="">Select Task Type</option>
                            {taskTypes.map((tt) => (
                                <option key={tt.TaskTypeID} value={tt.TaskTypeID}>
                                    {tt.Name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            className="p-2 border rounded w-full"
                            value={recordFormData.TaskDate}
                            onChange={(e) =>
                                setRecordFormData({ ...recordFormData, TaskDate: e.target.value })
                            }
                            required
                        />
                        <input
                            type="number"
                            placeholder="Duration (hours)"
                            className="p-2 border rounded w-full"
                            value={recordFormData.Duration}
                            onChange={(e) =>
                                setRecordFormData({ ...recordFormData, Duration: e.target.value })
                            }
                            required
                            step="0.01"
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            className="p-2 border rounded w-full"
                            value={recordFormData.Quantity}
                            onChange={(e) =>
                                setRecordFormData({ ...recordFormData, Quantity: e.target.value })
                            }
                            required
                        />
                        <textarea
                            placeholder="Details"
                            className="p-2 border rounded w-full"
                            value={recordFormData.Details}
                            onChange={(e) =>
                                setRecordFormData({ ...recordFormData, Details: e.target.value })
                            }
                        ></textarea>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                            {recordEditId ? "Update Task Record" : "Add Task Record"}
                        </button>
                    </form>
                </div>

                {/* Task Records Table */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">My Task Records</h3>
                    {loadingRecords ? (
                        <p>Loading task records...</p>
                    ) : taskRecords.length ? (
                        <table className="min-w-full bg-white shadow rounded-lg">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Task Type</th>
                                <th className="py-2 px-4 border-b">Date</th>
                                <th className="py-2 px-4 border-b">Duration</th>
                                <th className="py-2 px-4 border-b">Quantity</th>
                                <th className="py-2 px-4 border-b">Details</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {taskRecords.map((record) => {
                                const taskTypeName =
                                    taskTypes.find((tt) => tt.TaskTypeID === record.TaskTypeID)
                                        ?.Name || "N/A";
                                return (
                                    <tr key={record.TaskRecordID} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">{taskTypeName}</td>
                                        <td className="py-2 px-4 border-b">{record.TaskDate}</td>
                                        <td className="py-2 px-4 border-b">{record.Duration}</td>
                                        <td className="py-2 px-4 border-b">{record.Quantity}</td>
                                        <td className="py-2 px-4 border-b">{record.Details}</td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => handleRecordEdit(record)}
                                                className="px-3 py-1 bg-yellow-500 text-white rounded mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleRecordDeleteClick(record.TaskRecordID)}
                                                className="px-3 py-1 bg-red-500 text-white rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    ) : (
                        // If no task records, render the form so the user can add one.
                        <p>No task records found. You can add one above.</p>
                    )}
                </div>

                {/* Task Reports Table */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">My Task Reports</h3>
                    {loadingReports ? (
                        <p>Loading task reports...</p>
                    ) : taskReports.length ? (
                        <table className="min-w-full bg-white shadow rounded-lg">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Report Month</th>
                                <th className="py-2 px-4 border-b">Submission Date</th>
                                <th className="py-2 px-4 border-b">Total Hours</th>
                                <th className="py-2 px-4 border-b">Total Task</th>
                            </tr>
                            </thead>
                            <tbody>
                            {taskReports.map((report) => (
                                <tr key={report.TaskReportID} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{report.ReportMonth}</td>
                                    <td className="py-2 px-4 border-b">{report.SubmissionDate}</td>
                                    <td className="py-2 px-4 border-b">{report.TotalHours || "N/A"}</td>
                                    <td className="py-2 px-4 border-b">{report.TotalTask || "N/A"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No task reports available.</p>
                    )}
                </div>
                {/* Confirm Delete Modal */}
                {showConfirmModal && (
                    <ConfirmModal
                        message="Are you sure you want to delete this record?"
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                    />
                )}
            </div>
        </LayoutUser>
    );
}
