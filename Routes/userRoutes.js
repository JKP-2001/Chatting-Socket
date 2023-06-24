const express = require('express');
const userRouter = express.Router();

// const { check, validationResult } = require('express-validator');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { fetchUser } = require('../Middlewares/fetchUser');
const { allUsers } = require('../Controllers.js/userController');

// const User = require('../models/User');
// const auth = require('../middleware/auth');

userRouter.get('/user/alluser',fetchUser,allUsers);

module.exports = userRouter;






