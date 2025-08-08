"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import './types/express'; // Ensure TypeScript recognizes the extended Request type
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const errorHandlers_1 = require("./middlewares/errorHandlers");
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("./config/passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// app.use(express.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if using HTTPS
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Routes
app.get('/', (req, res) => { res.send('Welcome to the Auth API'); });
app.use('/api', routes_1.apiRouter);
// Global error handler (should be after routes)
app.use(errorHandlers_1.errorHandler);
exports.default = app;
