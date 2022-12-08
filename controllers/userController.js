import { check, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateId } from '../helpers/index.js';

export const loginForm = (req, res) => {
	res.render('auth/login', {
		page: 'Iniciar Sesión'
	});
};

export const registerForm = (req, res) => {
	res.render('auth/register', {
		page: 'Crear Cuenta'
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

	// Mensaje de confirmación
	res.render('templates/message', {
		page: 'Cuenta creada correctamente',
		message: 'Hemos enviado un correo de confirmación, revisa tu bandeja de entrada.'
	})
};
