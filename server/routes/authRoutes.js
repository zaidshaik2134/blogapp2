import express from 'express';
import { getMe, loginAdmin, registerAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
import { loginRules, registerRules } from '../middleware/validators.js';

const router = express.Router();

router.post('/register', registerRules, validateRequest, registerAdmin);
router.post('/login', loginRules, validateRequest, loginAdmin);
router.get('/me', protect, getMe);

export default router;
