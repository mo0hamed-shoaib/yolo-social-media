import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;

        // Connect to MongoDB
        const client = await MongoClient.connect(MONGODB_URI);
        const db = client.db('yolo-social');
        const users = db.collection('users');

        // Find user
        const user = await users.findOne({ email });
        if (!user) {
            await client.close();
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await client.close();
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

        // Return user data (excluding password)
        const { password: _, ...userData } = user;

        await client.close();
        return res.status(200).json({
            success: true,
            token,
            user: userData
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}