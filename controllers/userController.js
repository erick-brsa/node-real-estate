import { check, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateId, emailRegister } from '../helpers/index.js';

export const loginForm = (req, res) => {
	res.render('auth/login', {
		page: 'Iniciar Sesión'
	});
};

export const registerForm = (req, res) => {
	res.render('auth/register', {
		page: 'Crear Cuenta',
		csrfToken: req.csrfToken()
	});
};

export const resetPassword = (req, res) => {
	res.render('auth/reset-password', {
		page: 'Recuperar Contraseña'
	});
};

export const registerUser = async (req, res) => {
	const { name, email, password } = req.body;

	await check('name')
		.notEmpty()
		.withMessage('El nombre es obligatorio')
		.run(req);
	await check('email')
		.isEmail()
		.withMessage('Eso no parece un email')
		.run(req);
	await check('password')
		.isLength({ min: 6 })
		.withMessage('La contraseña debe ser de al menos 6 caracteres')
		.run(req);
	await check('repeat_password')
		.equals('password')
		.withMessage('Las contraseñas no coinciden')
		.run(req);

	let result = validationResult(req);

	if (!result.isEmpty()) {
		return res.render('auth/register', {
			page: 'Crear Cuenta',
			csrfToken: req.csrfToken(),
			errors: result.array(),
			user: {
				name,
				email
			}
		});
	}

	// Verificar si el usuario ya existe
	const user = await User.findOne({ where: { email: req.body.email } });

	if (user) {
		return res.render('auth/register', {
			page: 'Crear Cuenta',
			csrfToken: req.csrfToken(),
			errors: [{ msg: 'El usuario ya está registrado' }],
			user: {
				name,
				email
			}
		});
	}

	// Almacenando registro
	const newUser = await User.create({
		name,
		email,
		password,
		token: generateId()
	});

	// Envía correo de confirmación
	emailRegister({
		name: newUser.name,
		email: newUser.email,
		token: newUser.token
	});

	// Mensaje de confirmación
	res.render('templates/message', {
		page: 'Cuenta creada correctamente',
		message:
			'Hemos enviado un correo de confirmación, revisa tu bandeja de entrada.'
	});
};

export const confirmUser = async (req, res) => {
	const { token } = req.params;

	const user = await User.findOne({ where: { token } });

	if (!user) {
		return res.render('auth/confirm-account', {
			page: 'Error al confirmar la cuenta',
			message: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
			error: true
		});
	}

	user.token = null;
	user.confirmed = true;

	await user.save();

	return res.render('auth/confirm-account', {
		page: 'Cuenta confirmada',
		message: 'La cuenta ha sido confirmada',
		error: false
	});
};
