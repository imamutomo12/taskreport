const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // If token has expired, return a 401 with a clear message.
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            // For other errors, send a 403 (Forbidden)
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        // Attach user details (including roles) to the request
        req.user = decoded;
        next();
    });
}

module.exports = authenticateJWT;
