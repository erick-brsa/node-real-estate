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
