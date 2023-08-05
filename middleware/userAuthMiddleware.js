const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const authenticateUserToken = asyncHandler(async (req, res, next) => {
    let token;
    if(req.headers.authorization?.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Get token excluding 'Bearer' keyword
            
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {}); 

            req.user = await User.findById(decodedToken.id).select('-password'); // Retrieve user details from the verified token without password'

            next();
        } catch(err) {
            console.log(err);
            res.status(401);
            throw new Error('Error in authenticating user token');
        }
    }
    if(!token) {
        res.status(401);
        throw new Error('Authentication error, no token generated');
    }
});

module.exports = { 
    authenticateUserToken 
};