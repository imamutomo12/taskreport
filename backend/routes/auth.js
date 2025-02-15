// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserAccount } = require('../models'); // Adjust path as needed

// Use an environment variable or secure config for your secret key
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key_here';

// Register endpoint: create a new user
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await UserAccount.findOne({ where: { Username: username } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user record
        const newUser = await UserAccount.create({
            Username: username,
            PasswordHash: hashedPassword,
            Role: role || 'employee'
        });

        return res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Login endpoint: authenticate user and generate token
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await UserAccount.findOne({ where: { Username: username } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Generate a JWT token
        const payload = {
            userId: user.UserID,
            username: user.Username,
            role: user.Role
        };

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        const role = user.Role;

        return res.status(200).json({ message: 'Login successful', token , role });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
