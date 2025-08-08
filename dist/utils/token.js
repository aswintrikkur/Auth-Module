"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Ensure JWT_SECRET is defined
const NODE_ENV = process.env.NODE_ENV;
const generateToken = (id, role = 'user') => {
    return jsonwebtoken_1.default.sign({ id, role }, JWT_SECRET);
};
exports.generateToken = generateToken;
