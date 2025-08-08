// import './types/express'; // Ensure TypeScript recognizes the extended Request type
import express from 'express';
import { apiRouter } from './routes';
import { errorHandler } from './middlewares/errorHandlers';
import session from 'express-session';
import passport from "./config/passport";
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {res.send('Welcome to the Auth API')});
app.use('/api', apiRouter);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
