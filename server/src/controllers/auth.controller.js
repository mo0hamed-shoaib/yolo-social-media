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
        console.log('Login attempt:', req.body); // Log the request body
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Missing credentials:', { email: !!email, password: !!password });
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password'
            });
        }

        const user = await User.findOne({ email });
        console.log('User found:', !!user); // Log if user was found

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch); // Log if password matched

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = generateToken(user._id);
        console.log('Token generated successfully'); // Log token generation

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Login error:', error); // Log any errors
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
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