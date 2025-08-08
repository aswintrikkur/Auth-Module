// import './types/express'; // Ensure TypeScript recognizes the extended Request type
import express from 'express';
import { apiRouter } from './routes';
import { errorHandler } from './middlewares/errorHandlers';

const app = express();

app.use(express.json());

// Routes
app.get('/', (req, res) => {res.send('Welcome to the Auth API')});
app.use('/api', apiRouter);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
