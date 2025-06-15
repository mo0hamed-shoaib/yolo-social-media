import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import authService from '../services/auth.service.js';

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const result = await authService.register(req.body, req);
        res.status(201).json({
            success: true,
            ...result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const result = await authService.login(req.body, req);
        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

// Get current user
export const getCurrentUserProfile = async (req, res) => {
    try {
        const user = await authService.getCurrentUser(req.user.id, req);
        console.log("Server - Current User Profile Data Sent to Client:", JSON.stringify(user, null, 2));
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
}; 