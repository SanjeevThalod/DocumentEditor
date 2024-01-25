import express from "express";
import cors from 'cors';
import userRouter from "./Routes/userRoutes.mjs";

// MiddleWares
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api',userRouter);

export default app;