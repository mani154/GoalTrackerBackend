const express = require('express');
const router = express.Router();
const { getAllGoals, getGoal, setGoal, updateGoal, deleteGoal } = require('../controllers/goalController');
const { authenticateUserToken } = require('../middleware/userAuthMiddleware');

router.route('/')
    .get(authenticateUserToken, getAllGoals)
    .post(authenticateUserToken, setGoal);

router.route('/:id')
    .get(authenticateUserToken, getGoal)
    .put(authenticateUserToken, updateGoal)
    .delete(authenticateUserToken, deleteGoal);

module.exports = router;