const express = require('express');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const { connectToDB } = require('./config/database');

connectToDB();
const app = express();
const port = process.env.PORT || 5555;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler);