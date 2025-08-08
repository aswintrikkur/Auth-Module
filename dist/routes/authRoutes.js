"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const passport_1 = __importDefault(require("../config/passport"));
const router = (0, express_1.Router)();
exports.authRouter = router;
router.post('/register', authControllers_1.registerUser);
router.post('/login', authControllers_1.loginUser);
router.get('/profile', authMiddlewares_1.userAuth, authControllers_1.getUserProfile);
router.get('/logout', authControllers_1.logoutUser);
/* Route to start OAuth2 authentication */
router.get('/google', passport_1.default.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'email'],
}));
/* Callback route for OAuth2 authentication */
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), function (req, res) {
    // Successful authentication
    console.log(req.user);
    req.session.save(() => {
        res.redirect('/'); // Edit for correct redirect link
    });
});
