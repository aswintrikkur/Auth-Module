/* config/passport.js */

/* Dependencies */
import passport from 'passport';
import googleStrategy from 'passport-google-oauth20';
const GoogleStrategy = googleStrategy.Strategy;
import { User } from '../models/userModel'; // Import your user model
import dotenv from 'dotenv';
dotenv.config();

/* Passport Middleware */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '', // Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '', // Client secret
      callbackURL: 'https://auth-module-zv9o.onrender.com/api/auth/google/callback',
    },
    async function (token, tokenSecret, profile, done) {
      try {
        console.log(profile);
        const existingUser = await User.findOne({ googleId: profile.id });
        let user;
        if (existingUser) {
          user = existingUser;
        } else {
          user = await User.create({
            googleId: profile.id,
            first: profile.name?.givenName || "",
            last: profile.name?.familyName || "",
            email: profile.emails?.[0]?.value || "",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

/* How to store the user information in the session */
passport.serializeUser(function (user:any, done) {
  done(null, user.id);
});

/* How to retrieve the user from the session */
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, undefined);
  }
});

/* Exporting Passport Configuration */
export default passport;
