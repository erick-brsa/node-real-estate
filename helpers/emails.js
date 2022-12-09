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
                <a href="${process.env.BACKEND_URL}:${process.env.BACKEND_PORT ?? 3000}/auth/confirm/${token}">Confirmar cuenta</a>
            </p>
            `
	});
};

export const emailResetPassword = async () => {};
