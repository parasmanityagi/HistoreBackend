import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config as configDotenv } from 'dotenv';
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/userSchema.js';
import { successResponse, errorResponse } from '../utils/resWrapper.js';
import { deleteCart } from './cartController.js';

configDotenv();

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET

// Signup controller
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - username
 *               - number
 *               - password
 *               - confirmPassword
 *               - address
 *               - pincode
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               number:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               profile:
 *                 type: string
 *                 format: binary
 *               address:
 *                 type: string
 *               pincode:
 *                 type: number
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request or validation error
 *       500:
 *         description: Server error
 */
export const signup = async (req, res, next) => {
    try {
        const { firstname, lastname, email, username, number, password, confirmPassword/*, address, pincode*/ } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return errorResponse(res, 'User already exists', 400);
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Handle profile image upload
        const image_filename = req.file ? req.file?.filename : "";

        user = new User({
            firstname,
            lastname,
            email,
            username,
            number,
            password: hashedPassword,
            confirmPassword: hashedPassword,
            profile: image_filename, 
            // address,
            // pincode,
            isEmailVerified: false,
            isMobileVerified: false
        });
        
        await user.save();

        const payload = { user: { id: user._id } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        return successResponse(res, { token }, 'User registered successfully', 201);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};




// Login controller
/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
export const login = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return errorResponse(res, 'Invalid credentials', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return errorResponse(res, 'Invalid credentials', 400);
    }

    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return successResponse(res, { token }, 'Logged in successfully');
};



// Update user controller
/**
 * @swagger
 * /update-user:
 *   put:
 *     summary: Update user details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               username:
 *                 type: string
 *               number:
 *                 type: string
 *               address:
 *                 type: string
 *               pincode:
 *                 type: number
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const updateUser = async (req, res, next) => {
    // Fetch the current user data
    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
        return errorResponse(res, 'User not found', 404);
    }

    const updates = {};

    // Compare each field with the current value
    if (req.body.firstname && req.body.firstname !== currentUser.firstname) {
        updates.firstname = req.body.firstname;
    }
    if (req.body.lastname && req.body.lastname !== currentUser.lastname) {
        updates.lastname = req.body.lastname;
    }
    if (req.body.username && req.body.username !== currentUser.username) {
        updates.username = req.body.username;
    }
    if (req.body.number && req.body.number !== currentUser.number) {
        updates.number = req.body.number;
    }
    if (req.file) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const filePath = path.join(__dirname, '../uploads', currentUser.profile);

        fs.unlink(filePath, (err) => {
            if (err && err.code !== 'ENOENT') {
                return errorResponse(res, `Error removing file: ${err.message}`, 404);
            }
        });
        updates.profile = req.file.path;
    }

    // If no updates are made, respond accordingly
    if (Object.keys(updates).length === 0) {
        return successResponse(res, {}, 'No changes made');
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });

    return successResponse(res, {}, 'User updated successfully');
};





// Delete user controller
/**
 * @swagger
 * /delete-user:
 *   delete:
 *     summary: Delete the current user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []  # Token-based authentication (JWT)
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
export const deleteUser = async (req, res, next) => {
    const userId = req.user.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        return errorResponse(res, 'User not found', 404);
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, '../uploads', user?.profile);

    // Attempt to delete the user profile image
    fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error(`Error removing file: ${err.message}`);
        }
    });

    // Pass the user ID to deleteCart
    try {
        await deleteCart(userId);
    } catch (error) {
        console.log(error);
    }

    return successResponse(res, {}, 'User deleted successfully');
};





// Get user by token controller
/**
 * @swagger
 * /get-user:
 *   get:
 *     summary: Get the current user's details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []  # Token-based authentication (JWT)
 *     responses:
 *       200:
 *         description: Get the current user's details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     firstname:
 *                       type: string
 *                       example: John
 *                     lastname:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@gmail.com
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     number:
 *                       type: string
 *                       example: 1234567890
 *                     address:
 *                       type: string
 *                       example: 123 Main St
 *                     pincode:
 *                       type: string
 *                       example: 123456
 *                     profile:
 *                       type: string
 *                       example: profile.jpg
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
export const getUser = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('-password').select('-confirmPassword').select('-createdAt').select('-updatedAt');
    if (!user) {
        return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, user);
};





