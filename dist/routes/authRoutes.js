"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const router = (0, express_1.Router)();
exports.authRouter = router;
router.post('/register', authControllers_1.registerUser);
router.post('/login', authControllers_1.loginUser);
