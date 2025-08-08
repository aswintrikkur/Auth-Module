"use strict";
/* config/passport.js */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Dependencies */
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
const userModel_1 = require("../models/userModel"); // Import your user model
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/* Passport Middleware */
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '', // Client ID
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '', // Client secret
    callbackURL: 'https://auth-module-zv9o.onrender.com/api/auth/google/callback',
}, async function (token, tokenSecret, profile, done) {
    try {
        console.log(profile);
        const existingUser = await userModel_1.User.findOne({ googleId: profile.id });
        let user;
        if (existingUser) {
            user = existingUser;
        }
        else {
            user = await userModel_1.User.create({
                googleId: profile.id,
                first: profile.name?.givenName || "",
                last: profile.name?.familyName || "",
                email: profile.emails?.[0]?.value || "",
            });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err, false);
    }
}));
/* How to store the user information in the session */
passport_1.default.serializeUser(function (user, done) {
    done(null, user.id);
});
/* How to retrieve the user from the session */
passport_1.default.deserializeUser(async function (id, done) {
    try {
        const user = await userModel_1.User.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, undefined);
    }
});
/* Exporting Passport Configuration */
exports.default = passport_1.default;
