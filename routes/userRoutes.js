const express = require('express');
const router = express.Router();
const { createUser, loginUser, getUserData } = require('../controllers/userController');
const { authenticateUserToken } = require('../middleware/userAuthMiddleware');

router
    .post('/register', createUser)
    .post('/login', loginUser)
    .get('/get', authenticateUserToken, getUserData);

module.exports = router;