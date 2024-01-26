import express from "express";
import cors from 'cors';
import userRouter from "./Routes/userRoutes.mjs";
import docRouter from "./Routes/docRoutes.mjs";

// MiddleWares
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api',userRouter);
app.use('/api',docRouter);

export default app;