'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Employee', [
            {
                EmployeeID: 10122353,
                Name: 'Alice Johnson',
                Email: 'alice.johnson@example.com',
                contractType: 'permanent',
                BankAccountInfo: 'Bank A, Acc: 111222333',

                UserID: 4, // References the first user account
            },
            {
                EmployeeID: 10122354,
                Name: 'Bob Smith',
                Email: 'bob.smith@example.com',
                contractType: 'contract',
                BankAccountInfo: 'Bank B, Acc: 444555666',

                UserID: 5,
            },
            {
                EmployeeID: 10122355,
                Name: 'Charlie Davis',
                Email: 'charlie.davis@example.com',
                contractType: 'permanent',
                BankAccountInfo: 'Bank C, Acc: 777888999',

                UserID: 6,
            },
            {
                EmployeeID: 10122356,
                Name: 'Diana Moore',
                Email: 'diana.moore@example.com',
                contractType: 'permanent',

                UserID: 7,
            },
            {
                EmployeeID: 10122357,
                Name: 'Edward Clark',
                Email: 'edward.clark@example.com',
                contractType: 'contract',
                BankAccountInfo: 'Bank E, Acc: 141516171',

                UserID: 8,
            },
            {
                EmployeeID: 10122358,
                Name: 'Fiona Lee',
                Email: 'fiona.lee@example.com',
                contractType: 'permanent',
                BankAccountInfo: 'Bank F, Acc: 181920212',

                UserID: 9,
            },
            {
                EmployeeID: 10122359,
                Name: 'George Hall',
                Email: 'george.hall@example.com',
                contractType: 'contract',
                BankAccountInfo: 'Bank G, Acc: 222324252',

                UserID: 10,
            },
            {
                EmployeeID: 10122360,
                Name: 'Hannah Adams',
                Email: 'hannah.adams@example.com',
                contractType: 'permanent',
                BankAccountInfo: 'Bank H, Acc: 262728293',

                UserID: 11,
            },
            {
                EmployeeID: 10122361,
                Name: 'Ian Baker',
                Email: 'ian.baker@example.com',
                contractType: 'contract',
                BankAccountInfo: 'Bank I, Acc: 303132333',

                UserID: 12,
            },
            {
                EmployeeID: 10122362,
                Name: 'Julia Roberts',
                Email: 'julia.roberts@example.com',
                contractType: 'permanent',
                BankAccountInfo: 'Bank J, Acc: 343536373',

                UserID: 13,
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Employee', null, {});
    }
};
