const express = require('express');
const router = express.Router();

// Import the models – adjust the relative path as needed.
const {
    Employee,
    TaskReport,
    TaskRecord,
    Department,
    TaskType,
    UserAccount
} = require('../models');

/* ===============================
   Employee Endpoints
   =============================== */

// GET all employees (with department and user account details)
router.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.findAll({
            include: [
                { model: Department, as: 'department' },
                { model: UserAccount, as: 'userAccount' }
            ]
        });
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET a single employee by ID
router.get('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id, {
            include: [
                { model: Department, as: 'department' },
                { model: UserAccount, as: 'userAccount' }
            ]
        });
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new employee
router.post('/employees', async (req, res) => {
    try {
        // req.body should contain all necessary fields, e.g., Name, Email, contractType, DepartmentID, UserID, etc.
        const newEmployee = await Employee.create(req.body);
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE an existing employee
router.put('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        // Update fields from req.body
        await employee.update(req.body);
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE an employee
router.delete('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        await employee.destroy();
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/employees/byUserId/:userId', async (req, res) => {
    try {
        const employee = await Employee.findOne({
            where: { UserID: req.params.userId },
            include: [{ model: Department, as: 'department' }]
        });
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ===============================
   TaskReport Endpoints
   =============================== */

// GET all task reports (including the associated employee)
router.get('/taskreports', async (req, res) => {
    try {
        const reports = await TaskReport.findAll({
            include: [{ model: Employee, as: 'employee' }]
        });
        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET a single task report by ID
router.get('/taskreports/:id', async (req, res) => {
    try {
        const report = await TaskReport.findByPk(req.params.id, {
            include: [{ model: Employee, as: 'employee' }]
        });
        if (!report) {
            return res.status(404).json({ error: 'Task report not found' });
        }
        res.status(200).json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new task report
router.post('/taskreports', async (req, res) => {
    try {
        // Ensure that the EmployeeID in req.body exists. You might want to add an explicit check.
        const newReport = await TaskReport.create(req.body);
        res.status(201).json(newReport);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE an existing task report
router.put('/taskreports/:id', async (req, res) => {
    try {
        const report = await TaskReport.findByPk(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Task report not found' });
        }
        await report.update(req.body);
        res.status(200).json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a task report
router.delete('/taskreports/:id', async (req, res) => {
    try {
        const report = await TaskReport.findByPk(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Task report not found' });
        }
        await report.destroy();
        res.status(200).json({ message: 'Task report deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ===============================
   TaskRecord Endpoints
   =============================== */

// GET all task records (including employee and task type details)
router.get('/taskrecords', async (req, res) => {
    try {
        const records = await TaskRecord.findAll({
            include: [
                { model: Employee, as: 'employee' },
                { model: TaskType, as: 'taskType' }
            ]
        });
        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET a single task record by ID
router.get('/taskrecords/:id', async (req, res) => {
    try {
        const record = await TaskRecord.findByPk(req.params.id, {
            include: [
                { model: Employee, as: 'employee' },
                { model: TaskType, as: 'taskType' }
            ]
        });
        if (!record) {
            return res.status(404).json({ error: 'Task record not found' });
        }
        res.status(200).json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new task record
router.post('/taskrecords', async (req, res) => {
    try {
        // Validate that EmployeeID and TaskTypeID exist if needed.
        const newRecord = await TaskRecord.create(req.body);
        res.status(201).json(newRecord);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE an existing task record
router.put('/taskrecords/:id', async (req, res) => {
    try {
        const record = await TaskRecord.findByPk(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Task record not found' });
        }
        await record.update(req.body);
        res.status(200).json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a task record
router.delete('/taskrecords/:id', async (req, res) => {
    try {
        const record = await TaskRecord.findByPk(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Task record not found' });
        }
        await record.destroy();
        res.status(200).json({ message: 'Task record deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/taskreports/employee/:employeeID', async (req, res) => {
    try {
        const reports = await TaskReport.findAll({
            where: { EmployeeID: req.params.employeeID },
            // Optionally, include associated employee details if needed:
             include: [{ model: Employee, as: 'employee', attributes: ['EmployeeID', 'Name'] }]
        });

            res.status(200).json(reports);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET task records for a given employee by EmployeeID
router.get('/taskrecords/employee/:employeeID', async (req, res) => {
    try {
        const records = await TaskRecord.findAll({
            where: { EmployeeID: req.params.employeeID },
            // Optionally, include associated data such as TaskType:
             include: [{ model: TaskType, as: 'taskType', attributes: ['TaskTypeID', 'Name'] }]
        });

            res.status(200).json(records);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
