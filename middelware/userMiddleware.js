import { config as configDotenv } from 'dotenv'
import jwt from 'jsonwebtoken';


configDotenv();
// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify user token
export const userVerify = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

