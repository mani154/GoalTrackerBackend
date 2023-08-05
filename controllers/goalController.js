const asyncHandler = require('express-async-handler');
const Goal = require('../models/goalModel');
const User = require('../models/userModel');

/**
 * @description: Get all goals
 * @route GET /api/goals
 * @access Private
 */
const getAllGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ userId: req.user.id });
    res.status(200).json({
        goals,
        message: 'Fetched all Goals'
    });
});

/**
 * @description: Get a specific goal
 * @route GET /api/goals/:id
 * @access Private  
 */
const getGoal = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const goal = await Goal.findById(id);
    if(!goal) {
        const errMsg = `Goal doesn't exist`;
        res.status(400);
        throw new Error(errMsg);
    }
    res.status(200).json({
        message: 'Fetched required Goal'
    });
});

/**
 * @description: Create a goal
 * @route POST /api/goals
 * @access Private
 */
const setGoal = asyncHandler(async (req, res) => {
    if(!req.body.text) {
        const errMsg = 'Please provide a goal';
        res.status(400);
        throw new Error(errMsg);
    }
    const goal = await Goal.create({
        text: req.body.text,
        userId: req.user.id
    });
    res.status(200).json({
        goal,
        message: 'Created Goal'
    })
});

/**
 * @description: Update a goal
 * @route PUT /api/goals
 * @access Private 
 */
const updateGoal = asyncHandler(async (req, res) => {
    const { params: { id }, user } = req;
    if(!user) {
        res.status(401);
        throw new Error('User not found');
    }
    const goal = await Goal.findById(id);
    if(!goal) {
        const errMsg = `Goal doesn't exist`;
        res.status(400);
        throw new Error(errMsg);
    }
    if(goal.userId.toString() !== user.id) {
        res.status(401);
        throw new Error('User unauthorized');
    }
    const updatedGoal = await Goal.findByIdAndUpdate(id, req.body, {
        new: true
    });
    res.status(200).json({
        updatedGoal,
        message: 'Updated Goal'
    })
});

/**
 * @description: Delete a goal
 * @route DELETE /api/goals
 * @access Private 
 */
const deleteGoal = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(req.user.id);
    if(!user) {
        res.status(401);
        throw new Error('User not found');
    }
    const goal = await Goal.findById(id);
    if(!goal) {
        const errMsg = `Goal doesn't exist`;
        res.status(400);
        throw new Error(errMsg);
    }
    if(goal.userId.toString() !== user.id) {
        res.status(401);
        throw new Error('User unauthorized');
    }
    await goal.remove();
    res.status(200).json({
        message: 'Deleted Goal'
    })
});


module.exports = {
    getAllGoals,
    getGoal,
    setGoal,
    updateGoal,
    deleteGoal
}