import express from 'express';
import {
	loginForm,
	registerForm,
	resetPassword,
	formResetPassword,
	registerUser,
	confirmUser,
	checkToken,
	newPassword
} from '../controllers/userController.js';

const router = express.Router();

router.get('/login', loginForm);

router.get('/register', registerForm);
router.post('/register', registerUser);
router.get('/confirm/:token', confirmUser);

router.get('/reset-password', formResetPassword);
router.post('/reset-password', resetPassword);

router.get('/reset-password/:token', checkToken);
router.post('/reset-password/:token', newPassword);

export default router;
