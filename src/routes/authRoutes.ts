import { Router } from 'express';
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/authControllers';
import { userAuth } from '../middlewares/authMiddlewares';
import passport from '../config/passport';
import { Request, Response } from 'express';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', userAuth, getUserProfile);
router.get('/logout', logoutUser);

/* Route to start OAuth2 authentication */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'email'],
  }),
);

/* Callback route for OAuth2 authentication */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req: any, res: Response) {
    // Successful authentication
    console.log(req.user);
    req.session.save(() => {
      res.redirect('/'); // Edit for correct redirect link
    });
  },
);

export { router as authRouter };
