import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import User from '../models/User.js';
import { generateId, generateJWT, emailRegister, emailResetPassword } from '../helpers/index.js';

export const loginForm = (req, res) => {
	res.render('auth/login', {
		page: 'Iniciar Sesión',
		csrfToken: req.csrfToken()
	});
};

export const authenticate = async (req, res) => {

	await check('email')
		.isEmail()
		.withMessage('El email es obligatorio')
		.run(req);
	await check('password')
		.notEmpty()
		.withMessage('La contraseña es obligatoria')
		.run(req);
	
	let result = validationResult(req);

	if (!result.isEmpty()) {
		return res.render('auth/login', {
			page: 'Iniciar Sesión',
			csrfToken: req.csrfToken(),
			errors: result.array(),
		});
	}
	
	// Comprobar si el usuario existe
	const { email, password } = req.body;

	const user = await User.findOne({ where: { email }});

	if (!user) {
		return res.render('auth/login', {
			page: 'Iniciar Sesión',
			csrfToken: req.csrfToken(),
			errors: [{ msg: 'El usuario no existe' }],
		});
	}
	
	if (!user.confirmed) {
		return res.render('auth/login', {
			page: 'Iniciar Sesión',
			csrfToken: req.csrfToken(),
			errors: [{ msg: 'Tu cuenta no ha sido confirmada' }],
		});
	}

	// Revisar password
	if(!user.checkPassword(password)) {
		return res.render('auth/login', {
			page: 'Iniciar Sesión',
			csrfToken: req.csrfToken(),
			errors: [{ msg: 'La contraseña es incorrecta' }],
		});
	}

	// Autenticar al usuario
	const token = generateJWT(user);
	return res.cookie('_token', token, {
		// httpOnly: true,
		// secure: true,
		// sameSite: true,
	}).redirect('/mis-propiedades')
};

export const registerForm = (req, res) => {
	res.render('auth/register', {
		page: 'Crear Cuenta',
		csrfToken: req.csrfToken()
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
		page: 'Cuenta Confirmada',
		message: 'La cuenta ha sido confirmada',
		error: false
	});
};

export const formResetPassword = (req, res) => {
	res.render('auth/forgot-password', {
		page: 'Recuperar Contraseña',
		csrfToken: req.csrfToken()
	});
};

export const resetPassword = async (req, res) => {
	await check('email')
		.isEmail()
		.withMessage('Eso no parece un email')
		.run(req);

	let result = validationResult(req);

	if (!result.isEmpty()) {
		return res.render('auth/forgot-password', {
			page: 'Recupera tu acceso',
			csrfToken: req.csrfToken(),
			errors: result.array()
		});
	}

	// Buscar al usuario
	const { email } = req.body;

	const user = await User.findOne({ where: { email } });

	if (!user) {
		return res.render('auth/forgot-password', {
			page: 'Recupera tu acceso',
			csrfToken: req.csrfToken(),
			errors: [{ msg: 'El correo no está registrado ' }]
		});
	}

	// Generar un token y enviar email
	user.token = generateId();
	await user.save();

	// Enviar email
	emailResetPassword({
		email: user.email,
		name: user.name,
		token: user.token
	});

	// Renderizar el mensaje
	res.render('templates/message', {
		page: 'Restablece tu contraseña',
		message: 'Hemos enviado un correo electrónico con las instrucciones'
	});
};

export const checkToken = async (req, res) => {
	const { token } = req.params;
	const user = await User.findOne({ where: { token } });

	if (!user) {
		return res.render('auth/reset-password', {
			page: 'Reestablece tu contraseña',
			message:
				'Hubo un error al validar tu información, intenta de nuevo',
			error: true
		});
	}

	res.render('auth/reset-password', {
		page: 'Reestablece tu contraseña',
		csrfToken: req.csrfToken()
	});
};

export const newPassword = async (req, res) => {
	await check('password')
		.isLength({ min: 6 })
		.withMessage('La contraseña debe ser de al menos 6 caracteres')
		.run(req);

	let result = validationResult(req);

	if (!result.isEmpty()) {
		return res.render('auth/reset-password', {
			page: 'Reestablece tu contraseña',
			csrfToken: req.csrfToken(),
			errors: result.array()
		});
	}

	const { token } = req.params;
	const { password } = req.body;

	const user = await User.findOne({ where: { token } });

	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(password, salt);
	user.token = null;
	await user.save();

	res.render('auth/confirm-account', {
		page: 'Contraseña reestablecida',
		message: 'La contraseña se reestableció correctamente'
	});
};

// Métodos personalizados
User.prototype.checkPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
} 
