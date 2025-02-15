const express = require('express');
const router = express.Router();
const {
    Department,
    TaskType,
    PerformanceRating,
    IncentivePayment,
    Employee
} = require('../models'); // Adjust path as needed

// Simple middleware to check if the user is admin.
function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Forbidden: Admins only.' });
}

// Helper to pick allowed keys from an object.
function pick(obj, keys) {
    return keys.reduce((result, key) => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = obj[key];
        }
        return result;
    }, {});
}

// Apply admin check for all routes.


/* ---------------------
   Department Routes
--------------------- */

// Allowed fields for Department.
const departmentFields = ['Name', 'ManagerID'];

// GET all departments (include manager details)
router.get('/departments', async (req, res) => {
    try {
        const departments = await Department.findAll({
            include: [
                { model: Employee, as: 'manager', attributes: ['EmployeeID', 'Name'] }
            ]
        });
        res.json(departments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET department by ID (include manager)
router.get('/departments/:id', async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id, {
            include: [
                { model: Employee, as: 'manager', attributes: ['EmployeeID', 'Name'] }
            ]
        });
        if (department) {
            res.json(department);
        } else {
            res.status(404).json({ message: 'Department not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new department (validate ManagerID exists)
router.post('/departments', async (req, res) => {
    try {
        const deptData = pick(req.body, departmentFields);
        if (deptData.ManagerID) {
            const manager = await Employee.findByPk(deptData.ManagerID);
            if (!manager) {
                return res.status(400).json({ message: 'Invalid ManagerID' });
            }
        }
        const newDept = await Department.create(deptData);
        res.status(201).json(newDept);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE an existing department
router.put('/departments/:id', async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        const deptData = pick(req.body, departmentFields);
        if (deptData.ManagerID) {
            const manager = await Employee.findByPk(deptData.ManagerID);
            if (!manager) {
                return res.status(400).json({ message: 'Invalid ManagerID' });
            }
        }
        await department.update(deptData);
        res.json(department);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a department
router.delete('/departments/:id', async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (department) {
            await department.destroy();
            res.json({ message: 'Department deleted' });
        } else {
            res.status(404).json({ message: 'Department not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ---------------------
   PerformanceRating Routes
--------------------- */

// Allowed fields for PerformanceRating.
const performanceRatingFields = [
    'EmployeeID',
    'ManagerID',
    'Month',
    'Rating',
    'Comments'
];

// GET all performance ratings (include associated employee and manager)
router.get('/performanceratings', async (req, res) => {
    try {
        const ratings = await PerformanceRating.findAll({
            include: [
                { model: Employee, as: 'employee', attributes: ['EmployeeID', 'Name'] },
                { model: Employee, as: 'manager', attributes: ['EmployeeID', 'Name'] }
            ]
        });
        res.json(ratings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET a performance rating by ID (with associations)
router.get('/performanceratings/:id', async (req, res) => {
    try {
        const rating = await PerformanceRating.findByPk(req.params.id, {
            include: [
                { model: Employee, as: 'employee', attributes: ['EmployeeID', 'Name'] },
                { model: Employee, as: 'manager', attributes: ['EmployeeID', 'Name'] }
            ]
        });
        if (rating) {
            res.json(rating);
        } else {
            res.status(404).json({ message: 'PerformanceRating not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new performance rating (validate foreign keys)
router.post('/performanceratings', async (req, res) => {
    try {
        const ratingData = pick(req.body, performanceRatingFields);
        // Validate EmployeeID and ManagerID
        if (ratingData.EmployeeID) {
            const emp = await Employee.findByPk(ratingData.EmployeeID);
            if (!emp) {
                return res.status(400).json({ message: 'Invalid EmployeeID' });
            }
        }
        if (ratingData.ManagerID) {
            const mgr = await Employee.findByPk(ratingData.ManagerID);
            if (!mgr) {
                return res.status(400).json({ message: 'Invalid ManagerID' });
            }
        }
        const newRating = await PerformanceRating.create(ratingData);
        res.status(201).json(newRating);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE an existing performance rating
router.put('/performanceratings/:id', async (req, res) => {
    try {
        const rating = await PerformanceRating.findByPk(req.params.id);
        if (!rating) {
            return res.status(404).json({ message: 'PerformanceRating not found' });
        }
        const ratingData = pick(req.body, performanceRatingFields);
        if (ratingData.EmployeeID) {
            const emp = await Employee.findByPk(ratingData.EmployeeID);
            if (!emp) {
                return res.status(400).json({ message: 'Invalid EmployeeID' });
            }
        }
        if (ratingData.ManagerID) {
            const mgr = await Employee.findByPk(ratingData.ManagerID);
            if (!mgr) {
                return res.status(400).json({ message: 'Invalid ManagerID' });
            }
        }
        await rating.update(ratingData);
        res.json(rating);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a performance rating
router.delete('/performanceratings/:id', async (req, res) => {
    try {
        const rating = await PerformanceRating.findByPk(req.params.id);
        if (rating) {
            await rating.destroy();
            res.json({ message: 'PerformanceRating deleted' });
        } else {
            res.status(404).json({ message: 'PerformanceRating not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ---------------------
   IncentivePayment Routes
--------------------- */

// Allowed fields for IncentivePayment.
const incentivePaymentFields = [
    'PaymentMonth',
    'PaymentDate',
    'IncentiveType',
    'Amount',
    'ApprovalStatus',
    'EmployeeID'
];

// GET all incentive payments (include associated employee)
router.get('/incentivepayments', async (req, res) => {
    try {
        const payments = await IncentivePayment.findAll({
            include: [{ model: Employee, as: 'employee', attributes: ['EmployeeID', 'Name'] }]
        });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET an incentive payment by ID (with association)
router.get('/incentivepayments/:id', async (req, res) => {
    try {
        const payment = await IncentivePayment.findByPk(req.params.id, {
            include: [{ model: Employee, as: 'employee', attributes: ['EmployeeID', 'Name'] }]
        });
        if (payment) {
            res.json(payment);
        } else {
            res.status(404).json({ message: 'IncentivePayment not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new incentive payment (validate EmployeeID)
router.post('/incentivepayments', async (req, res) => {
    try {
        const paymentData = pick(req.body, incentivePaymentFields);
        if (paymentData.EmployeeID) {
            const emp = await Employee.findByPk(paymentData.EmployeeID);
            if (!emp) {
                return res.status(400).json({ message: 'Invalid EmployeeID' });
            }
        }
        const newPayment = await IncentivePayment.create(paymentData);
        res.status(201).json(newPayment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE an existing incentive payment
router.put('/incentivepayments/:id', async (req, res) => {
    try {
        const payment = await IncentivePayment.findByPk(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'IncentivePayment not found' });
        }
        const paymentData = pick(req.body, incentivePaymentFields);
        if (paymentData.EmployeeID) {
            const emp = await Employee.findByPk(paymentData.EmployeeID);
            if (!emp) {
                return res.status(400).json({ message: 'Invalid EmployeeID' });
            }
        }
        await payment.update(paymentData);
        res.json(payment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE an incentive payment
router.delete('/incentivepayments/:id', async (req, res) => {
    try {
        const payment = await IncentivePayment.findByPk(req.params.id);
        if (payment) {
            await payment.destroy();
            res.json({ message: 'IncentivePayment deleted' });
        } else {
            res.status(404).json({ message: 'IncentivePayment not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/tasktypes', async (req, res) => {
    try {
        const taskTypes = await TaskType.findAll();
        res.json(taskTypes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET a task type by ID
router.get('/tasktypes/:id', async (req, res) => {
    try {
        const taskType = await TaskType.findByPk(req.params.id);
        if (taskType) {
            res.json(taskType);
        } else {
            res.status(404).json({ message: 'TaskType not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new task type
router.post('/tasktypes', async (req, res) => {
    try {
        const { Name, IncentiveStaff, IncentiveTrial } = req.body;
        if (!Name || IncentiveStaff === undefined || IncentiveTrial === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const newTaskType = await TaskType.create({ Name, IncentiveStaff, IncentiveTrial });
        res.status(201).json(newTaskType);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE an existing task type
router.put('/tasktypes/:id', async (req, res) => {
    try {
        const taskType = await TaskType.findByPk(req.params.id);
        if (!taskType) {
            return res.status(404).json({ message: 'TaskType not found' });
        }
        const { Name, IncentiveStaff, IncentiveTrial } = req.body;
        await taskType.update({ Name, IncentiveStaff, IncentiveTrial });
        res.json(taskType);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a task type
router.delete('/tasktypes/:id', async (req, res) => {
    try {
        const taskType = await TaskType.findByPk(req.params.id);
        if (taskType) {
            await taskType.destroy();
            res.json({ message: 'TaskType deleted' });
        } else {
            res.status(404).json({ message: 'TaskType not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
