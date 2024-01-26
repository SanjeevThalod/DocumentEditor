import express from 'express';
import { addCollaborator, createDocument, deleteDocument, fetchCollDoc, fetchDocById, fetchDocuments } from '../Controllers/documentController.mjs';

const docRouter = express.Router();

// fetch documents
docRouter.post('/fetchDocuments',fetchDocuments);

// create documents
docRouter.post('/addDocument',createDocument);

// delete documents
docRouter.post('/deletDocument',deleteDocument);

// fetch by doc Id
docRouter.post('/getbyId',fetchDocById);

// fetch all collaborator of document
docRouter.post('/fetchColl',fetchCollDoc);

// add colaborator ot doc
docRouter.post('/addColl',addCollaborator);

export default docRouter;