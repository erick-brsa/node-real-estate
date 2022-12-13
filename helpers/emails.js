import nodemailer from 'nodemailer';

export const emailRegister = async (data) => {
	const transport = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD
		}
	});

	const { name, email, token } = data;

	// Enviar el email
	await transport.sendMail({
		from: 'bienesraices.com',
		to: email,
		subject: 'Confirma tu cuenta en bienesraices.com',
		text: 'Confirma tu cuenta en bienesraices.com',
		html: `
            <p>Hola ${name}, comprueba tu cuenta en bienesracies.com</p>
            <p>Tu cuenta ya está lista, sólo debes confirmar en el siguiente enlace: 
                <a href="${process.env.BACKEND_URL}:${
			process.env.BACKEND_PORT ?? 3000
		}/auth/confirm/${token}">Confirmar cuenta</a>
            </p>
            `
	});
};

export const emailResetPassword = async (data) => {
	const transport = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD
		}
	});

	const { name, email, token } = data;

	// Enviar el email
	await transport.sendMail({
		from: 'bienesraices.com',
		to: email,
		subject: 'Reestablece tu contraseña en bienesraices.com',
		text: 'Reestablece tu contraseña en bienesraices.com',
		html: `
            <p>Hola ${name}, has solicitado reestablecer tu contraseña en bienesracies.com</p>
            <p>Sigue el siguiente enlace para generar una nueva contraseña: 
                <a href="${process.env.BACKEND_URL}:${
			process.env.BACKEND_PORT ?? 3000
		}/auth/reset-password/${token}">Reestablecer contraseña</a>
            </p>
			<p>Si tú no solicitaste este correo, puedes ignorar este mensaje</p>
            `
	});
};
