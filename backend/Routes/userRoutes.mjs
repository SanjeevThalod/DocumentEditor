import express from 'express';
import { addCollaborater, addDocument, createUser, deleteDocument, fetchById, fetchCollaborater, fetchDocuments, getUser, loginUser } from '../Controllers/userController.mjs';

const userRouter = express.Router();

// Create a new user
userRouter.post('/user', createUser);

// Log in a user
userRouter.post('/login', loginUser);

// Get user information based on name and email
userRouter.get('/users', getUser);

// fetch documents
userRouter.post('/fetchDocuments',fetchDocuments);

// add documents
userRouter.post('/addDocument',addDocument);

// delete documents
userRouter.post('/deletDocument',deleteDocument);

// fetch by Id
userRouter.post('/getbyId',fetchById);

// fetch collaborator
userRouter.post('/fetchColl',fetchCollaborater);

// add colaborator
userRouter.post('/addColl',addCollaborater);

export default userRouter;
