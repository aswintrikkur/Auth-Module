"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import './types/express'; // Ensure TypeScript recognizes the extended Request type
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const errorHandlers_1 = require("./middlewares/errorHandlers");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Routes
app.get('/', (req, res) => { res.send('Welcome to the Auth API'); });
app.use('/api', routes_1.apiRouter);
// Global error handler (should be after routes)
app.use(errorHandlers_1.errorHandler);
exports.default = app;
