import { Router } from 'express';
import {
  getUserProfile,
  loginUser,
  registerUser,
} from '../controllers/authControllers';
import { userAuth } from '../middlewares/authMiddlewares';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', userAuth, getUserProfile);


export { router as authRouter };
