import { Router } from 'express';
import { login, getMe } from '../controllers/userController';
import { 
  register, 
  verifyEmail, 
  resendVerificationEmail, 
  deleteAccount,
  restoreAccount
} from '../controllers/authController';
import { protect } from '../middleware/auth';

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 * 
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/restore-account', restoreAccount);

// Protected routes
router.use(protect); // All routes after this middleware are protected
router.get('/me', getMe);
router.delete('/delete-account', deleteAccount);

export default router;
