'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('UserAccount', [
            {
                Username: 'alice.johnson',
                PasswordHash: '$2b$10$dummyhashforalice', // Replace with a real hash in production
                Role: 'employee',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Username: 'bob.smith',
                PasswordHash: '$2b$10$dummyhashforbob',
                Role: 'employee',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Username: 'charlie.davis',
                PasswordHash: '$2b$10$dummyhashforcharlie',
                Role: 'employee',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Username: 'diana.moore',
                PasswordHash: '$2b$10$dummyhashfordiana',
                Role: 'employee',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Username: 'edward.clark',
                PasswordHash: '$2b$10$dummyhashforedward',
                Role: 'employee',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Username: 'fiona.lee',
                PasswordHash: '$2b$10$dummyhashforfiona',
                Role: 'employee',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Username: 'george.hall',
                PasswordHash: '$2b$10$dummyhashforgeorge',
                Role: 'employee',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Username: 'hannah.adams',
                PasswordHash: '$2b$10$dummyhashforhannah',
                Role: 'employee',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Username: 'ian.baker',
                PasswordHash: '$2b$10$dummyhashforian',
                Role: 'employee',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            },
            {
                Username: 'julia.roberts',
                PasswordHash: '$2b$10$dummyhashforjulia',
                Role: 'employee',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('UserAccount', null, {});
    }
};
