import express from 'express';
import {createUser, getUser, loginUser } from '../Controllers/userController.mjs';

const userRouter = express.Router();

// Create a new user
userRouter.post('/user', createUser);

// Log in a user
userRouter.post('/login', loginUser);

// Get user information based on name and email
userRouter.get('/users', getUser);

export default userRouter;
