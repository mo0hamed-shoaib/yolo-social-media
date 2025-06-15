import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Default profile picture URL (must match the one in user.model.js)
export const DEFAULT_PFP = 'https://i.ibb.co/8nhPf8Q0/default-pfp.png';

// Helper to get full URL for profile picture
export const getFullProfilePictureUrl = (profilePicture, req) => {
    console.log("getFullProfilePictureUrl - Input profilePicture:", profilePicture);
    if (profilePicture && (profilePicture.startsWith('http://') || profilePicture.startsWith('https://'))) {
        console.log("getFullProfilePictureUrl - Returning existing absolute URL:", profilePicture);
        return profilePicture; // Already a full URL
    } else if (profilePicture && profilePicture.startsWith('/uploads/')) {
        // If it's a relative path from uploads, make it absolute
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const fullUrl = `${baseUrl}${profilePicture}`;
        console.log("getFullProfilePictureUrl - Returning absolute URL from relative path:", fullUrl);
        return fullUrl;
    } else {
        console.log("getFullProfilePictureUrl - Returning default PFP:", DEFAULT_PFP);
        return DEFAULT_PFP; // Use default if empty or not a valid URL/path
    }
};

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

const register = async (userData, req) => {
    const { username, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        throw new Error('User already exists with this email or username');
    }

    // Create user
    const user = await User.create({
        username,
        email,
        password
    });

    // Generate token
    const token = generateToken(user);

    return {
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: getFullProfilePictureUrl(user.profilePicture, req)
        },
        token
    };
};

const login = async (credentials, req) => {
    const { email, password } = credentials;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user);

    return {
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: getFullProfilePictureUrl(user.profilePicture, req)
        },
        token
    };
};

const getCurrentUser = async (userId, req) => {
    const userDoc = await User.findById(userId).select('-password');
    if (!userDoc) {
        throw new Error('User not found');
    }
    const user = userDoc.toObject(); // Convert Mongoose document to plain object

    // Ensure profilePicture is a full URL
    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: getFullProfilePictureUrl(user.profilePicture, req),
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

export default {
    register,
    login,
    getCurrentUser
}; 