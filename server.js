import express from 'express';
import "express-async-errors";
import dotenv from 'dotenv';
import colors from 'colors';
import cors from "cors";
import morgan from "morgan";
//files
import connectDB from './config/db.js';

//routes
import testRoutes from './routes/testroutes.js';
import authRoutes from './routes/authRoute.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import jobsRoutes from './routes/jobsRoutes.js';

// Dot ENV config
dotenv.config();

// MongoDB connection
connectDB();

// Express app setup

const app = express();

// Middleware
app.use(express.json());
app.use(cors())
app.use(morgan("dev")) //time-taken ports

// Routes
app.use("/api/v1/test", testRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/jobs",jobsRoutes);


//validation Middleware
app.use(errorMiddleware);

// Port configuration
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
    console.log(`Node Server Running in ${process.env.DEV_MODE} Mode on port ${PORT}`.bgCyan.white);
});
