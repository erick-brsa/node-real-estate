import express from 'express';
import {
	loginForm,
	registerForm,
	resetPassword,
	registerUser,
	confirmUser
} from '../controllers/userController.js';

const router = express.Router();

router.get('/login', loginForm);
router.get('/register', registerForm);
router.get('/reset-password', resetPassword);
router.get('/confirm/:token', confirmUser);
router.post('/register', registerUser);

export default router;
