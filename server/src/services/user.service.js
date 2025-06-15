import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const getAllUsers = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await User.countDocuments();

    return {
        users,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

const updateUser = async (userId, updateData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // If password is being updated, hash it
    if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    // Update user
    Object.assign(user, updateData);
    await user.save();

    // Return user without password
    const updatedUser = await User.findById(userId).select('-password');
    return updatedUser;
};

const deleteUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    await user.deleteOne();
    return true;
};

export default {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}; 