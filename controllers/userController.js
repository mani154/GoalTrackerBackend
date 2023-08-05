const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

/**
 * @desc Register new user
 * @route POST /api/users/register
 * @access Public
 */
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    const errorMessage = (!name || !email || !password) 
                            ? 'Please provide the required details'
                            : existingUser ? 'User already exists' : null;
    if(errorMessage) {
        res.status(400);
        throw new Error(errorMessage);
    } 

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword
    });

    if(newUser) {
        res.status(201).json({
            _id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            token: generateJWTToken(newUser.id),
            message: 'User registered'
        })
    } else {
        res.status(400);
        throw new Error('Invalid user details');
    }
});

/**
 * @desc Login existing user
 * @route POST /api/users/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    const validCredentials = user && bcrypt.compare(password, user.password);
    
    if(validCredentials) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            token: generateJWTToken(user.id),
            message: 'User logged in'
        });
    } else {
        res.status(400);
        throw new Error('Invalid user credentials');
    }
});

/**
 * @desc Get User Data
 * @route GET /api/users/get
 * @access Private
 */
const getUserData = asyncHandler(async (req, res) => res.status(200).json(req.user));

const generateJWTToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

module.exports = {
    createUser,
    loginUser,
    getUserData
};