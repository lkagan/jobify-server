import express from 'express';
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateMiddleware from './middleware/auth.js'
import dotenv from 'dotenv';
import connectDB from "./db/connect.js";
import 'express-async-errors';
import authRoutes from "./routes/authRoutes.js";
import jobsRoutes from "./routes/jobsRoutes.js";
import morgan from 'morgan';

const app = express();
dotenv.config();
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

app.get('/', (req, res) => {
    res.send('Welcome!');
});

// Routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', authenticateMiddleware, jobsRoutes);

// Middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => console.log(`Server listening on port ${port}`));
    } catch (err) {
        console.log(err);
    }
}

start();