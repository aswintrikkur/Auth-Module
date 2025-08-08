// import './types/express'; // Ensure TypeScript recognizes the extended Request type
import express from 'express';
import { apiRouter } from './routes';
import { errorHandler } from './middlewares/errorHandlers';

const app = express();

app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;

type Test = {
  id: string;
};

const test: Test = { id: '123' }; // Example variable to ensure the file is not empty
