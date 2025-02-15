const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

// Department Model
const Department = sequelize.define('Department', {
    DepartmentID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    Name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    ManagerID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: 'Department',
    timestamps: false
});

// UserAccount Model
const UserAccount = sequelize.define('UserAccount', {
    UserID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // auto increment as per schema
        allowNull: false,
    },
    Username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    PasswordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    Role: {
        type: DataTypes.ENUM('employee', 'manager', 'admin'),
        allowNull: false,
        defaultValue: 'employee',
    },
    LastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    CreatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    UpdatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'UserAccount',
    timestamps: false // because CreatedAt/UpdatedAt are explicitly defined
});

// Employee Model
const Employee = sequelize.define('Employee', {
    EmployeeID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    Name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    Email: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
    },
    contractType: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    BankAccountInfo: {
        type: DataTypes.STRING(150),
        allowNull: true,
    },
    DepartmentID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'Employee',
    timestamps: false
});

// IncentivePayment Model
const IncentivePayment = sequelize.define('IncentivePayment', {
    IncentivePaymentID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    EmployeeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    PaymentMonth: {
        type: DataTypes.CHAR(7),
        allowNull: false,
    },
    PaymentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    IncentiveType: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    Amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    ApprovalStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
    }
}, {
    tableName: 'IncentivePayment',
    timestamps: false
});

// PerformanceRating Model
const PerformanceRating = sequelize.define('PerformanceRating', {
    PerformanceRatingID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    EmployeeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ManagerID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Month: {
        type: DataTypes.CHAR(7),
        allowNull: false,
    },
    Rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
    },
    Comments: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: 'PerformanceRating',
    timestamps: false
});

// TaskType Model
// TaskType Model
const TaskType = sequelize.define('TaskType', {
    TaskTypeID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    Name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    // Incentive per hour for a regular staff member (in Rupiah)
    IncentiveStaff: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // Incentive per hour for a trial staff member (Staf Percobaan)
    IncentiveTrial: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'TaskType',
    timestamps: false
});


// TaskRecord Model
const TaskRecord = sequelize.define('TaskRecord', {
    TaskRecordID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    EmployeeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    TaskTypeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    TaskDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    Duration: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
    },
    Quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    Details: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: 'TaskRecord',
    timestamps: false
});

// TaskReport Model
const TaskReport = sequelize.define('TaskReport', {
    TaskReportID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    EmployeeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ReportMonth: {
        type: DataTypes.CHAR(7),
        allowNull: false,
    },
    SubmissionDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    TotalHours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
    TotalTask: {
        type: DataTypes.STRING(45),
        allowNull: true,
    }
}, {
    tableName: 'TaskReport',
    timestamps: false
});

/* --------------------- */
/*  Define Associations  */
/* --------------------- */

// Department Manager (a Department’s Manager is an Employee)
Department.belongsTo(Employee, { foreignKey: 'ManagerID', as: 'manager' });
Employee.hasOne(Department, { foreignKey: 'ManagerID', as: 'managedDepartment' });

// Employee - Department: an Employee belongs to a Department
Employee.belongsTo(Department, { foreignKey: 'DepartmentID', as: 'department' });
Department.hasMany(Employee, { foreignKey: 'DepartmentID', as: 'employees' });

// Employee - UserAccount: an Employee is associated with a UserAccount
Employee.belongsTo(UserAccount, { foreignKey: 'UserID', as: 'userAccount' });
UserAccount.hasOne(Employee, { foreignKey: 'UserID', as: 'employee' });

// IncentivePayment belongs to Employee
IncentivePayment.belongsTo(Employee, { foreignKey: 'EmployeeID', as: 'employee' });
Employee.hasMany(IncentivePayment, { foreignKey: 'EmployeeID', as: 'incentivePayments' });

// PerformanceRating: both the employee being rated and the manager are Employees
PerformanceRating.belongsTo(Employee, { foreignKey: 'EmployeeID', as: 'employee' });
Employee.hasMany(PerformanceRating, { foreignKey: 'EmployeeID', as: 'performanceRatings' });
PerformanceRating.belongsTo(Employee, { foreignKey: 'ManagerID', as: 'manager' });
Employee.hasMany(PerformanceRating, { foreignKey: 'ManagerID', as: 'managedRatings' });

// TaskRecord belongs to Employee and TaskType
TaskRecord.belongsTo(Employee, { foreignKey: 'EmployeeID', as: 'employee' });
Employee.hasMany(TaskRecord, { foreignKey: 'EmployeeID', as: 'taskRecords' });
TaskRecord.belongsTo(TaskType, { foreignKey: 'TaskTypeID', as: 'taskType' });
TaskType.hasMany(TaskRecord, { foreignKey: 'TaskTypeID', as: 'taskRecords' });

// TaskReport belongs to Employee
TaskReport.belongsTo(Employee, { foreignKey: 'EmployeeID', as: 'employee' });
Employee.hasMany(TaskReport, { foreignKey: 'EmployeeID', as: 'taskReports' });

// Export models for use in your Express app
module.exports = {
    Department,
    UserAccount,
    Employee,
    IncentivePayment,
    PerformanceRating,
    TaskType,
    TaskRecord,
    TaskReport,
    sequelize
};

