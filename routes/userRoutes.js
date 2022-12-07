import express from 'express';
import {
	loginForm,
	registerForm,
	resetPassword
} from '../controllers/userController.js';

const router = express.Router();

router.get('/login', loginForm);
router.get('/register', registerForm);
router.get('/reset-password', resetPassword);

export default router;
