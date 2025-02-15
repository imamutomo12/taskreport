// app.js
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const cors = require('cors');
const authenticareJWT = require('./middleware/authenticateJWT');
const user = require('./routes/user');

const adminRouter = require('./routes/admin');

// Middleware to parse JSON bodies
app.use(express.json());


app.use(cors({
    origin: 'http://localhost:5173', // specify the frontend origin
    credentials: true,
}));

// Mount the auth routes under /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/user', user);
app.use('/api/admin', adminRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
